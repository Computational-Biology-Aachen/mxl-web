import type {
  SimulationError,
  SimulationRequest,
  SimulationResult,
} from "$lib/stores/workerStore";
import { euler } from "$lib/integrators/explicit/euler";
import { rk2 } from "$lib/integrators/explicit/rk2";
import { rk45 } from "$lib/integrators/explicit/rk45";
import { kvaerno45 } from "$lib/integrators/implicit/kvaerno45";
import type { Integration, Model } from "$lib/integrators";
export {};

function pickIntegrator(method: string) {
  switch (method.toLowerCase()) {
    case "euler":
      return "euler";
    case "rk2":
    case "heun":
      return "rk2";
    case "kvaerno45":
    case "kvaerno":
    case "backwardeuler":
      return "kvaerno45";
    default:
      return "rk45";
  }
}

function downsample(
  time: number[],
  values: number[][],
  nPoints: number,
): { time: number[]; values: number[][] } {
  if (time.length <= nPoints) return { time, values };
  const stride = Math.floor(time.length / nPoints);
  const tOut: number[] = [];
  const vOut: number[][] = [];
  for (let i = 0; i < time.length; i += stride) {
    tOut.push(time[i]);
    vOut.push(values[i]);
  }
  if (tOut[tOut.length - 1] !== time[time.length - 1]) {
    tOut.push(time[time.length - 1]);
    vOut.push(values[values.length - 1]);
  }
  return { time: tOut, values: vOut };
}

function integrate(
  method: string,
  model: Model,
  y0: number[],
  tStart: number,
  tEnd: number,
  pars: number[],
): Integration {
  const stepSize = Math.max((tEnd - tStart) / 1000, 1e-6);
  const kws = { initialValues: y0, tStart, tEnd, pars };
  switch (pickIntegrator(method)) {
    case "euler":
      return euler(model, { ...kws, stepSize });
    case "rk2":
      return rk2(model, { ...kws, h: stepSize });
    case "kvaerno45":
      return kvaerno45(model, kws);
    default:
      return rk45(model, kws);
  }
}

onmessage = function (event: MessageEvent) {
  if (event.data.type === "__INIT__") return;

  const {
    rhsFn,
    allDerivedFn,
    selectDerivedFn,
    initialValues,
    tEnd,
    pars,
    parNames,
    requestId,
    nTimePoints,
    method,
    protocol,
    calculateDerived,
  } = event.data as SimulationRequest;

  try {
    let model: Model;
    try {
      // eslint-disable-next-line no-new-func
      model = new Function(`return (${rhsFn})`)() as Model;
    } catch (e) {
      postMessage({
        time: [],
        values: [],
        requestId,
        err: {
          message: `Failed to compile model function: ${e}`,
          hints: ["Ensure rhsFn is a valid JavaScript function expression"],
        },
      } as SimulationResult);
      return;
    }

    const y = [...initialValues];
    let allTime: number[] = [];
    let allValues: number[][] = [];

    if (protocol && protocol.length > 0) {
      const runPars = pars.slice();
      let t = 0;
      for (const seg of protocol) {
        // Update any matching parameters from the segment
        if (parNames) {
          for (const [key, val] of Object.entries(seg)) {
            if (key === "t_end") continue;
            const idx = parNames.indexOf(key);
            if (idx >= 0) runPars[idx] = val as number;
          }
        }
        const result = integrate(method, model, y, t, seg.t_end, runPars);
        if (result.err) throw new Error(result.err);
        allTime = allTime.concat(result.time);
        allValues = allValues.concat(result.values);
        y.splice(0, y.length, ...result.values[result.values.length - 1]);
        t = seg.t_end;
      }
    } else {
      const result = integrate(method, model, y, 0, tEnd, pars);
      if (result.err) throw new Error(result.err);
      allTime = result.time;
      allValues = result.values;
    }

    const resampled = downsample(allTime, allValues, nTimePoints);

    let values = resampled.values;
    if (calculateDerived && allDerivedFn) {
      try {
        // eslint-disable-next-line no-new-func
        const allDerivedFnEval = new Function(`return (${allDerivedFn})`)() as (
          t: number,
          y: number[],
          pars: number[],
        ) => number[];
        // eslint-disable-next-line no-new-func
        const selectDerivedFnEval = new Function(
          `return (${selectDerivedFn})`,
        )() as (all: number[]) => number[];
        values = resampled.values.map((yRow, i) => {
          const allDerived = allDerivedFnEval(resampled.time[i], yRow, pars);
          return [...yRow, ...selectDerivedFnEval(allDerived)];
        });
      } catch {
        // Fall back to raw state variables if derived evaluation fails
      }
    }

    postMessage({
      time: resampled.time,
      values,
      requestId,
    } as SimulationResult);
  } catch (e) {
    const err: SimulationError = {
      message: e instanceof Error ? e.message : String(e),
      hints: ["Check the browser console for details"],
    };
    postMessage({ time: [], values: [], requestId, err } as SimulationResult);
  }
};
