import { describe, expect, it } from "vitest";
import { euler } from "../../src/lib/integrators/explicit/euler";
import { rk2 } from "../../src/lib/integrators/explicit/rk2";
import { rk45 } from "../../src/lib/integrators/explicit/rk45";
import type { Model } from "../../src/lib/integrators";

// Test problem: dy/dt = -y, y(0) = 1, exact solution y(t) = exp(-t)
const decay: Model = (_t, y, _p) => [-y[0]];
const decayExact = (t: number) => Math.exp(-t);

// 2D test: dy/dt = [-y[0], -2*y[1]], y(0) = [1,1], exact = [exp(-t), exp(-2t)]
const decay2d: Model = (_t, y, _p) => [-y[0], -2 * y[1]];
const decay2dExact = (t: number) => [Math.exp(-t), Math.exp(-2 * t)];

describe("euler", () => {
  it("time array has same length as values array", () => {
    // BUG: euler writes values[n] in a loop over i < n, producing values.length = n+1
    // while time.length = n. This test documents the bug.
    const result = euler(decay, { initialValues: [1], tEnd: 1, stepSize: 0.1, pars: [] });
    expect(result.time.length).toBe(result.values.length);
  });

  it("starts at t=0 with correct initial condition", () => {
    const result = euler(decay, { initialValues: [1], tEnd: 1, stepSize: 0.1, pars: [] });
    expect(result.time[0]).toBe(0);
    expect(result.values[0][0]).toBe(1);
  });

  it("ends at tEnd", () => {
    const result = euler(decay, { initialValues: [1], tEnd: 1, stepSize: 0.1, pars: [] });
    const lastTime = result.time[result.time.length - 1];
    expect(lastTime).toBeCloseTo(1, 10);
  });

  it("produces first-order accurate solution for decay ODE", () => {
    // Euler is O(h), tolerance ~0.1 for h=0.01
    const result = euler(decay, { initialValues: [1], tEnd: 1, stepSize: 0.01, pars: [] });
    const lastIdx = result.time.length - 1;
    const numerical = result.values[lastIdx][0];
    const exact = decayExact(result.time[lastIdx]);
    expect(Math.abs(numerical - exact)).toBeLessThan(0.01);
  });

  it("respects tStart parameter", () => {
    const result = euler(decay, {
      initialValues: [Math.exp(-0.5)],
      tEnd: 1.5,
      tStart: 0.5,
      stepSize: 0.1,
      pars: [],
    });
    expect(result.time[0]).toBeCloseTo(0.5, 10);
  });
});

describe("rk2", () => {
  it("starts at t=0 with correct initial condition", () => {
    const result = rk2(decay, { initialValues: [1], tEnd: 1, pars: [] });
    expect(result.time[0]).toBe(0);
    expect(result.values[0][0]).toBe(1);
  });

  it("ends at tEnd", () => {
    const result = rk2(decay, { initialValues: [1], tEnd: 1, pars: [] });
    const last = result.time[result.time.length - 1];
    expect(last).toBeCloseTo(1, 10);
  });

  it("time and values arrays have equal length", () => {
    const result = rk2(decay, { initialValues: [1], tEnd: 1, pars: [] });
    expect(result.time.length).toBe(result.values.length);
  });

  it("produces second-order accurate solution for decay ODE", () => {
    const result = rk2(decay, { initialValues: [1], tEnd: 1, h: 0.01, pars: [] });
    const last = result.time.length - 1;
    expect(Math.abs(result.values[last][0] - decayExact(1))).toBeLessThan(1e-4);
  });

  it("solves 2D system correctly", () => {
    const result = rk2(decay2d, { initialValues: [1, 1], tEnd: 1, h: 0.001, pars: [] });
    const last = result.time.length - 1;
    const t = result.time[last];
    const [exact0, exact1] = decay2dExact(t);
    expect(Math.abs(result.values[last][0] - exact0)).toBeLessThan(1e-4);
    expect(Math.abs(result.values[last][1] - exact1)).toBeLessThan(1e-4);
  });
});

describe("rk45", () => {
  it("starts at t=0 with correct initial condition", () => {
    const result = rk45(decay, { initialValues: [1], tEnd: 1, pars: [] });
    expect(result.time[0]).toBe(0);
    expect(result.values[0][0]).toBe(1);
  });

  it("time and values arrays have equal length", () => {
    const result = rk45(decay, { initialValues: [1], tEnd: 1, pars: [] });
    expect(result.time.length).toBe(result.values.length);
  });

  it("produces highly accurate solution at all recorded time points", () => {
    const result = rk45(decay, { initialValues: [1], tEnd: 1, pars: [] });
    for (let i = 0; i < result.time.length; i++) {
      const err = Math.abs(result.values[i][0] - decayExact(result.time[i]));
      expect(err).toBeLessThan(1e-4);
    }
  });

  it("solves 2D system with high accuracy", () => {
    const result = rk45(decay2d, { initialValues: [1, 1], tEnd: 2, pars: [] });
    for (let i = 0; i < result.time.length; i++) {
      const [e0, e1] = decay2dExact(result.time[i]);
      expect(Math.abs(result.values[i][0] - e0)).toBeLessThan(1e-3);
      expect(Math.abs(result.values[i][1] - e1)).toBeLessThan(1e-3);
    }
  });

  it("output is more accurate than euler at comparable step count", () => {
    const eulerResult = euler(decay, { initialValues: [1], tEnd: 1, stepSize: 0.1, pars: [] });
    const rk45Result = rk45(decay, { initialValues: [1], tEnd: 1, pars: [] });

    const eulerLast = eulerResult.time.length - 1;
    const rk45Last = rk45Result.time.length - 1;

    const eulerErr = Math.abs(eulerResult.values[eulerLast][0] - decayExact(eulerResult.time[eulerLast]));
    const rk45Err = Math.abs(rk45Result.values[rk45Last][0] - decayExact(rk45Result.time[rk45Last]));

    expect(rk45Err).toBeLessThan(eulerErr);
  });
});
