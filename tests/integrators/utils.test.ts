import { describe, expect, it } from "vitest";
import {
  approxJacobian,
  maxNorm,
  scaleVec,
  solveLinear,
  subVec,
} from "../../src/lib/integrators/implicit/utils";

describe("subVec", () => {
  it("subtracts element-wise", () => {
    expect(subVec([3, 5, 7], [1, 2, 3])).toEqual([2, 3, 4]);
  });

  it("handles negatives", () => {
    expect(subVec([0, -1], [2, -3])).toEqual([-2, 2]);
  });

  it("returns zeros for equal vectors", () => {
    expect(subVec([1, 2, 3], [1, 2, 3])).toEqual([0, 0, 0]);
  });
});

describe("scaleVec", () => {
  it("scales by positive scalar", () => {
    expect(scaleVec([1, 2, 3], 2)).toEqual([2, 4, 6]);
  });

  it("scales by zero", () => {
    const result = scaleVec([5, -3, 7], 0);
    result.forEach((v) => expect(Math.abs(v)).toBe(0));
  });

  it("scales by negative scalar", () => {
    expect(scaleVec([1, -2, 3], -1)).toEqual([-1, 2, -3]);
  });
});

describe("maxNorm", () => {
  it("returns max absolute value", () => {
    expect(maxNorm([1, -5, 3])).toBe(5);
  });

  it("handles all positives", () => {
    expect(maxNorm([1, 2, 3])).toBe(3);
  });

  it("handles single element", () => {
    expect(maxNorm([-7])).toBe(7);
  });
});

describe("solveLinear", () => {
  it("solves 1x1 system", () => {
    const x = solveLinear([[3]], [6]);
    expect(x[0]).toBeCloseTo(2, 10);
  });

  it("solves 2x2 identity system", () => {
    const x = solveLinear(
      [
        [1, 0],
        [0, 1],
      ],
      [3, 7],
    );
    expect(x[0]).toBeCloseTo(3, 10);
    expect(x[1]).toBeCloseTo(7, 10);
  });

  it("solves 2x2 system", () => {
    // 2x + y = 5, x + 3y = 10 → x=1, y=3
    const x = solveLinear(
      [
        [2, 1],
        [1, 3],
      ],
      [5, 10],
    );
    expect(x[0]).toBeCloseTo(1, 8);
    expect(x[1]).toBeCloseTo(3, 8);
  });

  it("solves 3x3 system with partial pivoting", () => {
    // x + 2y + z = 9, 2x + y + z = 8, x + y + 2z = 7 → x=2, y=3, z=1
    const x = solveLinear(
      [
        [1, 2, 1],
        [2, 1, 1],
        [1, 1, 2],
      ],
      [9, 8, 7],
    );
    expect(x[0]).toBeCloseTo(2, 8);
    expect(x[1]).toBeCloseTo(3, 8);
    expect(x[2]).toBeCloseTo(1, 8);
  });

  it("requires pivoting — zeros in diagonal position", () => {
    // Naive Gauss without pivoting would fail: [[0,1],[1,0]]
    const x = solveLinear(
      [
        [0, 1],
        [1, 0],
      ],
      [3, 5],
    );
    expect(x[0]).toBeCloseTo(5, 8);
    expect(x[1]).toBeCloseTo(3, 8);
  });

  it("throws on singular matrix", () => {
    expect(() =>
      solveLinear(
        [
          [1, 2],
          [2, 4],
        ],
        [1, 2],
      ),
    ).toThrow("Singular matrix");
  });
});

describe("approxJacobian", () => {
  it("computes Jacobian of linear model exactly", () => {
    // f(t,y) = [-y[0], -2*y[1]] → J = [[-1,0],[0,-2]]
    const model = (_t: number, y: number[], _p: number[]) => [-y[0], -2 * y[1]];
    const J = approxJacobian(model, 0, [1, 1], []);
    expect(J[0][0]).toBeCloseTo(-1, 4);
    expect(J[0][1]).toBeCloseTo(0, 4);
    expect(J[1][0]).toBeCloseTo(0, 4);
    expect(J[1][1]).toBeCloseTo(-2, 4);
  });

  it("computes Jacobian of nonlinear model", () => {
    // f(t,y) = [y[0]*y[1], y[0]^2] at y=[2,3] → J = [[3,2],[4,0]]
    const model = (_t: number, y: number[], _p: number[]) => [
      y[0] * y[1],
      y[0] ** 2,
    ];
    const J = approxJacobian(model, 0, [2, 3], []);
    expect(J[0][0]).toBeCloseTo(3, 4);
    expect(J[0][1]).toBeCloseTo(2, 4);
    expect(J[1][0]).toBeCloseTo(4, 4);
    expect(J[1][1]).toBeCloseTo(0, 4);
  });

  it("does not permanently mutate y", () => {
    const model = (_t: number, y: number[], _p: number[]) => [-y[0]];
    const y = [5];
    approxJacobian(model, 0, y, []);
    expect(y[0]).toBe(5);
  });
});
