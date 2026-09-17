// Shared fit-config building, extracted from Fit.svelte (and mirrored,
// near-verbatim, into FitNde.svelte/FitUde.svelte before this module
// existed). Pure functions taking every input explicitly, so the three
// components — and the curriculum runner (./curriculumRunner.ts) — can all
// call into one copy instead of three drifting ones.

import type {
  FitBackend,
  ModelBuilderBase,
  NNBlockConfig,
} from "@computational-biology-aachen/mxlweb-core";
import type { ParsedCsv } from "../csvParse";
import type { FitParameterConfig, FitTargetMapping } from "../index";

export type BackendChoice = "lm" | "lm-jacobian" | "adjoint";

export type FitTargetEntry = {
  kind: "state" | "derived";
  index: number;
  scale: number;
  values: number[];
};

export type FitConfig = {
  parNames: string[];
  fitIdx: number[];
  nnBlockFitIdx: number[];
  combinedFitIdx: number[];
  logFlags: boolean[];
  fitTargetsList: FitTargetEntry[];
  sortedT: number[];
  nDerived: number;
  rhsWat: string;
  derivedWat?: string;
  y0: number[];
  backend?: FitBackend;
  adjointWat?: string;
  jacobianWat?: string;
  /** The user-facing selection this config was built from — kept around
   * purely for display (the "this fit uses the X backend" note), since
   * the wire-level `backend` field alone can't distinguish "lm" from
   * "lm-jacobian" (both report as plain "lm", FitInitRequest.jacobianWat's
   * doc comment). */
  backendChoice: BackendChoice;
  /** parName -> owning NN block key, for every entry in nnBlockFitIdx —
   * lets the ensemble draw recognize a trained block's own `scale` name
   * (left untouched, ADR 0006 §2.8) versus an ordinary fit-parameter row. */
  nnBlockOwner: Map<string, string>;
  /** Every *trained* block's own architecture config, keyed by block key —
   * lets the ensemble draw re-run `buildNNBlock` with a fresh per-member
   * seed to get that member's own independently Glorot-initialized weights
   * (ADR 0006 §2.8), the same generator `addNNBlock` itself calls. */
  nnBlockConfigs: Map<string, NNBlockConfig>;
};

export function fitTargets(
  model: ModelBuilderBase,
  fitParameters: FitParameterConfig[],
): { fitIdx: number[]; ok: boolean } {
  // getAllAddressableNames(), not getParameterNames(): fitIdx is spliced
  // directly into combinedFitIdx below, which is indexed against the
  // former. fitParameters entries are always ordinary parameter ids
  // (never a weight/scale name — those join separately via
  // nnBlockParamNames), so this doesn't change *which* indices are found,
  // only removes the implicit "getParameterNames() is always a positional
  // prefix of getAllAddressableNames()" assumption the two arrays would
  // otherwise have to agree on silently.
  const parNames = model.getAllAddressableNames();
  const fitIdx = fitParameters
    .filter((p) => p.fit)
    .map((p) => parNames.indexOf(p.id))
    .filter((i) => i >= 0);
  return { fitIdx, ok: fitIdx.length > 0 };
}

/** Everything a fit run needs that does *not* depend on where it starts or
 * which data prefix a curriculum stage truncates it to (ADR 0006 §2.4) —
 * built once and reused by single-model, ensemble, and every curriculum
 * stage's own FitInitRequest. */
export function buildFitConfig(params: {
  model: ModelBuilderBase;
  fitParameters: FitParameterConfig[];
  csv: ParsedCsv | null;
  timeColumn: string | undefined;
  targets: FitTargetMapping[];
  candidateKeys: { key: string; kind: "state" | "derived" }[];
  backendChoice: BackendChoice;
  hasTrainedNNBlock: boolean;
}): { ok: true; config: FitConfig } | { ok: false; error: string } {
  const {
    model,
    fitParameters,
    csv,
    timeColumn,
    targets,
    candidateKeys,
    backendChoice,
    hasTrainedNNBlock,
  } = params;

  if (!csv || !timeColumn || targets.length === 0) {
    return {
      ok: false,
      error: "Upload a data file and map at least one column first.",
    };
  }
  const { fitIdx, ok } = fitTargets(model, fitParameters);
  if (!ok && !hasTrainedNNBlock) {
    return {
      ok: false,
      error:
        "Select at least one parameter to fit, or enable training on an NN block.",
    };
  }

  // A mapping can go stale (e.g. the model was reloaded from a new SBML
  // file) without the mapping table being touched — reject rather than
  // let an unresolved key reach the WASM heap as a bogus buffer index.
  const knownKeys = new Set(candidateKeys.map((c) => c.key));
  const staleTarget = targets.find((t) => !knownKeys.has(t.key));
  if (staleTarget) {
    return {
      ok: false,
      error: `"${staleTarget.key}" is no longer a valid target — re-map column "${staleTarget.column}".`,
    };
  }

  const columns = csv.columns;
  const dataT = columns[timeColumn];
  const order = dataT.map((t, i) => i).sort((a, b) => dataT[a] - dataT[b]);
  const sortedT = order.map((i) => dataT[i]);
  if (sortedT.some((t) => Number.isNaN(t))) {
    return {
      ok: false,
      error: `Column "${timeColumn}" has a non-numeric value.`,
    };
  }
  for (const t of targets) {
    if (order.some((i) => Number.isNaN(columns[t.column][i]))) {
      return {
        ok: false,
        error: `Column "${t.column}" has a non-numeric value.`,
      };
    }
  }

  const derivedTargets = targets.filter((t) => t.kind === "derived");
  const derivedKeys = derivedTargets.map((t) => t.key);

  // "adjoint" and "lm-jacobian" both only support state-variable targets
  // v1 (see FitInitRequest.adjointWat's/jacobianWat's doc comments) —
  // reject up front rather than let fit_init fail deep in the WASM
  // boundary. Independent of whether an NN block is even involved: both
  // backends work over any fit-parameter set, mechanistic included.
  if (
    (backendChoice === "adjoint" || backendChoice === "lm-jacobian") &&
    derivedTargets.length > 0
  ) {
    return {
      ok: false,
      error: `The ${backendChoice === "adjoint" ? "adjoint" : "analytic-Jacobian LM"} backend requires every fit target to be a state variable, not a derived quantity — pick "Levenberg-Marquardt" instead, or remap the derived-quantity target.`,
    };
  }

  let derivedWat: string | undefined;
  try {
    derivedWat =
      derivedKeys.length > 0 ? model.buildWatDerived(derivedKeys) : undefined;
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to build the fit model.",
    };
  }

  const fitTargetsList: FitTargetEntry[] = targets.map((t) => {
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

  // The full flat array the compiled WAT module actually indexes into
  // (ModelBuilderBase.lower()'s ir.parNames === getAllAddressableNames():
  // model.parameters, then model.nnWeights) — not getParameterNames(),
  // which is the UI-facing kinetic-parameters-plus-scale subset. Every
  // index (fitIdx, nnBlockFitIdx, combinedFitIdx) is positional against
  // *this* array.
  const parNames = model.getAllAddressableNames();

  // Every weight/bias, and the block's own trainable scale factor, of
  // every *trained* NN block joins the fitted set — always in linear
  // space, never log-space (ADR 0005 §2.1.2). Untrained blocks keep their
  // current weights/scale fixed and are simply left out of fitIdx.
  const nnBlockParamNames: string[] = [];
  const nnBlockOwner = new Map<string, string>();
  const nnBlockConfigs = new Map<string, NNBlockConfig>();
  for (const [key, config] of model.nnBlocks) {
    if (!config.trained) continue;
    nnBlockConfigs.set(key, config);
    const scaleName = `${key}_scale`;
    nnBlockParamNames.push(scaleName);
    nnBlockOwner.set(scaleName, key);
    for (const name of model.nnBlockWeightNames(key)) {
      nnBlockParamNames.push(name);
      nnBlockOwner.set(name, key);
    }
  }
  const nnBlockFitIdx = nnBlockParamNames.map((name) => parNames.indexOf(name));
  const combinedFitIdx = [...fitIdx, ...nnBlockFitIdx];

  const logFlags = [
    ...fitIdx.map(
      (i) => fitParameters.find((p) => p.id === parNames[i])?.logSpace ?? true,
    ),
    ...nnBlockFitIdx.map(() => false),
  ];

  // Wire-level `backend` only ever distinguishes "adjoint" from "lm" —
  // "lm-jacobian" is still reported as plain "lm" with jacobianWat
  // attached (FitInitRequest.jacobianWat's doc comment); undefined
  // defaults to "lm" inside fitWorker.ts either way.
  const backend: FitBackend | undefined =
    backendChoice === "adjoint" ? "adjoint" : undefined;
  let adjointWat: string | undefined;
  let jacobianWat: string | undefined;
  if (backendChoice === "adjoint") {
    try {
      adjointWat = model.buildAdjointWat(
        combinedFitIdx.map((i) => parNames[i]),
      );
    } catch (e) {
      return {
        ok: false,
        error:
          e instanceof Error ? e.message : "Failed to build the adjoint model.",
      };
    }
  } else if (backendChoice === "lm-jacobian") {
    try {
      jacobianWat = model.buildJacobianWat(
        combinedFitIdx.map((i) => parNames[i]),
      );
    } catch (e) {
      return {
        ok: false,
        error:
          e instanceof Error
            ? e.message
            : "Failed to build the analytic-Jacobian model.",
      };
    }
  }

  return {
    ok: true,
    config: {
      parNames,
      fitIdx,
      nnBlockFitIdx,
      combinedFitIdx,
      logFlags,
      fitTargetsList,
      sortedT,
      nDerived: derivedKeys.length,
      rhsWat: model.buildWat(),
      derivedWat,
      y0: model.resolveInitialValues(),
      backend,
      adjointWat,
      jacobianWat,
      backendChoice,
      nnBlockOwner,
      nnBlockConfigs,
    },
  };
}

export function fitInitPayload(
  config: FitConfig,
  pars: number[],
  settings: { targetResidualNorm: number; progressUpdateInterval: number },
) {
  return {
    rhsWat: config.rhsWat,
    derivedWat: config.derivedWat,
    nDerived: config.nDerived,
    y0: config.y0,
    pars,
    fitIdx: config.combinedFitIdx,
    logFlags: config.logFlags,
    targets: config.fitTargetsList.map(({ kind, index, scale }) => ({
      kind,
      index,
      scale,
    })),
    dataT: config.sortedT,
    dataY: config.fitTargetsList.flatMap((t) => t.values),
    tEnd: config.sortedT[config.sortedT.length - 1],
    solver: "radau5" as const,
    rtol: 1e-8,
    atol: 1e-10,
    targetResidualNorm: settings.targetResidualNorm,
    backend: config.backend,
    adjointWat: config.adjointWat,
    jacobianWat: config.jacobianWat,
    progressUpdateInterval: settings.progressUpdateInterval,
  };
}

/** Same as {@link fitInitPayload}, but truncated to the data points at or
 * before `cutoffT` (at least one point is always kept) — one curriculum
 * stage's own view of `config` (see ./curriculum.ts). `config.sortedT` is
 * ascending (buildFitConfig's own sort), so the truncation is a plain
 * prefix slice, not a filter. */
export function truncatedFitInitPayload(
  config: FitConfig,
  pars: number[],
  settings: { targetResidualNorm: number; progressUpdateInterval: number },
  cutoffT: number,
) {
  const n = Math.max(
    1,
    Math.min(
      config.sortedT.filter((t) => t <= cutoffT).length,
      config.sortedT.length,
    ),
  );
  if (n === config.sortedT.length) {
    return fitInitPayload(config, pars, settings);
  }
  const truncated: FitConfig = {
    ...config,
    sortedT: config.sortedT.slice(0, n),
    fitTargetsList: config.fitTargetsList.map((t) => ({
      ...t,
      values: t.values.slice(0, n),
    })),
  };
  return fitInitPayload(truncated, pars, settings);
}

// Caps a chunk's own maxfev so a fit doesn't overshoot its budget (the
// curriculum stage's own maxIterations, or maxFunctionEvaluations for the
// final stage) by a whole chunk's worth.
export function nextChunkBudget(
  currentNfev: number,
  chunkMaxfev: number,
  budget: number,
): number {
  return Math.min(chunkMaxfev, budget - currentNfev);
}

/** Normalizes a chunk's `residualNorm` to a per-entry (per data point, per
 * target) value, for display on a chart spanning multiple curriculum
 * stages. `residualNorm` is an L2 norm (MINPACK/lmdif convention: sqrt of
 * the sum of squared residuals), not a mean — so it scales with
 * sqrt(vector length), and a stage's own vector length (its data prefix's
 * point count × target count) shrinks with `cutoffT`. Left un-normalized,
 * a chart spanning several stages would show a residual "jump" at every
 * transition that's really just an artifact of suddenly fitting more
 * data, not the fit getting worse — mirrors MosaicML Composer's Sequence
 * Length Warmup, which normalizes loss "per token" for the same reason
 * across its own growing-context curriculum.
 *
 * Display-only: `targetResidualNorm`/plateau and the raw-value text
 * readout keep comparing the un-normalized `residualNorm` throughout,
 * since that's the actual number the stopping criteria (and the user
 * watching them) are reasoning about. */
export function residualPerPoint(
  residualNorm: number,
  cutoffT: number,
  config: FitConfig,
): number {
  const nPoints = config.sortedT.filter((t) => t <= cutoffT).length;
  const nEntries = Math.max(1, nPoints * config.fitTargetsList.length);
  return residualNorm / Math.sqrt(nEntries);
}
