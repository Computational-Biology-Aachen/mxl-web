import { describe, expect, it } from "vitest";
import {
  defaultCurriculum,
  finalStageBudget,
  nonFinalBudgetSum,
  resolveCutoffT,
  type CurriculumStage,
} from "../src/lib/fit/curriculum";

describe("nonFinalBudgetSum / finalStageBudget", () => {
  it("a single (default) stage claims nothing, so the final stage gets the whole budget", () => {
    const stages = defaultCurriculum(1000);
    expect(nonFinalBudgetSum(stages)).toBe(0);
    expect(finalStageBudget(stages, 1000)).toBe(1000);
  });

  it("the final stage gets whatever's left after every non-final stage's own share", () => {
    const stages: CurriculumStage[] = [
      { cutoffT: 10, maxIterations: 200 },
      { cutoffT: 20, maxIterations: 300 },
      { cutoffT: Infinity, maxIterations: 9999 }, // vestigial — never read
    ];
    expect(nonFinalBudgetSum(stages)).toBe(500);
    expect(finalStageBudget(stages, 1000)).toBe(500);
  });

  it("never goes negative even if the non-final stages somehow over-commit the total", () => {
    const stages: CurriculumStage[] = [
      { cutoffT: 10, maxIterations: 700 },
      { cutoffT: 20, maxIterations: 700 },
      { cutoffT: Infinity, maxIterations: 0 },
    ];
    expect(finalStageBudget(stages, 1000)).toBe(0);
  });
});

describe("resolveCutoffT", () => {
  it("Infinity (the final stage's sentinel) always resolves to tEnd, regardless of tEnd itself", () => {
    const stage: CurriculumStage = { cutoffT: Infinity, maxIterations: 1 };
    expect(resolveCutoffT(stage, 60, 0)).toBe(60);
    expect(resolveCutoffT(stage, 5, 0)).toBe(5);
  });

  it("clamps a finite cutoff into [minT, tEnd]", () => {
    expect(resolveCutoffT({ cutoffT: 80, maxIterations: 1 }, 60, 0)).toBe(60);
    expect(resolveCutoffT({ cutoffT: -5, maxIterations: 1 }, 60, 2)).toBe(2);
  });
});
