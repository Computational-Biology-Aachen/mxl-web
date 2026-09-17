/**
 * Regression tests for two bugs an independent implementation review found
 * in runCurriculumFit (src/lib/fit/curriculumRunner.ts), neither of which
 * any existing test touched:
 *
 * 1. `startStage` unconditionally reset `consecutiveErrors = 0`, but it was
 *    also the function the perturb-and-retry path called for a same-stage
 *    retry — so the retry counter was wiped right after every increment
 *    and `maxConsecutiveSolverErrors` could never trigger. A persistently
 *    failing solve retried forever instead of giving up and moving on.
 * 2. `runCurriculumFit` took `settings` as a plain object, captured once at
 *    the call site — so editing "Stop once residual norm reaches"/etc.
 *    mid-run had no effect until the *next* run, unlike every other
 *    reactive setting in Fit.svelte. Fixed by taking a `getSettings()`
 *    getter, re-read on every init/progress event instead.
 *
 * FitSession (src/lib/stores/fitStore.ts) is mocked here: it's a thin
 * postMessage wrapper around a real Worker, and `$app/environment`'s
 * `browser` stub is false under vitest anyway (see vitest.config.ts), so a
 * real FitSession never delivers a message in this environment — these
 * tests drive its onInitResult/onProgress callbacks directly instead.
 */
import { describe, expect, it, vi } from "vitest";
import type { FitConfig } from "../src/lib/fit/fitConfig";
import type {
  CurriculumRunHandlers,
  CurriculumRunSettings,
} from "../src/lib/fit/curriculumRunner";
import type { CurriculumStage } from "../src/lib/fit/curriculum";

type Handler<T> = (arg: T) => void;

class FakeFitSession {
  static instances: FakeFitSession[] = [];
  initCalls: { dataT: number[]; tEnd: number; pars: number[] }[] = [];
  chunkCalls: number[] = [];
  freeCalls = 0;
  cancelCalls = 0;
  initHandlers: Handler<{
    ok: boolean;
    error?: string;
    initialResidualNorm?: number;
  }>[] = [];
  progressHandlers: Handler<Record<string, unknown>>[] = [];

  constructor() {
    FakeFitSession.instances.push(this);
  }
  onInitResult(h: (typeof this.initHandlers)[number]) {
    this.initHandlers.push(h);
    return () => {};
  }
  onProgress(h: (typeof this.progressHandlers)[number]) {
    this.progressHandlers.push(h);
    return () => {};
  }
  init(req: { dataT: number[]; tEnd: number; pars: number[] }) {
    this.initCalls.push(req);
  }
  chunk(n: number) {
    this.chunkCalls.push(n);
  }
  free() {
    this.freeCalls += 1;
  }
  cancel() {
    this.cancelCalls += 1;
  }

  fireInit(r: { ok: boolean; error?: string; initialResidualNorm?: number }) {
    this.initHandlers.forEach((h) => h(r));
  }
  fireProgress(p: Record<string, unknown>) {
    this.progressHandlers.forEach((h) => h(p));
  }
}

vi.mock("../src/lib/stores/fitStore", () => ({ FitSession: FakeFitSession }));

// Imported after the mock so runCurriculumFit picks up FakeFitSession.
const { runCurriculumFit } = await import("../src/lib/fit/curriculumRunner");

function makeConfig(): FitConfig {
  return {
    parNames: ["k"],
    fitIdx: [0],
    nnBlockFitIdx: [],
    combinedFitIdx: [0],
    logFlags: [true],
    fitTargetsList: [
      { kind: "state", index: 0, scale: 1, values: [1, 2, 3, 4, 5] },
    ],
    sortedT: [0, 1, 2, 3, 4],
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

function baseSettings(): CurriculumRunSettings {
  return {
    targetResidualNorm: 1e-6,
    maxFunctionEvaluations: 1000,
    chunkMaxfev: 50,
    progressUpdateInterval: 5,
    patienceChunks: 20,
    minDelta: 1e-3,
    maxConsecutiveSolverErrors: 2,
    perturbationScale: 1e-3,
  };
}

function noopHandlers(
  overrides: Partial<CurriculumRunHandlers> = {},
): CurriculumRunHandlers {
  return {
    onInitError: vi.fn(),
    onProgress: vi.fn(),
    onRunError: vi.fn(),
    onDone: vi.fn(),
    ...overrides,
  };
}

describe("runCurriculumFit — solver-failure retry", () => {
  it("gives up on a stage and advances after maxConsecutiveSolverErrors, instead of retrying forever", () => {
    FakeFitSession.instances.length = 0;
    const config = makeConfig();
    const stages: CurriculumStage[] = [
      { cutoffT: 2, maxIterations: 100 }, // t <= 2, 3 points
      { cutoffT: Infinity, maxIterations: 100 }, // final, full 5 points
    ];
    const settings = baseSettings(); // maxConsecutiveSolverErrors: 2

    runCurriculumFit(config, [1], stages, () => settings, noopHandlers());
    const session = FakeFitSession.instances.at(-1)!;

    session.fireInit({ ok: true, initialResidualNorm: 5 });
    expect(session.initCalls[0].dataT.length).toBe(3); // stage 0's truncated prefix

    const err = { message: "solver hit a stiff domain" };
    for (let i = 0; i < settings.maxConsecutiveSolverErrors; i++) {
      session.fireProgress({
        err,
        nfev: 1,
        residualNorm: NaN,
        params: [1],
        done: false,
      });
    }
    // Still within budget: every retry re-inits the *same* (stage 0) prefix.
    expect(session.initCalls.at(-1)!.dataT.length).toBe(3);

    // One more failure exceeds the budget — must give up on stage 0 and
    // move on, not retry stage 0 a 4th time.
    session.fireProgress({
      err,
      nfev: 1,
      residualNorm: NaN,
      params: [1],
      done: false,
    });

    expect(session.initCalls.at(-1)!.dataT.length).toBe(5); // now fitting the final stage's full data
  });

  it("reports a run error instead of looping when the *final* stage exhausts its retry budget", () => {
    FakeFitSession.instances.length = 0;
    const config = makeConfig();
    const stages: CurriculumStage[] = [
      { cutoffT: Infinity, maxIterations: 100 }, // single stage = final
    ];
    const settings = { ...baseSettings(), maxConsecutiveSolverErrors: 1 };
    const onRunError = vi.fn();

    runCurriculumFit(
      config,
      [1],
      stages,
      () => settings,
      noopHandlers({ onRunError }),
    );
    const session = FakeFitSession.instances.at(-1)!;
    session.fireInit({ ok: true, initialResidualNorm: 5 });

    const err = { message: "solver hit a stiff domain" };
    session.fireProgress({
      err,
      nfev: 1,
      residualNorm: NaN,
      params: [1],
      done: false,
    });
    expect(onRunError).not.toHaveBeenCalled();

    session.fireProgress({
      err,
      nfev: 1,
      residualNorm: NaN,
      params: [1],
      done: false,
    });
    expect(onRunError).toHaveBeenCalledWith(err.message);
  });
});

describe("runCurriculumFit — live settings", () => {
  it("re-reads targetResidualNorm on every progress event instead of freezing it at run start", () => {
    FakeFitSession.instances.length = 0;
    const config = makeConfig();
    const stages: CurriculumStage[] = [
      { cutoffT: Infinity, maxIterations: 1000 },
    ];
    const settings = { ...baseSettings(), targetResidualNorm: 0.01 };
    const onDone = vi.fn();

    runCurriculumFit(
      config,
      [1],
      stages,
      () => settings,
      noopHandlers({ onDone }),
    );
    const session = FakeFitSession.instances.at(-1)!;
    session.fireInit({ ok: true, initialResidualNorm: 5 });

    // residualNorm (5) is well above the initial target (0.01) — keeps running.
    session.fireProgress({
      nfev: 10,
      residualNorm: 5,
      params: [1.1],
      done: false,
    });
    expect(onDone).not.toHaveBeenCalled();
    expect(session.chunkCalls.length).toBeGreaterThan(1);

    // User loosens the target mid-run (the settings-table input is never
    // disabled while running) — should take effect on the very next event.
    settings.targetResidualNorm = 10;
    session.fireProgress({
      nfev: 20,
      residualNorm: 5,
      params: [1.05],
      done: false,
    });

    expect(onDone).toHaveBeenCalledWith({ stalled: false });
  });
});
