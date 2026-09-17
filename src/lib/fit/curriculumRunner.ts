// Runs a fit as a sequence of curriculum stages over one FitSession,
// unifying what used to be three near-identical chunk/progress loops
// (Fit.svelte's single-run `runFit()` and ensemble `startEnsembleMember()`,
// duplicated again in FitNde.svelte/FitUde.svelte). A single-stage schedule
// (curriculum.ts's `defaultCurriculum`) reduces to exactly today's
// single-shot fit — every non-final stage just adds a bounded-iteration
// warm-up over a shorter data prefix before it.
//
// Mirrors MxlPy's jax/train.py `train()`: fresh per-stage state, the
// fitted params from one stage seed the next stage's initial guess, and a
// solver failure is recovered from by perturbing the params and retrying
// (up to `maxConsecutiveSolverErrors` times) rather than aborting outright.

import type { FitProgress } from "@computational-biology-aachen/mxlweb-core";
import { drawNormal, mulberry32 } from "../random";
import { FitSession } from "../stores/fitStore";
import type { CurriculumStage } from "./curriculum";
import { finalStageBudget, resolveCutoffT } from "./curriculum";
import {
  nextChunkBudget,
  truncatedFitInitPayload,
  type FitConfig,
} from "./fitConfig";

export type CurriculumRunSettings = {
  targetResidualNorm: number;
  maxFunctionEvaluations: number;
  chunkMaxfev: number;
  progressUpdateInterval: number;
  /** Consecutive stalled chunks (no improvement > minDelta) before the
   * *final* stage gives up and reports done — see Fit.svelte's own
   * FIT_PATIENCE_CHUNKS/FIT_MIN_DELTA. */
  patienceChunks: number;
  minDelta: number;
  /** Consecutive mid-chunk solver failures (FitProgress.err) tolerated —
   * via perturb-and-retry — before giving up on the current stage and
   * moving to the next one (or, on the last stage, reporting the error). */
  maxConsecutiveSolverErrors: number;
  /** Relative magnitude of the perturbation applied to `pars` after a
   * solver failure, mirroring jax/train.py's `perturb_model`: each entry is
   * nudged by `N(0, perturbationScale * (abs(value) + 1e-12))`. */
  perturbationScale: number;
};

export type CurriculumRunHandlers = {
  /** FIT_INIT itself failed (a config problem, e.g. no fit targets) — not
   * retried, since perturbing params can't fix it. Ends the run. */
  onInitError: (message: string) => void;
  /** Every non-intermediate *and* intermediate progress report, tagged with
   * which stage produced it — update live nfev/residual/trajectory/chart
   * state from this regardless of stage. */
  onProgress: (event: {
    progress: FitProgress;
    stageIndex: number;
    stageCount: number;
    /** This stage's own resolved data cutoff — the preview trajectory
     * should never simulate past it, or it shows the model extending into
     * a range this stage hasn't fit at all (a non-final stage only ever
     * sees a prefix of the full data). */
    stageCutoffT: number;
  }) => void;
  /** The last stage exhausted its solver-error retry budget. Ends the run. */
  onRunError: (message: string) => void;
  /** A stage's FIT_INIT just succeeded (including the first) — the residual
   * at the stage's own initial guess, before any chunk has run, to anchor a
   * per-stage convergence chart at nfev=0. */
  onStageInit?: (info: {
    initialResidualNorm?: number;
    stageIndex: number;
    stageCount: number;
    stageCutoffT: number;
  }) => void;
  /** A non-final stage finished (budget exhausted) and the run is moving to
   * the next stage. */
  onStageAdvance?: (nextStageIndex: number, stageCount: number) => void;
  /** The final stage stopped — converged, hit its residual target, hit
   * maxFunctionEvaluations, or stalled past patience. Ends the run. */
  onDone: (info: { stalled: boolean }) => void;
};

export type CurriculumRunHandle = { cancel: () => void };

export function runCurriculumFit(
  config: FitConfig,
  initialPars: number[],
  stages: CurriculumStage[],
  getSettings: () => CurriculumRunSettings,
  handlers: CurriculumRunHandlers,
): CurriculumRunHandle {
  const tEnd = config.sortedT[config.sortedT.length - 1];
  const minT = config.sortedT[0];
  const rng = mulberry32(Math.floor(Math.random() * 2 ** 31));

  const session = new FitSession();
  let cancelled = false;

  let stageIndex = 0;
  let isFinal = stages.length === 1;
  let bestResidual = Infinity;
  let staleChunks = 0;
  let consecutiveErrors = 0;
  let lastGoodPars = initialPars;
  let stageMaxIterations = stages[0].maxIterations;
  let stageCutoffT = resolveCutoffT(stages[0], tEnd, minT);

  function perturb(pars: number[], settings: CurriculumRunSettings): number[] {
    return pars.map(
      (p) =>
        p +
        drawNormal(rng, 0, settings.perturbationScale * (Math.abs(p) + 1e-12)),
    );
  }

  // Initiates FIT_INIT for `index` against `pars`. Doesn't touch
  // stage-scoped bookkeeping (stageIndex/isFinal/bestResidual/staleChunks/
  // consecutiveErrors/stageMaxIterations) — callers set what applies to
  // them: a genuine stage transition resets all of it (startStage), a
  // same-stage retry after a solver failure must *not* reset
  // consecutiveErrors, or the retry budget it's counting against never
  // actually accumulates (see retryCurrentStage).
  function initStage(
    index: number,
    pars: number[],
    first: boolean,
    settings: CurriculumRunSettings,
  ) {
    lastGoodPars = pars;
    const cutoffT = resolveCutoffT(stages[index], tEnd, minT);
    const payload = truncatedFitInitPayload(config, pars, settings, cutoffT);
    if (!first) session.free();
    session.init(payload);
  }

  function startStage(
    index: number,
    pars: number[],
    first: boolean,
    settings: CurriculumRunSettings,
  ) {
    stageIndex = index;
    isFinal = index === stages.length - 1;
    bestResidual = Infinity;
    staleChunks = 0;
    consecutiveErrors = 0;
    stageMaxIterations = stages[index].maxIterations;
    stageCutoffT = resolveCutoffT(stages[index], tEnd, minT);
    initStage(index, pars, first, settings);
  }

  function retryCurrentStage(pars: number[], settings: CurriculumRunSettings) {
    initStage(stageIndex, pars, false, settings);
  }

  session.onInitResult((result) => {
    if (cancelled) return;
    const settings = getSettings();
    if (!result.ok) {
      handlers.onInitError(result.error ?? "Failed to start the fit.");
      session.cancel();
      return;
    }
    handlers.onStageInit?.({
      initialResidualNorm: result.initialResidualNorm,
      stageIndex,
      stageCount: stages.length,
      stageCutoffT,
    });
    const budget = isFinal
      ? nextChunkBudget(
          0,
          settings.chunkMaxfev,
          finalStageBudget(stages, settings.maxFunctionEvaluations),
        )
      : Math.min(settings.chunkMaxfev, stageMaxIterations);
    session.chunk(Math.max(budget, 0));
  });

  session.onProgress((progress) => {
    if (cancelled) return;
    const settings = getSettings();

    if (progress.err) {
      consecutiveErrors += 1;
      if (consecutiveErrors > settings.maxConsecutiveSolverErrors) {
        if (stageIndex + 1 < stages.length) {
          startStage(stageIndex + 1, lastGoodPars, false, settings);
        } else {
          handlers.onRunError(progress.err.message);
        }
        return;
      }
      retryCurrentStage(perturb(lastGoodPars, settings), settings);
      return;
    }

    consecutiveErrors = 0;
    lastGoodPars = progress.params;
    handlers.onProgress({
      progress,
      stageIndex,
      stageCount: stages.length,
      stageCutoffT,
    });
    if (progress.intermediate) return;

    if (isFinal) {
      const finalBudget = finalStageBudget(
        stages,
        settings.maxFunctionEvaluations,
      );
      const improvement = Number.isFinite(bestResidual)
        ? (bestResidual - progress.residualNorm) / bestResidual
        : Infinity;
      if (improvement > settings.minDelta) {
        bestResidual = progress.residualNorm;
        staleChunks = 0;
      } else {
        staleChunks += 1;
      }
      const stalled = staleChunks >= settings.patienceChunks;
      const reachedTarget =
        progress.residualNorm <= settings.targetResidualNorm;
      const reachedMaxEvals = progress.nfev >= finalBudget;
      const budget = nextChunkBudget(
        progress.nfev,
        settings.chunkMaxfev,
        finalBudget,
      );
      if (
        !progress.done &&
        !reachedTarget &&
        !reachedMaxEvals &&
        !stalled &&
        budget > 0
      ) {
        session.chunk(budget);
      } else {
        session.free();
        handlers.onDone({ stalled });
      }
    } else {
      const reachedBudget = progress.nfev >= stageMaxIterations;
      const budget = Math.min(
        settings.chunkMaxfev,
        stageMaxIterations - progress.nfev,
      );
      if (!progress.done && !reachedBudget && budget > 0) {
        session.chunk(budget);
      } else {
        const next = stageIndex + 1;
        handlers.onStageAdvance?.(next, stages.length);
        startStage(next, progress.params, false, settings);
      }
    }
  });

  startStage(0, initialPars, true, getSettings());

  return {
    cancel() {
      cancelled = true;
      session.cancel();
    },
  };
}
