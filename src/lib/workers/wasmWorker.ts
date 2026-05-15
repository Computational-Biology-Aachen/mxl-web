/**
 * wasmWorker.ts — native WASM backend for method === 'radau5'
 *
 * Architecture:
 *   1. On __INIT__: load Emscripten-compiled RADAU5 module from static/wasm/radau5.js
 *   2. Per request:
 *      a. JIT-compile WAT string → model WASM (shares Emscripten memory)
 *      b. Register model function in RADAU5's function table
 *      c. Call run_radau5() via Emscripten ccall
 *      d. Read time-series from output buffer
 *      e. Evaluate derived variables in JS
 *      f. Protocol: repeat per segment with updated pars
 *   3. Post SimulationResult
 */

import type {
  SimulationError,
  SimulationRequest,
  SimulationResult,
} from "$lib/stores/workerStore";
import { mathImports } from "$lib/mathml/wat-codegen";
export {}; // make it a module

// ------------------------------------------------------------
// WAT text → WASM binary
// Uses the browser's built-in WebAssembly.validate / compile
// after encoding the WAT text using the wasm-wat package, OR
// falls back to a dynamic import of @webassembly/wat-compiler.
// ------------------------------------------------------------
async function watToWasm(wat: string): Promise<Uint8Array> {
  // Dynamic import — only loads when first simulation runs
  const { default: wat2wasm } = await import("wat-compiler");
  return wat2wasm(wat) as Uint8Array;
}

// ------------------------------------------------------------
// State
// ------------------------------------------------------------
let basePath = "";
let radauPromise: Promise<EmscriptenModule> | null = null;

// Cache compiled model modules keyed by WAT string hash
const modelCache = new Map<string, WebAssembly.Module>();

// Simple hash for cache key
function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

// ------------------------------------------------------------
// Emscripten module type (subset we need)
// ------------------------------------------------------------
interface EmscriptenModule {
  addFunction(fn: (...args: unknown[]) => unknown, sig: string): number;
  removeFunction(idx: number): void;
  _malloc(size: number): number;
  _free(ptr: number): void;
  _run_radau5(
    n: number,
    tStart: number,
    tEnd: number,
    yPtr: number,
    rparPtr: number,
    rtol: number,
    atol: number,
    hInit: number,
    nmax: number,
  ): number;
  _set_model_fn(tableIdx: number): void;
  _init_output(capacity: number, dim: number): void;
  _free_output(): void;
  _get_out_n(): number;
  _get_out_t(): number; // pointer
  _get_out_y(): number; // pointer
  HEAPF64: Float64Array;
  wasmMemory: WebAssembly.Memory;
}

async function loadRadau(base: string): Promise<EmscriptenModule> {
  // Dynamically load the Emscripten-generated JS glue
  const glueUrl = `${base}/wasm/radau5.js`;
  const response = await fetch(glueUrl);
  if (!response.ok) {
    throw new Error(`Failed to load RADAU5 WASM glue from ${glueUrl}`);
  }
  const js = await response.text();
  // Emscripten MODULARIZE=1 output: eval returns a factory function
  // eslint-disable-next-line no-new-func
  const factory = new Function(js + "\nreturn RadauModule;")();
  const mod: EmscriptenModule = await factory({
    locateFile: (f: string) => `${base}/wasm/${f}`,
  });
  return mod;
}

// ------------------------------------------------------------
// Compile + instantiate a model WASM module
// ------------------------------------------------------------
async function compileModel(
  wat: string,
  emMod: EmscriptenModule,
): Promise<WebAssembly.Instance> {
  const key = hashStr(wat);
  let compiled = modelCache.get(key);
  if (!compiled) {
    const bytes = await watToWasm(wat);
    compiled = await WebAssembly.compile(bytes.buffer as ArrayBuffer);
    modelCache.set(key, compiled);
  }
  return WebAssembly.instantiate(compiled, {
    env: { memory: emMod.wasmMemory },
    math: mathImports() as WebAssembly.ModuleImports,
  });
}

// ------------------------------------------------------------
// Resample irregular time series to nPoints evenly-spaced times
// ------------------------------------------------------------
function resampleUniform(
  time: number[],
  y: number[][],
  nPoints: number,
): { time: number[]; y: number[][] } {
  if (time.length === 0 || nPoints <= 0) return { time, y };
  if (time.length === 1) {
    return { time: Array(nPoints).fill(time[0]), y: Array(nPoints).fill(y[0]) };
  }
  const tStart = time[0];
  const tEnd = time[time.length - 1];
  const outTime: number[] = [];
  const outY: number[][] = [];
  for (let k = 0; k < nPoints; k++) {
    const t = nPoints === 1 ? tStart : tStart + (k / (nPoints - 1)) * (tEnd - tStart);
    outTime.push(t);
    let lo = 0, hi = time.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (time[mid] <= t) lo = mid; else hi = mid;
    }
    if (hi === lo || time[hi] === time[lo]) {
      outY.push([...y[lo]]);
    } else {
      const alpha = (t - time[lo]) / (time[hi] - time[lo]);
      outY.push(y[lo].map((v, j) => v + alpha * (y[hi][j] - v)));
    }
  }
  return { time: outTime, y: outY };
}

// ------------------------------------------------------------
// Run one integration segment
// ------------------------------------------------------------
function runSegment(
  mod: EmscriptenModule,
  modelIdx: number,
  n: number,
  tStart: number,
  tEnd: number,
  y: Float64Array,
  pars: Float64Array,
  rtol: number,
  atol: number,
  nout: number,
): { time: number[]; y: number[][] } | { err: string } {
  const yPtr = mod._malloc(n * 8);
  const rparPtr = mod._malloc(pars.length * 8);
  try {
    mod.HEAPF64.set(y, yPtr / 8);
    mod.HEAPF64.set(pars, rparPtr / 8);

    mod._set_model_fn(modelIdx);
    // Small buffer — stiff segments can take far more steps than nout.
    // We always append the true endpoint below, so resampleUniform always
    // spans tStart→tEnd regardless of overflow.
    mod._init_output(Math.max(nout, 1000), n);

    const idid = mod._run_radau5(
      n,
      tStart,
      tEnd,
      yPtr,
      rparPtr,
      rtol,
      atol,
      0, // h_init = 0 → RADAU5 default
      500000, // nmax
    );

    if (idid < 0) {
      console.error(`[wasmWorker] RADAU5 IDID=${idid} at t=[${tStart},${tEnd}] n=${n}`);
      return { err: `RADAU5 failed with IDID=${idid} (t=[${tStart.toFixed(3)},${tEnd.toFixed(3)}])` };
    }

    const outN = mod._get_out_n();
    const tPtr = mod._get_out_t();
    const yOutPtr = mod._get_out_y();

    const time = Array.from(mod.HEAPF64.subarray(tPtr / 8, tPtr / 8 + outN));
    const yOut: number[][] = Array.from({ length: outN }, (_, step) =>
      Array.from(
        mod.HEAPF64.subarray(
          yOutPtr / 8 + step * n,
          yOutPtr / 8 + (step + 1) * n,
        ),
      ),
    );

    // Always read the true endpoint from the heap — the output buffer may not
    // reach tEnd if the solver took more steps than the buffer capacity.
    y.set(mod.HEAPF64.subarray(yPtr / 8, yPtr / 8 + n));

    // Append the true endpoint if the buffer stopped short of tEnd.
    const lastT = time.length > 0 ? time[time.length - 1] : -Infinity;
    if (time.length === 0 || Math.abs(lastT - tEnd) > 1e-10 * (1 + Math.abs(tEnd))) {
      time.push(tEnd);
      yOut.push(Array.from(y));
    }

    mod._free_output();
    return { time, y: yOut };
  } finally {
    mod._free(yPtr);
    mod._free(rparPtr);
  }
}

// ------------------------------------------------------------
// Worker message handler
// ------------------------------------------------------------
onmessage = async function (event: MessageEvent) {
  if (event.data.type === "__INIT__") {
    basePath = event.data.basePath || "";
    radauPromise = loadRadau(basePath);
    return;
  }

  const mod = await radauPromise;

  if (!mod) {
    const msg: SimulationResult = {
      time: [],
      values: [],
      requestId: event.data.requestId,
      err: {
        message: "RADAU5 WASM module not loaded",
        hints: [
          "static/wasm/radau5.js and radau5.wasm must be present (run npm run build:wasm)",
          "Check the browser console for fetch errors",
        ],
      },
    };
    postMessage(msg);
    return;
  }

  const {
    rhsWat,
    allDerivedFn,
    selectDerivedFn,
    initialValues,
    tEnd,
    pars,
    parNames,
    requestId,
    nTimePoints,
    protocol,
    calculateDerived,
  } = event.data as SimulationRequest;

  if (!rhsWat) {
    postMessage({
      time: [],
      values: [],
      requestId,
      err: { message: "rhsWat missing for RADAU5 worker", hints: [] },
    } as SimulationResult);
    return;
  }

  try {
    // Compile model WASM and register in function table
    const modelInstance = await compileModel(rhsWat, mod);
    const fcn = modelInstance.exports.fcn as (...args: unknown[]) => void;
    const modelIdx = mod.addFunction(fcn, "vidiii");

    const rtol = 1e-6;
    const atol = 1e-8;
    const n = initialValues.length;
    const y = new Float64Array(initialValues);
    const parsArr = new Float64Array(pars);

    let allTime: number[] = [];
    let allY: number[][] = [];

    if (protocol && protocol.length > 0) {
      let t = 0;
      for (const seg of protocol) {
        // Update any matching parameters from the segment
        if (parNames) {
          for (const [key, val] of Object.entries(seg)) {
            if (key === "t_end") continue;
            const idx = parNames.indexOf(key);
            if (idx >= 0) parsArr[idx] = val as number;
          }
        }
        const result = runSegment(
          mod,
          modelIdx,
          n,
          t,
          seg.t_end,
          y,
          parsArr,
          rtol,
          atol,
          nTimePoints,
        );
        if ("err" in result) throw new Error(result.err);
        // Resample each segment to nTimePoints uniform times, matching Python's t_eval per segment.
        // Skip first point of subsequent segments to avoid duplicates at boundaries.
        const { time: segTime, y: segY } = resampleUniform(result.time, result.y, nTimePoints);
        const skip = allTime.length > 0 ? 1 : 0;
        allTime = allTime.concat(segTime.slice(skip));
        allY = allY.concat(segY.slice(skip));
        t = seg.t_end;
      }
    } else {
      const result = runSegment(
        mod,
        modelIdx,
        n,
        0,
        tEnd,
        y,
        parsArr,
        rtol,
        atol,
        nTimePoints,
      );
      if ("err" in result) throw new Error(result.err);
      const resampled = resampleUniform(result.time, result.y, nTimePoints);
      allTime = resampled.time;
      allY = resampled.y;
    }

    mod.removeFunction(modelIdx);

    // Compute derived variables in JS
    let values: number[][] = allY;
    if (calculateDerived && allDerivedFn) {
      const allDerivedFnEval = eval(`(${allDerivedFn})`);
      const selectDerivedFnEval = eval(`(${selectDerivedFn})`);
      values = allY.map((yRow, i) => {
        const allDerived = allDerivedFnEval(allTime[i], yRow, pars);
        return [...yRow, ...selectDerivedFnEval(allDerived)];
      });
    }

    const message: SimulationResult = {
      time: allTime,
      values,
      requestId,
    };
    postMessage(message);
  } catch (e) {
    const err: SimulationError = {
      message: e instanceof Error ? e.message : String(e),
      hints: ["Check the browser console for details"],
    };
    postMessage({ time: [], values: [], requestId, err } as SimulationResult);
  }
};
