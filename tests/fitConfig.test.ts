import { describe, expect, it } from "vitest";
import { residualPerPoint, type FitConfig } from "../src/lib/fit/fitConfig";

function makeConfig(sortedT: number[], nTargets: number): FitConfig {
  return {
    parNames: ["k"],
    fitIdx: [0],
    nnBlockFitIdx: [],
    combinedFitIdx: [0],
    logFlags: [true],
    fitTargetsList: Array.from({ length: nTargets }, () => ({
      kind: "state" as const,
      index: 0,
      scale: 1,
      values: sortedT.map(() => 0),
    })),
    sortedT,
    nDerived: 0,
    rhsWat: "(module)",
    derivedWat: undefined,
    y0: [1],
    backend: undefined,
    adjointWat: undefined,
    jacobianWat: undefined,
    backendChoice: "lm",
    nnBlockOwner: new Map(),
    nnBlockConfigs: new Map(),
  };
}

describe("residualPerPoint", () => {
  it("divides by sqrt(points in the stage's own prefix × target count)", () => {
    const config = makeConfig([0, 1, 2, 3, 4], 2); // 5 points, 2 targets
    // cutoffT = 2 keeps only t <= 2 -> 3 points -> 3 * 2 = 6 entries
    expect(residualPerPoint(6, 2, config)).toBeCloseTo(6 / Math.sqrt(6));
  });

  it("uses the *stage's* prefix, not the full dataset, so an early stage's raw residualNorm doesn't read as artificially tiny", () => {
    const config = makeConfig([0, 1, 2, 3, 4], 1);
    // A stage fitting only the first 2 points has a smaller denominator
    // than one fitting all 5 — so an equal raw residualNorm normalizes to
    // a *larger* per-point value for the shorter prefix, not a smaller
    // one, correcting for the fact fewer residual terms were summed.
    const early = residualPerPoint(1, 1, config); // t <= 1 -> 2 points
    const late = residualPerPoint(1, 4, config); // t <= 4 -> 5 points
    expect(early).toBeGreaterThan(late);
  });

  it("never divides by zero when the prefix is empty", () => {
    const config = makeConfig([0, 1, 2, 3, 4], 1);
    expect(Number.isFinite(residualPerPoint(1, -1, config))).toBe(true);
  });
});
