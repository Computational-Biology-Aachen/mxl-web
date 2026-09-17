// Optional curriculum-learning schedule for a fit run — mirrors MxlPy's
// jax/train.py `training_steps: list[(n_steps, cutoff)]`, adapted to
// mxl-web's time-domain (not point-count) data and its existing chunked
// convergence machinery. See ./curriculumRunner.ts for the run loop this
// schedule drives, and ./CurriculumStagesEditor.svelte for the splittable-
// bar UI that edits it.

/** One curriculum stage: fit against the data prefix up to `cutoffT`, for
 * `maxIterations` iterations. `stages` (as stored on Fit.svelte etc.)
 * always includes the *final* stage as its last element, whose `cutoffT`
 * is always `Infinity` (see `defaultCurriculum`): there's no divider to
 * drag for it, since it spans from the previous stage's cutoff to the end
 * of the data by construction, not by an editable boundary.
 *
 * The total step budget across every stage is fixed at
 * `maxFunctionEvaluations` — every non-final stage's `maxIterations` is a
 * real, user-set share of it, but the *final* stage's own stored
 * `maxIterations` is vestigial and never read: its real budget is always
 * the remainder (`finalStageBudget`), so growing one stage's share
 * necessarily shrinks the final stage's, never anyone else's. This is why
 * the final stage isn't draggable — its share isn't an independent value
 * to set, it's whatever's left. */
export type CurriculumStage = {
  cutoffT: number;
  maxIterations: number;
};

/** A single stage covering the full dataset — indistinguishable from a
 * plain (non-curriculum) fit. `cutoffT: Infinity` always resolves to
 * "the full range" via `resolveCutoffT`, regardless of the actual `tEnd`
 * once data loads (this is called before any data exists). */
export function defaultCurriculum(maxIterations: number): CurriculumStage[] {
  return [{ cutoffT: Infinity, maxIterations }];
}

/** Resolves a stage's cutoff to an absolute time, clamped to the data's own
 * range. */
export function resolveCutoffT(
  stage: CurriculumStage,
  tEnd: number,
  minT: number,
): number {
  return Math.min(Math.max(stage.cutoffT, minT), tEnd);
}

/** Sum of every *non-final* stage's own `maxIterations` — see
 * `CurriculumStage`'s own doc comment for why the final stage's stored
 * value isn't part of this. */
export function nonFinalBudgetSum(stages: CurriculumStage[]): number {
  return stages.slice(0, -1).reduce((sum, s) => sum + s.maxIterations, 0);
}

/** The final stage's real, derived budget: whatever's left of
 * `totalBudget` (the fit's own `maxFunctionEvaluations`) after every
 * non-final stage's own share — never negative, even if the stages
 * somehow over-commit the total. */
export function finalStageBudget(
  stages: CurriculumStage[],
  totalBudget: number,
): number {
  return Math.max(0, totalBudget - nonFinalBudgetSum(stages));
}
