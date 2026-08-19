<!--
 @component
 Fit a model's parameters to uploaded data (ADR 0004).

 Runs entirely against the WASM backend (radau5): fitWorker.ts vendors
 cminpack's lmdif alongside the integrators so the fit's inner loop never
 leaves WASM. Fitting is chunked — see docs/adrs/0004-fit-model-to-data.md —
 so progress can be shown and the run cancelled mid-fit.
-->

<script lang="ts">
  import { LineChart } from "@computational-biology-aachen/design";
  import type {
    FitBackend,
    ModelBuilderBase,
  } from "@computational-biology-aachen/mxlweb-core";
  import { SvelteSet } from "svelte/reactivity";
  import type { ParsedCsv } from "./csvParse";
  import type { FitParameterConfig, FitTargetMapping } from "./index";
  import SimErrDisplay from "./SimErrDisplay.svelte";
  import { backends } from "./stores/backends";
  import { FitSession } from "./stores/fitStore";
  import {
    WorkerManager,
    type SimulationError,
    type SimulationResult,
  } from "./stores/workerStore";
  import { arrayColumn } from "./utils";

  let {
    model,
    timeColumn = $bindable(undefined),
    targets = $bindable([]),
    fitParameters = $bindable([]),
    csv = $bindable(null),
    chunkMaxfev,
    targetResidualNorm,
    maxFunctionEvaluations,
    yMax,
    onApply,
  }: {
    model: ModelBuilderBase;
    timeColumn?: string;
    targets?: FitTargetMapping[];
    fitParameters?: FitParameterConfig[];
    /** Uploaded data file — parsed and mapped from FitEditor's "Upload
     * data" button. */
    csv?: ParsedCsv | null;
    chunkMaxfev: number;
    /** Stop once the residual norm drops to or below this. */
    targetResidualNorm: number;
    /** Hard cap on total function evaluations across every chunk. */
    maxFunctionEvaluations: number;
    yMax?: number;
    /** Called after "Apply fitted parameters" writes into model.parameters —
     * wired by AnalysesDashboard to re-run every other analysis box. */
    onApply?: () => void;
  } = $props();

  // ---- Column mapping ------------------------------------------------

  // Candidate fit targets: state variables + derived quantities — the same
  // source TimeCourse.svelte uses for its "select derived" UI.
  let candidateKeys = $derived([
    ...model.getNames().map((key) => ({ key, kind: "state" as const })),
    ...model
      .sortDependencies()
      .map((key) => ({ key, kind: "derived" as const })),
  ]);

  // ---- Parameter selection -------------------------------------------

  // NN block weights/biases live in model.parameters like any other
  // parameter, but are never individual table rows (ADR 0005 §2.1.3) — a
  // 6×64 block is ≈20,800 of them. Fitting them is the block's own
  // "trained" toggle (TableNNBlocks), not a per-row checkbox here.
  let nnBlockOwnedParams = $derived.by(() => {
    const owned = new SvelteSet<string>();
    for (const key of model.nnBlocks.keys()) {
      const wPrefix = `${key}_w`;
      const bPrefix = `${key}_b`;
      for (const name of model.parameters.keys()) {
        if (name.startsWith(wPrefix) || name.startsWith(bPrefix)) {
          owned.add(name);
        }
      }
    }
    return owned;
  });
  let hasTrainedNNBlock = $derived(
    [...model.nnBlocks.values()].some((b) => b.trained),
  );

  // Not all parameters fit by default (ADR 0004 §2.4) — a parameter not yet
  // in fitParameters defaults to unchecked.
  let paramRows = $derived(
    [...model.parameters.keys()]
      .filter((id) => !nnBlockOwnedParams.has(id))
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

  // ---- Fit run ---------------------------------------------------------

  let session: FitSession | null = null;
  let running = $state(false);
  let errorMsg = $state<string | null>(null);
  let nfev = $state(0);
  let residualNorm = $state<number | null>(null);
  // Current best-fit full parameter vector, id -> value — a run result, not
  // a saved config choice, so it lives here rather than in FitParameterConfig
  // (ADR 0004 §2.11). null until the first chunk's progress has landed.
  let fittedValues = $state<Record<string, number> | null>(null);
  // One entry per chunk response, reset at the start of each run (§2.11).
  let residualHistory = $state<{ nfev: number; residualNorm: number }[]>([]);
  let progressFraction = $derived(
    Math.min(nfev / Math.max(maxFunctionEvaluations, 1), 1),
  );
  // True once a run has stopped because it's genuinely finished (converged,
  // hit the residual target, or hit the max-evaluations cap) — as opposed to
  // still running or cancelled. Forces the progress bar to 100%: nfev/max
  // alone is misleading on completion, since a fit that converges well
  // under the cap would otherwise show a small, seemingly-unfinished bar.
  let fitComplete = $state(false);
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
    const order = model.sortDependencies();
    const req = backends.wasmRadau5.buildRequest(model, {
      derivedSelection: order,
    });
    backends.wasmRadau5.getPool().postMessage({
      ...req,
      pars: parValues,
      parNames: model.getParameterNames(),
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

  // Caps a chunk's own maxfev so a fit doesn't overshoot the total
  // maxFunctionEvaluations budget by a whole chunk's worth.
  function nextChunkBudget(currentNfev: number): number {
    return Math.min(chunkMaxfev, maxFunctionEvaluations - currentNfev);
  }

  function fitTargets(): { fitIdx: number[]; ok: boolean } {
    const parNames = model.getParameterNames();
    const fitIdx = fitParameters
      .filter((p) => p.fit)
      .map((p) => parNames.indexOf(p.id))
      .filter((i) => i >= 0);
    return { fitIdx, ok: fitIdx.length > 0 };
  }

  export function runFit() {
    if (!csv || !timeColumn || targets.length === 0) {
      errorMsg = "Upload a data file and map at least one column first.";
      return;
    }
    const { fitIdx, ok } = fitTargets();
    if (!ok && !hasTrainedNNBlock) {
      errorMsg =
        "Select at least one parameter to fit, or enable training on an NN block.";
      return;
    }

    // A mapping can go stale (e.g. the model was reloaded from a new SBML
    // file) without the mapping table being touched — reject rather than
    // let an unresolved key reach the WASM heap as a bogus buffer index.
    const knownKeys = new Set(candidateKeys.map((c) => c.key));
    const staleTarget = targets.find((t) => !knownKeys.has(t.key));
    if (staleTarget) {
      errorMsg = `"${staleTarget.key}" is no longer a valid target — re-map column "${staleTarget.column}".`;
      return;
    }

    const columns = csv.columns;
    const dataT = columns[timeColumn];
    const order = dataT.map((t, i) => i).sort((a, b) => dataT[a] - dataT[b]);
    const sortedT = order.map((i) => dataT[i]);
    if (sortedT.some((t) => Number.isNaN(t))) {
      errorMsg = `Column "${timeColumn}" has a non-numeric value.`;
      return;
    }
    for (const t of targets) {
      if (order.some((i) => Number.isNaN(columns[t.column][i]))) {
        errorMsg = `Column "${t.column}" has a non-numeric value.`;
        return;
      }
    }

    errorMsg = null;
    running = true;
    fitComplete = false;
    nfev = 0;
    residualNorm = null;
    fittedValues = null;
    residualHistory = [];

    const derivedTargets = targets.filter((t) => t.kind === "derived");
    const derivedKeys = derivedTargets.map((t) => t.key);

    // v1's "adjoint" backend only supports state-variable targets (see
    // FitInitRequest.adjointWat's doc comment) — reject up front rather than
    // let fit_init fail deep in the WASM boundary.
    if (hasTrainedNNBlock && derivedTargets.length > 0) {
      errorMsg =
        "Training an NN block requires every fit target to be a state variable, not a derived quantity.";
      running = false;
      return;
    }

    let derivedWat: string | undefined;
    try {
      derivedWat =
        derivedKeys.length > 0 ? model.buildWatDerived(derivedKeys) : undefined;
    } catch (e) {
      errorMsg =
        e instanceof Error ? e.message : "Failed to build the fit model.";
      running = false;
      return;
    }

    const fitTargetsList = targets.map((t) => {
      const values = order.map((i) => columns[t.column][i]);
      const scale = Math.max(...values.map(Math.abs), 1e-12);
      return {
        kind: t.kind,
        index:
          t.kind === "state"
            ? model.getNames().indexOf(t.key)
            : derivedKeys.indexOf(t.key),
        scale,
        values,
      };
    });

    const parNames = model.getParameterNames();

    // Every weight/bias of every *trained* NN block joins the fitted set —
    // always in linear space, never log-space (ADR 0005 §2.1.2: weights must
    // range over all reals). Untrained blocks keep their current weights
    // fixed and are simply left out of fitIdx.
    const nnBlockParamNames: string[] = [];
    for (const [key, config] of model.nnBlocks) {
      if (!config.trained) continue;
      const wPrefix = `${key}_w`;
      const bPrefix = `${key}_b`;
      for (const name of parNames) {
        if (name.startsWith(wPrefix) || name.startsWith(bPrefix)) {
          nnBlockParamNames.push(name);
        }
      }
    }
    const nnBlockFitIdx = nnBlockParamNames.map((name) => parNames.indexOf(name));
    const combinedFitIdx = [...fitIdx, ...nnBlockFitIdx];

    const logFlags = [
      ...fitIdx.map(
        (i) =>
          fitParameters.find((p) => p.id === parNames[i])?.logSpace ?? true,
      ),
      ...nnBlockFitIdx.map(() => false),
    ];
    // A per-row "initial guess" override (edited in the param table) starts
    // the fit from a value other than the model's current live parameter —
    // falls back to that live value where no override was set. NN weights
    // have no such override — they start from their current (Glorot-
    // initialized or previously-fitted) value, like any un-overridden row.
    const pars = model
      .resolveParameters()
      .map(
        (v, i) =>
          fitParameters.find((p) => p.id === parNames[i])?.initialGuess ?? v,
      );

    // Any trained NN block forces the adjoint backend unconditionally — a
    // 6×64 block's ≈20,800 finite-difference forward solves under "lm" are
    // intractable regardless of measured per-solve cost (ADR 0005 §2.4).
    // A purely mechanistic fit leaves `backend` undefined, defaulting to "lm".
    const backend: FitBackend | undefined =
      nnBlockFitIdx.length > 0 ? "adjoint" : undefined;
    let adjointWat: string | undefined;
    if (backend === "adjoint") {
      try {
        adjointWat = model.buildAdjointWat(
          combinedFitIdx.map((i) => parNames[i]),
        );
      } catch (e) {
        errorMsg =
          e instanceof Error ? e.message : "Failed to build the adjoint model.";
        running = false;
        return;
      }
    }

    session = new FitSession();
    session.onInitResult((result) => {
      if (!result.ok) {
        errorMsg = result.error ?? "Failed to start the fit.";
        running = false;
        session?.cancel();
        session = null;
        return;
      }
      // Anchor the convergence plot at nfev=0 with the pre-fit residual,
      // rather than starting from wherever the first chunk happens to land.
      if (result.initialResidualNorm !== undefined) {
        residualHistory = [
          { nfev: 0, residualNorm: result.initialResidualNorm },
        ];
      }
      session?.chunk(nextChunkBudget(0));
    });
    session.onProgress((progress) => {
      nfev = progress.nfev;
      residualNorm = progress.residualNorm;
      if (progress.err) {
        errorMsg = progress.err.message;
        running = false;
        session?.free();
        session = null;
        return;
      }
      residualHistory = [
        ...residualHistory,
        { nfev: progress.nfev, residualNorm: progress.residualNorm },
      ];
      fittedValues = Object.fromEntries(
        parNames.map((id, i) => [id, progress.params[i]]),
      );
      previewTrajectory(progress.params, sortedT[sortedT.length - 1]);

      const reachedTarget = progress.residualNorm <= targetResidualNorm;
      const reachedMaxEvals = progress.nfev >= maxFunctionEvaluations;
      const budget = nextChunkBudget(progress.nfev);
      if (!progress.done && !reachedTarget && !reachedMaxEvals && budget > 0) {
        session?.chunk(budget);
      } else {
        running = false;
        fitComplete = true;
        session?.free();
        session = null;
      }
    });

    session.init({
      rhsWat: model.buildWat(),
      derivedWat,
      nDerived: derivedKeys.length,
      y0: model.resolveInitialValues(),
      pars,
      fitIdx: combinedFitIdx,
      logFlags,
      targets: fitTargetsList.map(({ kind, index, scale }) => ({
        kind,
        index,
        scale,
      })),
      dataT: sortedT,
      dataY: fitTargetsList.flatMap((t) => t.values),
      tEnd: sortedT[sortedT.length - 1],
      solver: "radau5",
      rtol: 1e-8,
      atol: 1e-10,
      targetResidualNorm,
      backend,
      adjointWat,
    });
  }

  export function cancelFit() {
    session?.cancel();
    session = null;
    running = false;
  }

  // Writes the current best-fit values into model.parameters — the same
  // SvelteMap.set() pattern AnalysesDashboard's parameter sliders already
  // use to mutate the shared, reactive model — then lets the dashboard
  // re-run every other analysis box (ADR 0004 §2.12).
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
    // Trained NN blocks' weights/biases have no paramRows entry (§2.1.3) —
    // written back separately, for every trained block, unconditionally.
    for (const [key, config] of model.nnBlocks) {
      if (!config.trained) continue;
      const wPrefix = `${key}_w`;
      const bPrefix = `${key}_b`;
      for (const [name, value] of Object.entries(fittedValues)) {
        if (!name.startsWith(wPrefix) && !name.startsWith(bPrefix)) continue;
        const current = model.parameters.get(name);
        if (!current) continue;
        model.parameters = model.parameters.set(name, { ...current, value });
      }
    }
    onApply?.();
  }

  // ---- Chart -------------------------------------------------------------

  let lineData = $derived.by(() => {
    const displayNames = model.getDisplayNames();
    const nVars = model.getNames().length;
    const order = model.sortDependencies();

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
</script>

<div class="fit-panel">
  {#if csv}
    <table class="param-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Fit</th>
          <th>Log-space</th>
          <th>Initial guess</th>
          <th>Fitted value</th>
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
            <td>
              <input
                type="number"
                step="any"
                value={row.initialGuess ?? model.parameters.get(row.id)?.value}
                disabled={!row.fit}
                onchange={(e) =>
                  updateParamRow(row.id, {
                    initialGuess: Number((e.target as HTMLInputElement).value),
                  })}
              />
            </td>
            <td
              >{row.fit && fittedValues
                ? fittedValues[row.id]?.toPrecision(6)
                : "—"}</td
            >
          </tr>
        {/each}
      </tbody>
    </table>

    {#if hasTrainedNNBlock}
      <p class="nn-note">
        Also training {[...model.nnBlocks.values()].filter((b) => b.trained)
          .length} NN block(s) — this fit uses the adjoint backend.
      </p>
    {/if}
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
      {#if fittedValues}
        <button
          type="button"
          class="apply-button"
          onclick={applyFittedParameters}>Apply fitted parameters</button
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
          : "the fit converged and couldn't improve further."}
      </p>
    {/if}
    {#if nfev > 0}
      <div
        class="progress-bar-track"
        title="{nfev} / {maxFunctionEvaluations} evaluations"
      >
        <div
          class="progress-bar-fill"
          style="width: {(fitComplete ? 100 : progressFraction * 100).toFixed(
            1,
          )}%"
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
            yMax={yMax}
          />
        </div>
      {/if}

      {#if residualHistory.length > 0}
        <div class="chart-cell">
          <LineChart
            data={residualHistoryData}
            loading={false}
            yScale="logarithmic"
            yMin={undefined}
            xLabel="Function evaluations"
            yLabel="Residual norm"
          />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .fit-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
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
    transition: width 200ms ease;
    background: var(--color-primary);
    height: 100%;
  }
  .error {
    margin: 0;
    color: var(--error, #dc2626);
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
  .param-table input[type="number"] {
    width: 8rem;
  }
  .run-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .run-button,
  .cancel-button,
  .apply-button {
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
    background: var(--error, #dc2626);
    color: white;
  }
  .apply-button {
    border-color: var(--color-primary);
    background: var(--color-surface);
    color: var(--color-primary);
  }
  .progress-info {
    color: var(--color-text-muted);
    font-size: 0.8rem;
  }
  .target-missed {
    margin: 0;
    color: var(--color-accent, #f6a800);
    font-size: 0.875rem;
  }
  .nn-note {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
</style>
