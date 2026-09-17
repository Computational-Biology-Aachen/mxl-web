<!--
 @component
 NDE showcase fork of $lib/Fit.svelte, fit a model's parameters to uploaded
 data, single-model or ensemble (ADR 0004, ADR 0006). Only difference from
 the original: `csv`/`timeColumn`/`targets` start pre-seeded with this
 page's hardcoded predator-prey dataset instead of `null`/`undefined`/`[]`,
 so the popover opens ready to fit — everything else, including the ability
 to upload a different file over this default, is unchanged.

 Runs entirely against the WASM backend (radau5): fitWorker.ts vendors
 cminpack's lmdif alongside the integrators so the fit's inner loop never
 leaves WASM. Fitting is chunked — see docs/adrs/0004-fit-model-to-data.md —
 so progress can be shown and the run cancelled mid-fit. Ensemble mode runs N
 independent, non-interacting FitSessions from randomly-drawn starting
 points — see docs/adrs/0006-ensemble-fitting.md.
-->

<script lang="ts">
  import { untrack } from "svelte";
  import {
    Button,
    InputNumberOptional,
    Row,
  } from "@computational-biology-aachen/design";
  import H2 from "@computational-biology-aachen/design/H2.svelte";
  import {
    buildNNBlock,
    type ModelBuilderBase,
  } from "@computational-biology-aachen/mxlweb-core";
  import { parseCsvFile, type ParsedCsv } from "$lib/csvParse";
  import {
    defaultCurriculum,
    finalStageBudget,
    type CurriculumStage,
  } from "$lib/fit/curriculum";
  import {
    runCurriculumFit,
    type CurriculumRunHandle,
  } from "$lib/fit/curriculumRunner";
  import CurriculumStagesEditor from "$lib/fit/CurriculumStagesEditor.svelte";
  import {
    buildFitConfig,
    residualPerPoint,
    type BackendChoice,
    type FitConfig,
  } from "$lib/fit/fitConfig";
  import type { FitParameterConfig, FitTargetMapping } from "$lib";
  import LineChart, { type PhaseRegion } from "$lib/LineChart.svelte";
  import {
    mulberry32,
    sampleDistribution,
    type FitDistribution,
    type FitDistributionFamily,
  } from "$lib/random";
  import SimErrDisplay from "$lib/SimErrDisplay.svelte";
  import { backends, createWasmPool } from "$lib/stores/backends";
  import type { WorkerPool } from "$lib/stores/workerPool";
  import {
    WorkerManager,
    type SimulationError,
    type SimulationResult,
  } from "$lib/stores/workerStore";
  import { arrayColumn } from "$lib/utils";

  let {
    model,
    popovertarget,
    onApply,
  }: {
    model: ModelBuilderBase;
    popovertarget: string;
    /** Called after "Apply fitted parameters" writes into model.parameters —
     * wired by AnalysesDashboard to re-run every other analysis box. */
    onApply?: () => void;
  } = $props();

  // Every field below is this popover's own transient config — fitting is
  // never persisted (not in .mxl.json, no localStorage/URL) and this popover
  // is a dashboard-wide singleton, not one of several DynBoxRow boxes, so
  // there's no parent object to thread these through any more.
  let mode = $state<"single" | "ensemble">("single");
  // Purely cosmetic: how many evaluations/steps pass between chart/preview
  // refreshes. Deliberately *not* the same thing as chunkMaxfev (below,
  // computed) — that's the optimizer's own per-chunk budget, a correctness
  // concern for "lm"/"lm-jacobian" (see chunkMaxfev's own doc comment) that
  // users should never need to touch. This value is sent to the worker as
  // FitInitRequest.progressUpdateInterval, which fires a genuine mid-chunk
  // FitProgress (`intermediate: true`) from inside the C driver's own
  // evaluation loop every N evals/steps — independent of chunkMaxfev — so
  // the UI actually redraws at the requested cadence instead of only once
  // per (much coarser) chunk.
  let progressUpdateInterval = $state(5);
  let targetResidualNorm = $state(1e-1);
  let maxFunctionEvaluations = $state(1000);

  // Patience-based early stopping (single-fit and ensemble alike): lmdif's
  // own chunked `done` flag only reflects true convergence (ftol/xtol/gtol)
  // or a hard error, so a run stuck near a flat/degenerate Jacobian can
  // report "chunk exhausted, not done" forever without ever tripping that
  // flag — burning the rest of maxFunctionEvaluations for no improvement.
  // Counts consecutive *chunks*, not evaluations, so it scales with
  // chunkMaxfev (computed below), not progressUpdateInterval above.
  const FIT_PATIENCE_CHUNKS = 20;
  const FIT_MIN_DELTA = 1e-3;

  let yMaxValue = $state(10);
  let yMaxAuto = $state(true);
  let yMax = $derived(yMaxAuto ? undefined : yMaxValue);

  // Chart.js palette for ensemble mode's multi-series charts (ADR 0006
  // §2.6) — a target's shaded band and a member's convergence line each
  // need an explicit, stable-per-index color, since default auto-cycling
  // would desync once several datasets share one target/member.
  const CHART_PALETTE = [
    "#4e79a7",
    "#f28e2b",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc948",
    "#b07aa1",
    "#ff9da7",
    "#9c755f",
    "#bab0ac",
  ];
  function paletteColor(i: number): string {
    return CHART_PALETTE[i % CHART_PALETTE.length];
  }
  function withAlpha(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // ---- Data upload + column mapping --------------------------------------

  // Fork of $lib/Fit.svelte (see that file's header comment for the fitting
  // design) pre-seeded with this showcase's own hardcoded predator-prey
  // dataset, so the page opens ready to fit rather than waiting on a file
  // upload — the rest of this component is unmodified, including the
  // ability to re-upload a different file over this default.
  const NDE_SHOWCASE_CSV: ParsedCsv = {
    headers: ["time", "Prey", "Predator"],
    columns: {
      time: [
        0.0, 2.5, 5.0, 7.5, 10.0, 12.5, 15.0, 17.5, 20.0, 22.5, 25.0, 27.5,
        30.0, 32.5, 35.0, 37.5, 40.0, 42.5, 45.0, 47.5, 50.0, 52.5, 55.0, 57.5,
        60.0,
      ],
      Prey: [
        10.0914, 9.5579, 11.2646, 13.5455, 15.3597, 19.6962, 25.7941, 31.1107,
        35.5131, 32.1239, 23.1525, 14.3472, 10.497, 10.069, 10.6499, 12.0079,
        15.2916, 18.3989, 24.441, 29.4258, 34.3645, 34.234, 27.4168, 16.233,
        11.1235,
      ],
      Predator: [
        9.8944, 6.1014, 3.7477, 2.5175, 1.9286, 1.8628, 2.0108, 3.0749, 6.065,
        13.4351, 20.4097, 17.648, 11.527, 6.9765, 4.4284, 2.8789, 2.0826, 1.724,
        1.8897, 2.6202, 4.8314, 10.639, 18.4016, 19.6486, 13.8617,
      ],
    },
    rowCount: 25,
  };

  let csv = $state<ParsedCsv | null>(NDE_SHOWCASE_CSV);
  let timeColumn = $state<string | undefined>("time");
  let targets = $state<FitTargetMapping[]>([
    { column: "Prey", key: "Prey", kind: "state" },
    { column: "Predator", key: "Predator", kind: "state" },
  ]);
  // No mechanistic parameters exist on this model (model.ts's doc comment)
  // — the NN block is the only thing there is to fit.
  let fitParameters = $state<FitParameterConfig[]>([]);

  // Candidate fit targets: state variables + derived quantities — the same
  // source TimeCourse.svelte uses for its "select derived" UI.
  let candidateKeys = $derived([
    ...model.getNames().map((key) => ({ key, kind: "state" as const })),
    ...[...model.sortDependencies(), ...model.sortReadoutDependencies()].map(
      (key) => ({ key, kind: "derived" as const }),
    ),
  ]);

  function autoMapColumns() {
    if (!csv) return;
    if (!timeColumn) {
      const guess = csv.headers.find((h) => /^t(ime)?$/i.test(h));
      timeColumn = guess ?? csv.headers[0];
    }
    const displayNames = model.getDisplayNames();
    const mapped: FitTargetMapping[] = [];
    for (const header of csv.headers) {
      if (header === timeColumn) continue;
      const match = candidateKeys.find(
        ({ key }) =>
          key.toLowerCase() === header.toLowerCase() ||
          (displayNames.get(key) ?? "").toLowerCase() === header.toLowerCase(),
      );
      if (match) {
        mapped.push({ column: header, key: match.key, kind: match.kind });
      }
    }
    targets = mapped;
  }

  function setTargetColumn(column: string, key: string) {
    const match = candidateKeys.find((c) => c.key === key);
    if (!match) return;
    // A key can only be mapped from one column at a time — remapping it here
    // implicitly un-maps whichever other column previously used it, rather
    // than silently duplicating a residual row for the same model quantity.
    const rest = targets.filter((t) => t.column !== column && t.key !== key);
    targets = [...rest, { column, key, kind: match.kind }];
  }

  function unmapColumn(column: string) {
    targets = targets.filter((t) => t.column !== column);
  }

  let fileInput = $state<HTMLInputElement | null>(null);
  let fileError = $state<string | null>(null);

  async function handleFile(event: Event) {
    fileError = null;
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      csv = await parseCsvFile(file);
      autoMapColumns();
    } catch (e) {
      fileError = e instanceof Error ? e.message : "Failed to parse file";
    }
    input.value = "";
  }

  // ---- Parameter selection -------------------------------------------

  // An NN block's own scale is a Parameter but never an individual table
  // row (ADR 0005 §2.1.3) — fitting it is the block's own "trained" toggle
  // (TableNNBlocks), not a per-row checkbox here. Weights/biases need no
  // such exclusion any more: they live in model.nnWeights, structurally
  // separate from model.parameters (mxl-schemas nn_blocks v2), so a 6×64
  // block's ≈20,800 of them were never candidates for this list to begin
  // with.
  let nnBlockScaleParams = $derived(model.nnBlockScaleParameterNames());
  let trainedBlockKeys = $derived(
    [...model.nnBlocks.entries()]
      .filter(([, config]) => config.trained)
      .map(([key]) => key),
  );
  let hasTrainedNNBlock = $derived(trainedBlockKeys.length > 0);

  // ---- Fit backend (ADR 0005 §2.3 amendment) --------------------------

  // ADR 0005 §2.3 originally forced "adjoint" unconditionally on any
  // trained NN block and hid the choice entirely ("the audience should
  // never need to know an optimizer choice exists"). Now that
  // mxlweb-core also has an analytic-Jacobian LM path (jacobianWat,
  // jacobian_wrapper.c) that's both faster and numerically more reliable
  // than finite-difference "lm" for a small block, and than "adjoint"'s
  // per-step cost, there's a real choice worth exposing rather than
  // guessing silently — all three are user-selectable, defaulting to a
  // suggested one per model (below), not forced. Same as $lib/Fit.svelte;
  // this fork doesn't diverge here beyond the pre-seeded dataset (see
  // this file's own doc comment). This used to be a showcase-only
  // experiment that unconditionally forced "lm-jacobian" whenever an NN
  // block was trained — now that the shared component itself exposes and
  // suggests the same backend, that's no longer a special case here.
  // (BackendChoice itself now lives in $lib/fit/fitConfig.ts, shared with
  // Fit.svelte/FitUde.svelte.)

  // Both "adjoint" and "lm-jacobian" are v1-restricted to state-variable
  // fit targets — each needs a *second* generated gradient/Jacobian graph
  // over derived_fn's own expression tree to support a derived-quantity
  // target, which doesn't exist yet (adjoint_wrapper.c's and
  // jacobian_wrapper.c's own doc comments in mxlweb-core). Straightforward
  // to add later (mirrors the existing state-target graph, just built over
  // a different expression tree) — not done yet.
  let hasDerivedTarget = $derived(targets.some((t) => t.kind === "derived"));

  // Total scalar fit-parameters (weights + the block's own scale) across
  // every *trained* block — the actual cost driver for "lm-jacobian"'s
  // augmented system (sized n_y*(1+n_theta)) and for "adjoint"'s per-step
  // cost, not block count.
  let trainedNNParamCount = $derived(
    trainedBlockKeys.reduce(
      (sum, key) => sum + 1 + model.nnBlockWeightNames(key).size,
      0,
    ),
  );

  // Placeholder threshold, deliberately uncalibrated against real models
  // (same caveat as ADR 0005 §2.4's own unimplemented mechanistic
  // heuristic) — chosen only to comfortably cover this session's proven
  // case (a 1-hidden-layer-of-4 block, ~20 fit params, converges reliably
  // in 30-300 evals under "lm-jacobian") while staying orders of magnitude
  // below ADR 0005 §2.3's "obviously intractable" example (a 6×64 block's
  // ≈20,800 weights). This showcase's own default architecture (one hidden
  // layer, softplus activation) is comfortably below it.
  const SMALL_NN_BLOCK_PARAM_THRESHOLD = 50;

  // Fitting a mechanistic parameter *alongside* a trained NN block hits a
  // real bug in buildJacobianGraph's codegen (modelIr.ts) — confirmed
  // empirically on the UDE showcase (its default Alpha+Beta+NN-block fit
  // throws "Maximum call stack size exceeded" under "lm-jacobian", while
  // "adjoint" handles the exact same fit fine). This showcase's model has
  // its own mechanistic parameters too now (Beta/Delta, fixing predation's
  // stoichiometric ratio — see model.ts), unchecked by default like every
  // parameter (ADR 0004 §2.4), so this only trips if the user opts one in;
  // logic kept identical to $lib/Fit.svelte and FitUde.svelte rather than
  // special-cased for "usually empty". Root cause is presumably
  // buildJacobianGraph's n_y independent reverse-mode passes lacking
  // buildAdjointGraph's memoization across passes — not fixed here, just
  // avoided as a suggestion trigger until it is.
  let hasMechanisticFitParam = $derived(fitParameters.some((p) => p.fit));

  function suggestBackend(): BackendChoice {
    if (!hasTrainedNNBlock) return "lm";
    if (hasDerivedTarget) return "adjoint"; // lm-jacobian can't do this yet
    if (hasMechanisticFitParam) return "adjoint"; // lm-jacobian's codegen bug
    return trainedNNParamCount <= SMALL_NN_BLOCK_PARAM_THRESHOLD
      ? "lm-jacobian"
      : "adjoint";
  }

  // Every fit-parameter, mechanistic + NN (weights + each trained block's
  // own scale) — the count that actually matters for chunkMaxfev below, not
  // just the NN side trainedNNParamCount alone covers.
  let totalFitParamCount = $derived(
    fitParameters.filter((p) => p.fit).length + trainedNNParamCount,
  );

  // The optimizer's own per-chunk budget — *not* user-facing (see
  // progressUpdateInterval above for the field that used to conflate the
  // two). Always computed live from the current fit-parameter count, not a
  // one-time per-model suggestion: unlike backendChoice, there's no
  // legitimate reason for a user to override this downward (it's not a
  // preference, it's a correctness floor) or upward (more room never hurts,
  // so there's nothing to trade off), so it just tracks totalFitParamCount
  // directly and stays correct even if the user toggles more parameters
  // into the fit mid-session.
  //
  // "lm"/"lm-jacobian" can't make any real progress in a chunk whose budget
  // doesn't comfortably exceed the fit-parameter count: lmdif's own fdjac2
  // needs n extra evals per outer iteration just for its finite-difference
  // Jacobian (fit_wrapper.c's fit_chunk hard-requires budgetLeft > n before
  // even attempting one — a smaller chunk returns "improper input" without
  // ever calling lmdif); lmder doesn't have that same hard requirement, but
  // a chunk that tight still starves its trust region of room to make real
  // progress before the next chunk cold-restarts it from scratch. Confirmed
  // empirically on the UDE showcase's own default 25-parameter fit
  // (Alpha+Beta+NN block): silently failed outright under "lm" with a flat
  // default of 5 (never cleared fit_chunk's own budgetLeft>n guard) and
  // stalled flat under "lm-jacobian" (5 evals/chunk, nowhere near enough
  // room) — raising it to 60 (> 25 fit params there) made both converge
  // below target. Harmless overkill for "adjoint", which has no such
  // requirement, so this doesn't need to be backend-specific. Deliberately
  // uncalibrated margin (same caveat as SMALL_NN_BLOCK_PARAM_THRESHOLD
  // above) — just comfortably clears the hard minimum with room for a few
  // outer iterations, not tuned against real models.
  let chunkMaxfev = $derived(Math.max(5, totalFitParamCount + 20));

  // The curriculum stage editor's own x-axis — independent of buildFitConfig
  // succeeding (targets need not be mapped yet), so the schedule can be set
  // up before or while picking fit targets. Falls back to a placeholder
  // scale before any data is loaded; existing stage cutoffs get reinterpreted
  // against the real range once it is, via resolveCutoffT's own clamping.
  let curriculumTEnd = $derived.by(() => {
    if (!csv || !timeColumn) return 100;
    const values = (csv.columns[timeColumn] ?? []).filter((t) =>
      Number.isFinite(t),
    );
    return values.length > 0 ? Math.max(...values) : 100;
  });

  function backendLabel(choice: BackendChoice): string {
    switch (choice) {
      case "lm":
        return "Levenberg-Marquardt";
      case "lm-jacobian":
        return "Levenberg-Marquardt (analytic Jacobian)";
      case "adjoint":
        return "adjoint";
    }
  }

  // One suggestion per model, not a forced/re-forced decision: re-runs only
  // when `model` itself changes identity (this popover is a dashboard-wide
  // singleton reused across "Load"s, ADR 0006 §2.4's own framing) — every
  // other reactive read inside is untracked so toggling an NN block's
  // "trained" state or remapping a target afterward never silently
  // overwrites the user's own choice.
  let backendChoice = $state<BackendChoice>("lm");
  $effect(() => {
    void model;
    untrack(() => {
      backendChoice = suggestBackend();
    });
  });

  // Not all parameters fit by default (ADR 0004 §2.4) — a parameter not yet
  // in fitParameters defaults to unchecked.
  let paramRows = $derived(
    [...model.parameters.keys()]
      .filter((id) => !nnBlockScaleParams.has(id))
      .map((id) => {
        const existing = fitParameters.find((p) => p.id === id);
        return existing ?? { id, fit: false, logSpace: true };
      }),
  );

  function updateParamRow(id: string, update: Partial<FitParameterConfig>) {
    const current = fitParameters.find((p) => p.id === id) ?? {
      id,
      fit: false,
      logSpace: true,
    };
    fitParameters = [
      ...fitParameters.filter((p) => p.id !== id),
      { ...current, ...update },
    ];
  }

  // ---- Ensemble distribution defaults & editing ---------------------------

  // Relative, not absolute, defaults (ADR 0006 §2.1) — mxlbricks/mxlmodels'
  // kinetic constants span many orders of magnitude, so a fixed absolute
  // std/range would be wrong for nearly every row out of the box.
  function defaultNormal(value: number): FitDistribution {
    return {
      family: "normal",
      mean: value,
      std: Math.max(Math.abs(value) * 0.2, 1e-9),
    };
  }
  function defaultUniform(value: number): FitDistribution {
    const a = value * 0.5;
    const b = value * 2;
    return { family: "uniform", min: Math.min(a, b), max: Math.max(a, b) };
  }
  function defaultLogUniform(value: number): FitDistribution {
    const magnitude = Math.max(Math.abs(value), 1e-9);
    return { family: "logUniform", min: magnitude * 0.5, max: magnitude * 2 };
  }
  // Same 20% magnitude as defaultNormal, abs+floored like defaultLogUniform
  // — log-normal requires a strictly positive median, so a zero/negative
  // live parameter value falls back to its magnitude rather than a
  // different family entirely.
  function defaultLogNormal(value: number): FitDistribution {
    return {
      family: "logNormal",
      mean: Math.max(Math.abs(value), 1e-9),
      std: Math.max(Math.abs(value) * 0.2, 1e-9),
    };
  }
  // Log-normal is the default for a fresh row (never goes negative, same
  // relative spread for every parameter regardless of its magnitude) —
  // Normal stays fully selectable, just no longer what a new row starts as.
  function defaultDistributionFor(id: string): FitDistribution {
    return defaultLogNormal(model.parameters.get(id)?.value ?? 0);
  }
  function setDistributionFamily(id: string, family: FitDistributionFamily) {
    const value = model.parameters.get(id)?.value ?? 0;
    const distribution =
      family === "normal"
        ? defaultNormal(value)
        : family === "logNormal"
          ? defaultLogNormal(value)
          : family === "uniform"
            ? defaultUniform(value)
            : defaultLogUniform(value);
    updateParamRow(id, { distribution });
  }
  function updateDistributionField(id: string, field: string, value: number) {
    const row = fitParameters.find((p) => p.id === id);
    const distribution = row?.distribution;
    if (!distribution) return;
    updateParamRow(id, {
      distribution: { ...distribution, [field]: value } as FitDistribution,
    });
  }

  // Distribution inputs are edited as % of a reference value rather than
  // absolute numbers (kinetic constants span many orders of magnitude, same
  // reasoning as defaultNormal/defaultUniform/defaultLogUniform's own 20%/
  // 50%/200% defaults) — storage stays absolute throughout, only the input
  // boxes convert at the UI edge.
  const PERCENT_EPSILON = 1e-9;

  function toPercent(absolute: number, reference: number): number {
    return Math.abs(reference) < PERCENT_EPSILON
      ? 0
      : (absolute / reference) * 100;
  }

  // Spinner/arrow-key step for an absolute-value input, one decade finer
  // than the value's own magnitude — step="any" falls back to a default
  // step of 1, which for a value like 0.1 jumps to 1.1 on a single
  // keypress. 10 presses now traverse one decade (0.1 -> 0.11 -> ... -> 0.2)
  // instead.
  function magnitudeStep(value: number): number {
    const magnitude = Math.abs(value);
    if (magnitude === 0 || !Number.isFinite(magnitude)) return 1;
    return 10 ** (Math.floor(Math.log10(magnitude)) - 1);
  }

  // Uniform/logUniform have no stored "center" the way normal has `mean` —
  // their defaults scale off the model's live current parameter value
  // instead, so that's the reference their % inputs use too. logUniform
  // uses its magnitude (defaultLogUniform's own baseline), uniform keeps the
  // sign (defaultUniform's value*0.5/value*2 scaling).
  function distributionPercentReference(
    id: string,
    distribution: FitDistribution,
  ): number {
    const value = model.parameters.get(id)?.value ?? 0;
    return distribution.family === "logUniform" ? Math.abs(value) : value;
  }

  function updateDistributionPercentField(
    id: string,
    field: string,
    percent: number,
    reference: number,
  ) {
    if (Math.abs(reference) < PERCENT_EPSILON) return;
    updateDistributionField(id, field, (percent / 100) * reference);
  }

  const MAX_ENSEMBLE_SIZE = 16;

  let ensembleSize = $state(8);
  let ensembleSeed = $state(Math.floor(Math.random() * 2 ** 31));
  let filterOutliers = $state(true);

  function clampEnsembleSize(n: number): number {
    return Math.max(1, Math.min(Math.round(n) || 1, MAX_ENSEMBLE_SIZE));
  }

  // ---- Shared fit-config building (single + ensemble) --------------------
  // FitTargetEntry/FitConfig/buildFitConfig now live in $lib/fit/fitConfig.ts,
  // shared with Fit.svelte/FitUde.svelte and every curriculum stage
  // ($lib/fit/curriculumRunner.ts).

  // ---- Curriculum schedule (optional; a single 100%-cutoff stage
  // reproduces a plain fit exactly) — see $lib/fit/curriculum.ts. The single
  // default stage's own `maxIterations` is a placeholder (it's always the
  // *final* stage, whose iteration budget the runner ignores in favor of
  // maxFunctionEvaluations/targetResidualNorm below) — not read from
  // maxFunctionEvaluations itself, so this doesn't need to stay in sync
  // with it.
  let stages = $state<CurriculumStage[]>(defaultCurriculum(1000));

  // Consecutive mid-chunk solver failures tolerated — via perturb-and-retry
  // — before giving up on a curriculum stage; see curriculumRunner.ts.
  const MAX_CONSECUTIVE_SOLVER_ERRORS = 10;
  const PERTURBATION_SCALE = 1e-3;

  // ---- Single-model fit run ------------------------------------------

  let session: CurriculumRunHandle | null = null;
  let running = $state(false);
  let errorMsg = $state<string | null>(null);
  let nfev = $state(0);
  let residualNorm = $state<number | null>(null);
  // Current best-fit full parameter vector, id -> value — a run result, not
  // a saved config choice, so it lives here rather than in FitParameterConfig
  // (ADR 0004 §2.11). null until the first chunk's progress has landed.
  let fittedValues = $state<Record<string, number> | null>(null);
  // One entry per chunk response across the *whole* curriculum run — reset
  // only at runFit()'s own start, never per stage, so nfev is a true
  // cumulative step count rather than restarting at 0 (and the chart
  // appearing to snap back to the left edge) at every stage transition.
  let residualHistory = $state<{ nfev: number; residualNorm: number }[]>([]);
  const PHASE_COLORS = ["rgba(0, 97, 101, 0.08)", "rgba(246, 168, 0, 0.08)"];
  function phaseColor(index: number): string {
    return PHASE_COLORS[index % PHASE_COLORS.length];
  }
  // Deterministic, event-independent stage windows shared by single-fit and
  // ensemble mode alike — each stage's *nominal* budget window (mirroring
  // stageBudget's own per-stage calc below), fixed and in stage order
  // regardless of how a run actually behaves (an early convergence, a
  // solver-error retry, ...). Unlike residualHistory, this deliberately
  // doesn't track a run's own live progress — shading transitions from
  // actual runtime events made them jump around under retries/early
  // convergence, and for ensemble mode there's no single such timeline to
  // begin with (members progress through stages at genuinely different
  // real paces).
  let phaseRegions = $derived.by(() => {
    // A single stage is a plain (non-curriculum) fit — shading "Stage 1
    // (final)" over the entire chart says nothing and just looks like an
    // unexplained tint.
    if (stages.length <= 1) return [];
    const regions: PhaseRegion[] = [];
    let cumulative = 0;
    for (let i = 0; i < stages.length; i++) {
      const budget =
        i < stages.length - 1
          ? stages[i].maxIterations
          : finalStageBudget(stages, maxFunctionEvaluations);
      regions.push({
        start: cumulative,
        end: cumulative + budget,
        color: phaseColor(i),
        label: `Stage ${i + 1}${i === stages.length - 1 ? " (final)" : ""}`,
      });
      cumulative += budget;
    }
    return regions;
  });
  // Which curriculum stage is currently running, 0-indexed, and how many
  // stages the schedule has — 1-of-1 for a plain (non-curriculum) fit, so
  // the UI only needs to show this when stageCount > 1.
  let stageIndex = $state(0);
  let stageCount = $state(1);
  // A non-final stage's progress is bounded by its own share of the fixed
  // total budget; the final stage gets whatever's left of it (see
  // $lib/fit/curriculum.ts's finalStageBudget / $lib/fit/curriculumRunner.ts).
  let stageBudget = $derived(
    stageIndex < stages.length - 1
      ? stages[stageIndex].maxIterations
      : finalStageBudget(stages, maxFunctionEvaluations),
  );
  let progressFraction = $derived(Math.min(nfev / Math.max(stageBudget, 1), 1));
  // True once a run has stopped because it's genuinely finished (converged,
  // hit the residual target, or hit the max-evaluations cap) — as opposed to
  // still running or cancelled. Forces the progress bar to 100%: nfev/max
  // alone is misleading on completion, since a fit that converges well
  // under the cap would otherwise show a small, seemingly-unfinished bar.
  let fitComplete = $state(false);
  // True when the run stopped because of patience-based stalling (below),
  // not genuine lmdif convergence — lmdif's own chunked `done` flag only
  // reflects true convergence (ftol/xtol/gtol) or a hard error, so a run
  // stuck near a flat/degenerate Jacobian can report "chunk exhausted, not
  // done" forever without ever tripping that flag. Distinguished from plain
  // "converged" in the targetMissed message below, rather than folded into
  // it, since a stuck-in-a-local-minimum stop deserves a clearer flag than
  // wording that could read as a mild success.
  let fitStalled = $state(false);
  // A finished fit can stop short of targetResidualNorm — e.g. lmdif's own
  // convergence criteria decide there's no further improvement to be had, or
  // maxFunctionEvaluations runs out first — without that being an error.
  // Surfaced in the UI rather than silently showing a residual norm that
  // looks like it should have kept improving.
  let targetMissed = $derived(
    fitComplete && residualNorm !== null && residualNorm > targetResidualNorm,
  );

  let trajectory = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });
  let trajectoryErr = $state<SimulationError | undefined>(undefined);
  let previewRequestId: string | null = null;

  function previewTrajectory(parValues: number[], tEnd: number) {
    const requestId = WorkerManager.generateRequestId();
    previewRequestId = requestId;
    const order = [
      ...model.sortDependencies(),
      ...model.sortReadoutDependencies(),
    ];
    const req = backends.wasmRadau5.buildRequest(model, {
      derivedSelection: order,
    });
    backends.wasmRadau5.getPool().postMessage({
      ...req,
      pars: parValues,
      // Matches parValues' own indexing: this is only ever called with
      // progress.params (below), itself indexed against
      // getAllAddressableNames() — the array actually submitted to the fit
      // session (runFit()'s pars/parNames, same reasoning).
      parNames: model.getAllAddressableNames(),
      initialValues: model.resolveInitialValues(),
      rhsNames: model.getNames(),
      allDerivedNames: order,
      selectDerivedNames: order,
      tEnd,
      requestId,
      calculateDerived: true,
      nTimePoints: 200,
    });
  }

  $effect(() => {
    const unsub = backends.wasmRadau5
      .getPool()
      .onMessage((data: SimulationResult) => {
        if (data.requestId !== previewRequestId) return;
        if (data.err) {
          trajectoryErr = data.err;
        } else {
          trajectoryErr = undefined;
          trajectory = { time: data.time, values: data.values };
        }
      });
    return unsub;
  });

  export function runFit() {
    const result = buildFitConfig({
      model,
      fitParameters,
      csv,
      timeColumn,
      targets,
      candidateKeys,
      backendChoice,
      hasTrainedNNBlock,
    });
    if (!result.ok) {
      errorMsg = result.error;
      return;
    }
    const config = result.config;

    errorMsg = null;
    running = true;
    fitComplete = false;
    fitStalled = false;
    nfev = 0;
    residualNorm = null;
    fittedValues = null;
    residualHistory = [];
    stageIndex = 0;
    stageCount = stages.length;

    // A per-row "initial guess" override (edited in the param table) starts
    // the fit from a value other than the model's current live parameter —
    // falls back to that live value where no override was set. NN weights
    // have no such override — they start from their current (Glorot-
    // initialized or previously-fitted) value, like any un-overridden row.
    const pars = model
      .resolveAllAddressableValues()
      .map(
        (v, i) =>
          fitParameters.find((p) => p.id === config.parNames[i])
            ?.initialGuess ?? v,
      );

    // Cumulative step offset across the whole curriculum — see
    // residualHistory's own doc comment. Plain closure state, not
    // reactive: only residualHistory itself needs to drive the chart.
    let cumulativeOffset = 0;
    let lastStageNfev = 0;

    session = runCurriculumFit(
      config,
      pars,
      stages,
      // A getter, not a plain object: re-read live on every init/chunk
      // decision inside runCurriculumFit, so editing "Stop once residual
      // norm reaches"/"Maximum total function evaluations" etc. mid-run
      // takes effect on the next chunk, same as before curriculum learning
      // existed — a snapshot taken once here would freeze them for the
      // whole run instead.
      () => ({
        targetResidualNorm,
        maxFunctionEvaluations,
        chunkMaxfev,
        progressUpdateInterval,
        patienceChunks: FIT_PATIENCE_CHUNKS,
        minDelta: FIT_MIN_DELTA,
        maxConsecutiveSolverErrors: MAX_CONSECUTIVE_SOLVER_ERRORS,
        perturbationScale: PERTURBATION_SCALE,
      }),
      {
        onInitError: (message) => {
          errorMsg = message;
          running = false;
          session = null;
        },
        onStageInit: ({
          initialResidualNorm,
          stageIndex: i,
          stageCount: n,
          stageCutoffT,
        }) => {
          // Every FIT_INIT resets progress.nfev to start counting from 0
          // again for that attempt — a same-stage retry after a solver
          // error (curriculumRunner.ts's perturb-and-retry) included, not
          // just a genuine transition to the next stage — so the offset
          // folds in unconditionally, or a retry's fresh progress.nfev
          // would read as jumping backward on the chart.
          cumulativeOffset += lastStageNfev;
          lastStageNfev = 0;
          stageIndex = i;
          stageCount = n;
          nfev = 0;
          // Anchor the convergence plot at this stage's own start with its
          // pre-chunk residual, rather than starting from wherever the
          // first chunk happens to land.
          if (initialResidualNorm !== undefined) {
            residualHistory = [
              ...residualHistory,
              {
                nfev: cumulativeOffset,
                residualNorm: residualPerPoint(
                  initialResidualNorm,
                  stageCutoffT,
                  config,
                ),
              },
            ];
          }
        },
        onProgress: ({
          progress,
          stageIndex: i,
          stageCount: n,
          stageCutoffT,
        }) => {
          nfev = progress.nfev;
          residualNorm = progress.residualNorm;
          stageIndex = i;
          stageCount = n;
          lastStageNfev = progress.nfev;
          fittedValues = Object.fromEntries(
            config.parNames.map((id, i) => [id, progress.params[i]]),
          );
          const cumulativeNfev = cumulativeOffset + progress.nfev;
          residualHistory = [
            ...residualHistory,
            {
              nfev: cumulativeNfev,
              residualNorm: residualPerPoint(
                progress.residualNorm,
                stageCutoffT,
                config,
              ),
            },
          ];
          previewTrajectory(progress.params, stageCutoffT);
        },
        onRunError: (message) => {
          errorMsg = message;
          running = false;
          session = null;
        },
        onDone: ({ stalled }) => {
          running = false;
          fitComplete = true;
          fitStalled = stalled;
          session = null;
        },
      },
    );
  }

  export function cancelFit() {
    session?.cancel();
    session = null;
    running = false;
  }

  // Writes the current best-fit values into model.parameters/model.nnWeights
  // — the same SvelteMap.set() pattern AnalysesDashboard's parameter
  // sliders already use to mutate the shared, reactive model — then lets
  // the dashboard re-run every other analysis box (ADR 0004 §2.12).
  function applyFittedParameters() {
    if (!fittedValues) return;
    for (const row of paramRows) {
      if (!row.fit) continue;
      const value = fittedValues[row.id];
      if (value === undefined) continue;
      const current = model.parameters.get(row.id);
      if (!current) continue;
      model.parameters = model.parameters.set(row.id, { ...current, value });
    }
    // Trained NN blocks' scale/weights have no paramRows entry (§2.1.3) —
    // written back separately, for every trained block, unconditionally.
    // scale is still an ordinary Parameter; weights/biases go to nnWeights
    // instead (mxl-schemas nn_blocks v2 — they never live in `parameters`).
    for (const [key, config] of model.nnBlocks) {
      if (!config.trained) continue;
      const scaleName = `${key}_scale`;
      const scaleValue = fittedValues[scaleName];
      if (scaleValue !== undefined) {
        const current = model.parameters.get(scaleName);
        if (current) {
          model.parameters = model.parameters.set(scaleName, {
            ...current,
            value: scaleValue,
          });
        }
      }
      for (const name of model.nnBlockWeightNames(key)) {
        const value = fittedValues[name];
        if (value === undefined) continue;
        model.nnWeights = model.nnWeights.set(name, value);
      }
    }
    onApply?.();
  }

  // ---- Ensemble fit run (ADR 0006) ---------------------------------------

  type EnsembleMember = {
    nfev: number;
    residualNorm: number | null;
    fittedValues: Record<string, number> | null;
    residualHistory: { nfev: number; residualNorm: number }[];
    trajectory: { time: number[]; values: number[][] };
    previewRequestId: string | null;
    done: boolean;
    errored: boolean;
  };

  function emptyMember(): EnsembleMember {
    return {
      nfev: 0,
      residualNorm: null,
      fittedValues: null,
      residualHistory: [],
      trajectory: { time: [], values: [] },
      previewRequestId: null,
      done: false,
      errored: false,
    };
  }

  let members = $state<EnsembleMember[]>([]);
  // Run handles live outside $state, deliberately — matching single-fit
  // mode's own plain `session` variable.
  let memberSessions: (CurriculumRunHandle | null)[] = [];
  let ensembleRunning = $state(false);
  let ensembleErrorMsg = $state<string | null>(null);
  let ensemblePreviewPool: WorkerPool | null = null;
  let unsubEnsemblePreview: (() => void) | null = null;

  // Distinct from members.filter((m) => !m.errored).length (non-errored
  // count, used for the "k member(s) failed" note): this is how many
  // members have actually stopped — converged, hit their target, cancelled,
  // or errored — vs. still running, for the "N/M members completed"
  // readout.
  let ensembleDoneCount = $derived(members.filter((m) => m.done).length);

  // Residual-norm outlier filter: a member stuck in a worse local minimum
  // than the rest of the ensemble shouldn't drag down the mean/spread shown
  // to the user. Robust to scale (residual norms span orders of magnitude)
  // and to the outlier itself skewing the threshold, unlike a mean/stddev
  // cutoff — median absolute deviation (MAD) of log10(residualNorm), one-
  // sided (only *worse*, i.e. higher, residuals are ever flagged). Only
  // `done` members are ever judged — a still-running member's residualNorm
  // is provisional and hasn't converged yet.
  const OUTLIER_MIN_DONE = 4;
  const OUTLIER_MAD_K = 3;
  const OUTLIER_MAD_EPSILON = 1e-9;

  function medianOf(sorted: number[]): number {
    const values = [...sorted].sort((a, b) => a - b);
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0
      ? (values[mid - 1] + values[mid]) / 2
      : values[mid];
  }

  let outlierMemberIndices = $derived.by(() => {
    if (!filterOutliers) return new Set<number>();
    const eligible = members
      .map((m, i) => ({ m, i, logVal: Math.log10(m.residualNorm ?? NaN) }))
      .filter(({ m }) => !m.errored && m.done && m.residualNorm !== null);
    if (eligible.length < OUTLIER_MIN_DONE) return new Set<number>();
    const median = medianOf(eligible.map((e) => e.logVal));
    const mad = medianOf(eligible.map((e) => Math.abs(e.logVal - median)));
    const madFloor = Math.max(mad, OUTLIER_MAD_EPSILON);
    return new Set(
      eligible
        .filter(({ logVal }) => (logVal - median) / madFloor > OUTLIER_MAD_K)
        .map(({ i }) => i),
    );
  });

  // Non-errored members minus outlier-flagged ones — feeds the ensemble
  // stats/band chart/apply-fitted-parameters, but NOT the residual
  // convergence chart (which stays a complete diagnostic view of every
  // non-errored member, outliers included, just dashed — see
  // ensembleResidualData) or the completion bookkeeping above.
  let nonOutlierMembers = $derived(
    members.filter((m, i) => !m.errored && !outlierMemberIndices.has(i)),
  );

  let ensembleAnyProgress = $derived(
    nonOutlierMembers.some((m) => m.fittedValues !== null),
  );
  // Members run independent, non-synchronized chunk loops (ADR 0006 §2.4) —
  // there's no single shared nfev the way single-fit mode has one. Summing
  // across members would read like "0..N*maxFunctionEvaluations", which
  // doesn't match the convergence chart's own per-member x-axis
  // (0..maxFunctionEvaluations) and isn't a meaningful number on its own.
  //
  // The minimum *still-running* member's nfev is: every member still doing
  // work has reported progress to at least this point — the ensemble's own
  // "synced" communication point. A member that already stopped (converged,
  // hit its target, errored) is excluded from that min once it's done —
  // otherwise, the very first member to finish early would freeze this
  // number for the rest of the run while every other member keeps working
  // well past it, which reads as the run having stalled. Once every member
  // is done there's nothing left running to take a min over, so it falls
  // back to the min across all of them — a legitimate summary at that
  // point ("every member reached at least this many evals"), not a
  // mid-run freeze.
  let ensembleNfev = $derived.by(() => {
    const running = members.filter((m) => !m.done);
    const pool = running.length > 0 ? running : members;
    return pool.length > 0 ? Math.min(...pool.map((m) => m.nfev)) : 0;
  });
  let ensembleProgressFraction = $derived(
    Math.min(ensembleNfev / Math.max(maxFunctionEvaluations, 1), 1),
  );
  let ensembleAllDone = $derived(
    members.length > 0 && members.every((m) => m.done),
  );

  function ensembleParamStats(
    id: string,
  ): { mean: number; std: number } | null {
    const values = nonOutlierMembers
      .map((m) => m.fittedValues?.[id])
      .filter((v): v is number => v !== undefined);
    if (values.length === 0) return null;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
    return { mean, std: Math.sqrt(variance) };
  }

  function teardownEnsembleWorkers() {
    memberSessions.forEach((s) => s?.cancel());
    memberSessions = [];
    ensemblePreviewPool?.terminate();
    ensemblePreviewPool = null;
    unsubEnsemblePreview?.();
    unsubEnsemblePreview = null;
  }

  function checkEnsembleDone() {
    if (members.every((m) => m.done)) {
      ensembleRunning = false;
      teardownEnsembleWorkers();
    }
  }

  function previewEnsembleTrajectory(
    m: number,
    parValues: number[],
    tEnd: number,
  ) {
    if (!ensemblePreviewPool) return;
    const requestId = WorkerManager.generateRequestId();
    members = members.map((mem, i) =>
      i === m ? { ...mem, previewRequestId: requestId } : mem,
    );
    const order = [
      ...model.sortDependencies(),
      ...model.sortReadoutDependencies(),
    ];
    const req = backends.wasmRadau5.buildRequest(model, {
      derivedSelection: order,
    });
    ensemblePreviewPool.postMessage({
      ...req,
      pars: parValues,
      parNames: model.getAllAddressableNames(),
      initialValues: model.resolveInitialValues(),
      rhsNames: model.getNames(),
      allDerivedNames: order,
      selectDerivedNames: order,
      tEnd,
      requestId,
      calculateDerived: true,
      nTimePoints: 200,
    });
  }

  function startEnsembleMember(m: number, config: FitConfig, pars: number[]) {
    const setMember = (patch: Partial<EnsembleMember>) => {
      members = members.map((mem, i) => (i === m ? { ...mem, ...patch } : mem));
    };

    // Cumulative step offset across this member's own curriculum — mirrors
    // runFit()'s identically-named closure vars — so residualHistory keeps
    // rising across stage transitions instead of resetting to 0 (member.nfev
    // itself, used by the progress bar, deliberately stays per-stage/raw).
    let cumulativeOffset = 0;
    let lastStageNfev = 0;

    memberSessions[m] = runCurriculumFit(
      config,
      pars,
      stages,
      // A getter, not a plain object: re-read live on every init/chunk
      // decision inside runCurriculumFit, so editing "Stop once residual
      // norm reaches"/"Maximum total function evaluations" etc. mid-run
      // takes effect on the next chunk, same as before curriculum learning
      // existed — a snapshot taken once here would freeze them for the
      // whole run instead.
      () => ({
        targetResidualNorm,
        maxFunctionEvaluations,
        chunkMaxfev,
        progressUpdateInterval,
        patienceChunks: FIT_PATIENCE_CHUNKS,
        minDelta: FIT_MIN_DELTA,
        maxConsecutiveSolverErrors: MAX_CONSECUTIVE_SOLVER_ERRORS,
        perturbationScale: PERTURBATION_SCALE,
      }),
      {
        onInitError: () => {
          setMember({ errored: true, done: true });
          memberSessions[m] = null;
          checkEnsembleDone();
        },
        onStageInit: ({ initialResidualNorm }) => {
          // Every FIT_INIT resets progress.nfev to start counting from 0
          // again for that attempt — a same-stage retry after a solver
          // error (curriculumRunner.ts's perturb-and-retry) included, not
          // just a genuine transition to the next stage — so the offset
          // folds in unconditionally, or a retry's fresh progress.nfev
          // would read as jumping backward on the chart.
          cumulativeOffset += lastStageNfev;
          lastStageNfev = 0;
          const member = members[m];
          setMember({
            nfev: 0,
            residualHistory:
              initialResidualNorm !== undefined
                ? [
                    ...member.residualHistory,
                    {
                      nfev: cumulativeOffset,
                      residualNorm: initialResidualNorm,
                    },
                  ]
                : member.residualHistory,
          });
        },
        onProgress: ({ progress, stageCutoffT }) => {
          const member = members[m];
          const fittedValues = Object.fromEntries(
            config.parNames.map((id, i) => [id, progress.params[i]]),
          );
          lastStageNfev = progress.nfev;
          const cumulativeNfev = cumulativeOffset + progress.nfev;
          const nextHistory = [
            ...member.residualHistory,
            { nfev: cumulativeNfev, residualNorm: progress.residualNorm },
          ];
          setMember({
            nfev: progress.nfev,
            residualNorm: progress.residualNorm,
            residualHistory: nextHistory,
            fittedValues,
          });
          previewEnsembleTrajectory(m, progress.params, stageCutoffT);
        },
        onRunError: () => {
          setMember({ errored: true, done: true });
          memberSessions[m] = null;
          checkEnsembleDone();
        },
        onDone: () => {
          setMember({ done: true });
          memberSessions[m] = null;
          checkEnsembleDone();
        },
      },
    );
  }

  export function runEnsembleFit() {
    const result = buildFitConfig({
      model,
      fitParameters,
      csv,
      timeColumn,
      targets,
      candidateKeys,
      backendChoice,
      hasTrainedNNBlock,
    });
    if (!result.ok) {
      ensembleErrorMsg = result.error;
      return;
    }
    const config = result.config;

    teardownEnsembleWorkers();
    ensembleErrorMsg = null;
    ensembleRunning = true;

    const N = clampEnsembleSize(ensembleSize);
    const rng = mulberry32(ensembleSeed);
    const currentValues = model.resolveAllAddressableValues();
    const fitIdxSet = new Set(config.combinedFitIdx);

    ensemblePreviewPool = createWasmPool(
      Math.min(N, navigator.hardwareConcurrency || 4),
    );
    unsubEnsemblePreview = ensemblePreviewPool.onMessage(
      (data: SimulationResult) => {
        const idx = members.findIndex(
          (m) => m.previewRequestId === data.requestId,
        );
        if (idx === -1) return;
        if (!data.err) {
          members = members.map((mem, i) =>
            i === idx
              ? { ...mem, trajectory: { time: data.time, values: data.values } }
              : mem,
          );
        }
      },
    );

    members = Array.from({ length: N }, emptyMember);
    memberSessions = Array.from({ length: N }, () => null);

    // Fresh, independently-seeded weight init per member for every trained
    // NN block (ADR 0006 §2.8) — reruns mxlweb-core's own `buildNNBlock`
    // (the exact generator `addNNBlock` itself calls) with a seed drawn from
    // the ensemble's own rng, rather than perturbing around the current
    // (possibly already-fitted) weights. A block's own `scale` parameter is
    // deliberately left untouched below: perturbing it broke the "starts
    // small" invariant ADR 0005 relies on, since scale's default (0.01) is
    // ~2 orders of magnitude smaller than a Glorot-initialized weight.
    const memberWeights: Map<string, number>[] = Array.from(
      { length: N },
      () => {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const weights = new Map<string, number>();
        for (const [key, blockConfig] of config.nnBlockConfigs) {
          const seed = Math.floor(rng() * 2 ** 31);
          const result = buildNNBlock({
            name: key,
            inputs: blockConfig.inputs,
            layers: blockConfig.layers,
            seed,
            scale: blockConfig.scale,
          });
          for (const [name, value] of result.weights) weights.set(name, value);
        }
        return weights;
      },
    );

    const memberPars: number[][] = Array.from({ length: N }, (_, m) =>
      currentValues.map((v, i) => {
        if (!fitIdxSet.has(i)) return v;
        const name = config.parNames[i];
        const freshWeight = memberWeights[m].get(name);
        if (freshWeight !== undefined) return freshWeight;
        // A trained block's own `scale` name — left at its current value,
        // not drawn (ADR 0006 §2.8).
        if (config.nnBlockOwner.has(name)) return v;
        const row = fitParameters.find((p) => p.id === name);
        const distribution = row?.distribution ?? defaultNormal(v);
        return sampleDistribution(distribution, rng);
      }),
    );

    for (let m = 0; m < N; m++) {
      startEnsembleMember(m, config, memberPars[m]);
    }
  }

  export function cancelEnsembleFit() {
    teardownEnsembleWorkers();
    ensembleRunning = false;
    members = members.map((m) => (m.done ? m : { ...m, done: true }));
  }

  $effect(() => {
    return () => teardownEnsembleWorkers();
  });

  // Ensemble counterpart to applyFittedParameters (ADR 0004 §2.12, ADR 0006
  // §2.10): writes the empirical mean across surviving members, gated on
  // "any member has reported first progress" rather than full completion.
  function applyEnsembleFittedParameters() {
    if (!ensembleAnyProgress) return;
    for (const row of paramRows) {
      if (!row.fit) continue;
      const stats = ensembleParamStats(row.id);
      if (!stats) continue;
      const current = model.parameters.get(row.id);
      if (!current) continue;
      model.parameters = model.parameters.set(row.id, {
        ...current,
        value: stats.mean,
      });
    }
    for (const [key, config] of model.nnBlocks) {
      if (!config.trained) continue;
      const scaleName = `${key}_scale`;
      const scaleStats = ensembleParamStats(scaleName);
      if (scaleStats) {
        const current = model.parameters.get(scaleName);
        if (current) {
          model.parameters = model.parameters.set(scaleName, {
            ...current,
            value: scaleStats.mean,
          });
        }
      }
      for (const name of model.nnBlockWeightNames(key)) {
        const stats = ensembleParamStats(name);
        if (stats) model.nnWeights = model.nnWeights.set(name, stats.mean);
      }
    }
    onApply?.();
  }

  // ---- Chart -------------------------------------------------------------

  let lineData = $derived.by(() => {
    const displayNames = model.getDisplayNames();
    const nVars = model.getNames().length;
    const order = [
      ...model.sortDependencies(),
      ...model.sortReadoutDependencies(),
    ];

    const modelDatasets = targets.map((t) => {
      const idx =
        t.kind === "state"
          ? model.getNames().indexOf(t.key)
          : nVars + order.indexOf(t.key);
      return {
        label: `${displayNames.get(t.key) ?? t.key} (model)`,
        data: arrayColumn(trajectory.values, idx) as number[],
      };
    });

    const dataDatasets =
      csv && timeColumn
        ? targets.map((t) => ({
            label: `${displayNames.get(t.key) ?? t.key} (data)`,
            data: csv!.columns[timeColumn!].map((x, i) => ({
              x,
              y: csv!.columns[t.column][i],
            })),
            showLine: false,
            pointRadius: 4,
          }))
        : [];

    return {
      labels: trajectory.time as number[],
      datasets: [...modelDatasets, ...dataDatasets],
    };
  });

  let residualHistoryData = $derived({
    labels: residualHistory.map((h) => h.nfev),
    datasets: [
      {
        label: "Residual norm",
        data: residualHistory.map((h) => h.residualNorm),
      },
    ],
  });

  // Per target: an invisible lower-bound line, an invisible upper-bound line
  // filled back to the lower one (the shaded ±1 std band), then the visible
  // mean line — the two boundary datasets use label:"" so LineChart's
  // existing `legend.labels.filter(item => item.text !== "")` keeps them out
  // of the legend (ADR 0006 §2.6).
  let ensembleLineData = $derived.by(() => {
    const displayNames = model.getDisplayNames();
    const nVars = model.getNames().length;
    const order = [
      ...model.sortDependencies(),
      ...model.sortReadoutDependencies(),
    ];
    const trajectories = nonOutlierMembers
      .map((m) => m.trajectory)
      .filter((t) => t.time.length > 0);
    const timeLabels = trajectories[0]?.time ?? [];
    const nT = timeLabels.length;

    const bandDatasets = targets.flatMap((t, ti) => {
      const idx =
        t.kind === "state"
          ? model.getNames().indexOf(t.key)
          : nVars + order.indexOf(t.key);
      const color = paletteColor(ti);
      const meanArr: number[] = [];
      const lowerArr: number[] = [];
      const upperArr: number[] = [];
      for (let step = 0; step < nT; step++) {
        const vals = trajectories
          .map((traj) => traj.values[step]?.[idx])
          .filter((v): v is number => v !== undefined && Number.isFinite(v));
        if (vals.length === 0) {
          meanArr.push(NaN);
          lowerArr.push(NaN);
          upperArr.push(NaN);
          continue;
        }
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        const variance =
          vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
        const std = Math.sqrt(variance);
        meanArr.push(mean);
        lowerArr.push(mean - std);
        upperArr.push(mean + std);
      }
      return [
        {
          label: "",
          data: lowerArr,
          borderWidth: 0,
          pointRadius: 0,
          fill: false,
          borderColor: "transparent",
        },
        {
          label: "",
          data: upperArr,
          borderWidth: 0,
          pointRadius: 0,
          fill: "-1",
          backgroundColor: withAlpha(color, 0.15),
          borderColor: "transparent",
        },
        {
          label: `${displayNames.get(t.key) ?? t.key} (mean)`,
          data: meanArr,
          borderColor: color,
          backgroundColor: color,
          pointRadius: 0,
        },
      ];
    });

    const dataDatasets =
      csv && timeColumn
        ? targets.map((t, ti) => ({
            label: `${displayNames.get(t.key) ?? t.key} (data)`,
            data: csv!.columns[timeColumn!].map((x, i) => ({
              x,
              y: csv!.columns[t.column][i],
            })),
            showLine: false,
            pointRadius: 4,
            borderColor: paletteColor(ti),
            backgroundColor: paletteColor(ti),
          }))
        : [];

    return { labels: timeLabels, datasets: [...bandDatasets, ...dataDatasets] };
  });

  // One line per member, points as {x: nfev, y: residualNorm} rather than
  // shared `labels` — members' nfev sequences diverge since they run
  // independent chunk loops (ADR 0006 §2.4, §2.6).
  let ensembleResidualData = $derived({
    labels: [],
    datasets: members.map((m, i) => ({
      label: `member ${i + 1}${m.errored ? " (errored)" : ""}`,
      data: m.residualHistory.map((h) => ({ x: h.nfev, y: h.residualNorm })),
      borderColor: paletteColor(i),
      backgroundColor: paletteColor(i),
      pointRadius: 0,
      borderDash: outlierMemberIndices.has(i) ? [6, 4] : [],
    })),
  });

  // A fixed y-axis ceiling, derived once from the uploaded data rather than
  // the live-updating model trajectory: with no explicit `yMax` set, letting
  // Chart.js auto-scale to the current trajectory's own max makes the axis
  // (and so every point on the line) visibly rescale on each progress tick —
  // the "jumping" a live-updating fit chart must not do.
  let dataYMax = $derived.by(() => {
    if (!csv || !timeColumn || targets.length === 0) return undefined;
    const values = targets.flatMap((t) => csv!.columns[t.column] ?? []);
    if (values.length === 0) return undefined;
    return Math.max(...values) * 1.2;
  });
</script>

<div class="fit-panel">
  <Row
    stack
    justify="between"
    gap="0.5rem"
  >
    <H2>Fit to data</H2>
    <div class="actions">
      <Button
        disabled={mode === "single" ? !fittedValues : !ensembleAnyProgress}
        onclick={mode === "single"
          ? applyFittedParameters
          : applyEnsembleFittedParameters}>Apply fitted parameters</Button
      >
      <Button
        popovertarget={popovertarget}
        popovertargetaction="hide">Close</Button
      >
    </div>
  </Row>

  <div class="mode-row">
    <label>
      Mode:
      <select bind:value={mode}>
        <option value="single">Single fit</option>
        <option value="ensemble">Ensemble fit</option>
      </select>
    </label>
  </div>

  <div class="config-row">
    <div class="config-col">
      <h3>Fit settings</h3>
      <table class="settings-table">
        <thead>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fit backend</td>
            <td>
              <select bind:value={backendChoice}>
                <option value="lm">Levenberg-Marquardt</option>
                <option value="lm-jacobian"
                  >Levenberg-Marquardt (analytic Jacobian)</option
                >
                <option value="adjoint">Adjoint</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Function evaluations per progress update</td>
            <td>
              <input
                type="number"
                step="any"
                bind:value={progressUpdateInterval}
              />
            </td>
          </tr>
          <tr>
            <td>Maximum total function evaluations</td>
            <td>
              <input
                type="number"
                step="any"
                bind:value={maxFunctionEvaluations}
              />
            </td>
          </tr>
          <tr>
            <td>Stop once residual norm reaches</td>
            <td>
              <input
                type="number"
                step="any"
                bind:value={targetResidualNorm}
              />
            </td>
          </tr>
          {#if mode === "ensemble"}
            <tr>
              <td>Ensemble size</td>
              <td>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max={MAX_ENSEMBLE_SIZE}
                  value={ensembleSize}
                  onchange={(e) =>
                    (ensembleSize = clampEnsembleSize(
                      Number((e.target as HTMLInputElement).value),
                    ))}
                />
              </td>
            </tr>
            <tr>
              <td>Random seed</td>
              <td>
                <input
                  type="number"
                  step="1"
                  value={ensembleSeed}
                  onchange={(e) =>
                    (ensembleSeed = Number(
                      (e.target as HTMLInputElement).value,
                    ))}
                />
                <button
                  type="button"
                  class="time-link"
                  onclick={() =>
                    (ensembleSeed = Math.floor(Math.random() * 2 ** 31))}
                  >re-roll</button
                >
              </td>
            </tr>
            <tr>
              <td>Filter residual outliers</td>
              <td>
                <input
                  type="checkbox"
                  checked={filterOutliers}
                  onchange={(e) =>
                    (filterOutliers = (e.target as HTMLInputElement).checked)}
                />
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
      <CurriculumStagesEditor
        bind:stages={stages}
        tEnd={curriculumTEnd}
        budgetScale={maxFunctionEvaluations}
        minBudgetWarn={chunkMaxfev}
      />
    </div>
    <div class="config-col">
      <h3>Data</h3>
      <input
        type="file"
        accept=".csv,.tsv,.txt"
        bind:this={fileInput}
        onchange={handleFile}
        style="display:none"
      />
      {#if fileError}
        <p class="error">{fileError}</p>
      {/if}

      {#if csv}
        <table class="mapping-table">
          <thead>
            <tr>
              <th>Column</th>
              <th>Maps to</th>
            </tr>
          </thead>
          <tbody>
            {#each csv.headers as header (header)}
              {@const mapping = targets.find((t) => t.column === header)}
              <tr>
                <td>{header}</td>
                <td>
                  {#if header === timeColumn}
                    <span class="time-badge">time axis</span>
                  {:else}
                    <select
                      value={mapping?.key ?? ""}
                      onchange={(e) => {
                        const value = (e.target as HTMLSelectElement).value;
                        if (value === "") unmapColumn(header);
                        else setTargetColumn(header, value);
                      }}
                    >
                      <option value="">(ignore)</option>
                      {#each candidateKeys as c (c.key)}
                        <option value={c.key}>{c.key} ({c.kind})</option>
                      {/each}
                    </select>
                    <button
                      type="button"
                      class="time-link"
                      onclick={() => (timeColumn = header)}>use as time</button
                    >
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <span class="file-info"
          >{csv.rowCount} rows, {csv.headers.length} columns</span
        >
      {:else}
        <Button
          variant="secondary"
          onclick={() => fileInput?.click()}>Upload data</Button
        >
      {/if}
    </div>
  </div>

  <h3>Plot options</h3>
  <InputNumberOptional
    id="fit-yMax"
    valueLabel="yMax: "
    condLabel="Auto?"
    bind:value={yMaxValue}
    bind:condition={yMaxAuto}
  />

  <table class="param-table">
    <thead>
      <tr>
        <th>Parameter</th>
        <th>Fit</th>
        <th>Log-space</th>
        {#if mode === "single"}
          <th>Initial guess</th>
          <th>Fitted value</th>
        {:else}
          <th>Distribution</th>
          <th>Fitted (mean ± std)</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each paramRows as row (row.id)}
        <tr>
          <td>{model.getDisplayNames().get(row.id) ?? row.id}</td>
          <td>
            <input
              type="checkbox"
              checked={row.fit}
              onchange={(e) =>
                updateParamRow(row.id, {
                  fit: (e.target as HTMLInputElement).checked,
                })}
            />
          </td>
          <td>
            <input
              type="checkbox"
              checked={row.logSpace}
              disabled={!row.fit}
              onchange={(e) =>
                updateParamRow(row.id, {
                  logSpace: (e.target as HTMLInputElement).checked,
                })}
            />
          </td>
          {#if mode === "single"}
            {@const initialGuess =
              row.initialGuess ?? model.parameters.get(row.id)?.value ?? 0}
            <td>
              <input
                type="number"
                step={magnitudeStep(initialGuess)}
                value={initialGuess}
                disabled={!row.fit}
                onchange={(e) =>
                  updateParamRow(row.id, {
                    initialGuess: Number((e.target as HTMLInputElement).value),
                  })}
              />
            </td>
            <td
              ><span class="fitted-value"
                >{row.fit && fittedValues
                  ? fittedValues[row.id]?.toExponential(2)
                  : "—"}</span
              ></td
            >
          {:else}
            {@const distribution =
              row.distribution ?? defaultDistributionFor(row.id)}
            <td>
              <div class="dist-editor">
                <select
                  value={distribution.family}
                  disabled={!row.fit}
                  onchange={(e) =>
                    setDistributionFamily(
                      row.id,
                      (e.target as HTMLSelectElement)
                        .value as FitDistributionFamily,
                    )}
                >
                  <option value="logNormal">Log-normal</option>
                  <option value="normal">Normal</option>
                  <option value="uniform">Uniform</option>
                  <option value="logUniform">Log-uniform</option>
                </select>
                {#if distribution.family === "normal" || distribution.family === "logNormal"}
                  <span class="dist-field-label"
                    >{distribution.family === "logNormal"
                      ? "median"
                      : "mean"}</span
                  >
                  <input
                    type="number"
                    step={magnitudeStep(distribution.mean)}
                    aria-label={distribution.family === "logNormal"
                      ? "median"
                      : "mean"}
                    disabled={!row.fit}
                    value={distribution.mean}
                    onchange={(e) =>
                      updateDistributionField(
                        row.id,
                        "mean",
                        Number((e.target as HTMLInputElement).value),
                      )}
                  />
                  <span class="dist-field-label">std</span>
                  <input
                    type="number"
                    step="any"
                    aria-label="std %"
                    disabled={!row.fit}
                    value={toPercent(
                      distribution.std,
                      distribution.mean,
                    ).toPrecision(3)}
                    onchange={(e) =>
                      updateDistributionPercentField(
                        row.id,
                        "std",
                        Number((e.target as HTMLInputElement).value),
                        distribution.mean,
                      )}
                  />
                  <span>%</span>
                {:else}
                  {@const ref = distributionPercentReference(
                    row.id,
                    distribution,
                  )}
                  <span class="dist-field-label">min</span>
                  <input
                    type="number"
                    step="any"
                    aria-label="min %"
                    disabled={!row.fit}
                    value={toPercent(distribution.min, ref).toPrecision(3)}
                    onchange={(e) =>
                      updateDistributionPercentField(
                        row.id,
                        "min",
                        Number((e.target as HTMLInputElement).value),
                        ref,
                      )}
                  />
                  <span>%</span>
                  <span class="dist-field-label">max</span>
                  <input
                    type="number"
                    step="any"
                    aria-label="max %"
                    disabled={!row.fit}
                    value={toPercent(distribution.max, ref).toPrecision(3)}
                    onchange={(e) =>
                      updateDistributionPercentField(
                        row.id,
                        "max",
                        Number((e.target as HTMLInputElement).value),
                        ref,
                      )}
                  />
                  <span>%</span>
                {/if}
              </div>
            </td>
            <td>
              <span class="fitted-value fitted-value-wide">
                {#if row.fit}
                  {@const stats = ensembleParamStats(row.id)}
                  {stats
                    ? `${stats.mean.toExponential(2)} ± ${stats.std.toExponential(1)}`
                    : "—"}
                {:else}
                  —
                {/if}
              </span>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>

  {#if hasTrainedNNBlock}
    {#if mode === "ensemble"}
      <p class="nn-note">
        Also training {trainedBlockKeys.length} NN block(s) using the {backendLabel(
          backendChoice,
        )} backend. Each ensemble member trains from its own independently Glorot-initialized
        weights (same architecture, seeded from the ensemble's own random seed) —
        the block's own output scale stays fixed at its current value for every member.
      </p>
    {:else}
      <p class="nn-note">
        Also training {trainedBlockKeys.length} NN block(s) using the {backendLabel(
          backendChoice,
        )} backend.
      </p>
    {/if}
  {/if}

  {#if mode === "single"}
    <div class="run-row">
      {#if !running}
        <button
          type="button"
          class="run-button"
          onclick={runFit}>Run fit</button
        >
      {:else}
        <button
          type="button"
          class="cancel-button"
          onclick={cancelFit}>Stop</button
        >
      {/if}
      {#if stageCount > 1 && (running || fitComplete)}
        <span class="progress-info">stage {stageIndex + 1} of {stageCount}</span
        >
      {/if}
      {#if residualNorm !== null}
        <span class="progress-info"
          >evals: {nfev} · residual norm: {residualNorm.toExponential(3)}</span
        >
      {/if}
    </div>
    {#if targetMissed}
      <p class="target-missed">
        Stopped before reaching the target residual norm ({targetResidualNorm.toExponential(
          1,
        )}) — {nfev >= maxFunctionEvaluations
          ? "hit the maximum function evaluations."
          : fitStalled
            ? `stopped after ${FIT_PATIENCE_CHUNKS} chunks with no meaningful improvement — likely stuck in a local minimum.`
            : "the fit converged and couldn't improve further."}
      </p>
    {/if}
    {#if nfev > 0}
      <div
        class="progress-bar-track"
        title="{nfev} / {stageBudget} evaluations"
      >
        <div
          class="progress-bar-fill"
          style="transform: scaleX({fitComplete ? 1 : progressFraction})"
        ></div>
      </div>
    {/if}
    {#if errorMsg}
      <p class="error">{errorMsg}</p>
    {/if}

    <div class="charts-row">
      {#if trajectoryErr}
        <SimErrDisplay err={trajectoryErr} />
      {:else}
        <div class="chart-cell">
          <LineChart
            data={lineData}
            loading={false}
            yMax={yMax ?? dataYMax}
          />
        </div>
      {/if}

      <div class="chart-cell">
        <LineChart
          data={residualHistoryData}
          loading={false}
          yScale="logarithmic"
          yMin={undefined}
          xMax={maxFunctionEvaluations}
          xLabel="Function evaluations (cumulative across stages)"
          yLabel="Residual norm (per data point)"
          phases={phaseRegions}
        />
      </div>
    </div>
  {:else}
    <div class="run-row">
      {#if !ensembleRunning}
        <button
          type="button"
          class="run-button"
          onclick={runEnsembleFit}>Run ensemble fit</button
        >
      {:else}
        <button
          type="button"
          class="cancel-button"
          onclick={cancelEnsembleFit}>Stop</button
        >
      {/if}
      {#if members.length > 0}
        <span class="progress-info"
          >evals: {ensembleNfev} · {ensembleDoneCount}/{members.length}
          members completed</span
        >
      {/if}
    </div>
    {#if members.length > 0}
      <div
        class="progress-bar-track"
        title="{ensembleNfev} / {maxFunctionEvaluations} evaluations"
      >
        <div
          class="progress-bar-fill"
          style="transform: scaleX({ensembleAllDone
            ? 1
            : ensembleProgressFraction})"
        ></div>
      </div>
    {/if}
    {#if members.some((m) => m.errored)}
      <p class="target-missed">
        {members.filter((m) => m.errored).length} member(s) failed and were dropped
        from the ensemble statistics.
      </p>
    {/if}
    {#if ensembleErrorMsg}
      <p class="error">{ensembleErrorMsg}</p>
    {/if}

    <div class="charts-row">
      <div class="chart-cell">
        <LineChart
          data={ensembleLineData}
          loading={false}
          yMax={yMax ?? dataYMax}
        />
      </div>
      <div class="chart-cell">
        <LineChart
          data={ensembleResidualData}
          loading={false}
          yScale="logarithmic"
          yMin={undefined}
          xMax={maxFunctionEvaluations}
          xLabel="Function evaluations (cumulative across stages)"
          yLabel="Residual norm"
          phases={phaseRegions}
        />
      </div>
    </div>
  {/if}
</div>

<style>
  /* Global styles */

  input,
  select {
    border: var(--border);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: auto;
    font-size: 0.875rem;
  }
  input:hover,
  select:hover {
    border: var(--border-primary);
  }
  /* Local styles */
  .fit-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
  }
  .mode-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .mode-row label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  .config-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  .config-col {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 0;
  }
  /* Form controls don't inherit the page font or size by default — without
     this every input/select in these tables renders in the browser's UI
     font/size instead of matching the surrounding table text. */
  input,
  select {
    font-size: inherit;
    font-family: inherit;
  }
  .dist-editor {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
  }
  .dist-editor input {
    width: 6rem;
  }
  .dist-field-label {
    color: var(--color-text-muted);
    font-size: 0.75rem;
  }
  .charts-row {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  .chart-cell {
    width: 100%;
    min-width: 0;
  }
  .progress-bar-track {
    border-radius: var(--radius-full, 999px);
    background: #e5e7eb;
    width: 100%;
    height: 0.5rem;
    overflow: hidden;
  }
  .progress-bar-fill {
    transform-origin: left;
    transition: transform 200ms ease;
    background: var(--color-primary);
    width: 100%;
    height: 100%;
  }
  .error {
    margin: 0;
    color: var(--color-danger);
    font-size: 0.875rem;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
  }
  th,
  td {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  th {
    background-color: #e5e7eb;
    font-weight: var(--weight-bold);
    font-size: 0.7rem;
    text-transform: uppercase;
  }
  .param-table input[type="number"],
  .settings-table input[type="number"] {
    width: 8rem;
  }
  /* Fixed width + tabular figures so a changing "Fitted value"/"Fitted
     (mean ± std)" during a running fit doesn't reflow the column (and so
     the whole param table) on every progress tick — toPrecision()'s output
     length varies with the number's sign/magnitude/exponent notation, and
     table-layout:auto resizes columns to fit whatever's currently in them. */
  .fitted-value {
    display: inline-block;
    vertical-align: middle;
    width: 8rem;
    overflow: hidden;
    font-variant-numeric: tabular-nums;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fitted-value-wide {
    width: 13rem;
  }
  .run-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .run-button,
  .cancel-button {
    cursor: pointer;
    border: var(--border);
    border-radius: var(--radius-lg);
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
  }
  .run-button {
    background: var(--color-primary);
    color: white;
  }
  .cancel-button {
    background: var(--color-danger);
    color: white;
  }
  .progress-info {
    color: var(--color-text-muted);
    font-size: 0.8rem;
  }
  .target-missed {
    margin: 0;
    color: var(--color-accent);
    font-size: 0.875rem;
  }
  .nn-note {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .file-info {
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .time-badge {
    color: var(--color-primary);
    font-weight: 600;
  }
  .time-link {
    cursor: pointer;
    margin-left: 0.5rem;
    border: none;
    background: none;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    text-decoration: underline;
  }
</style>
