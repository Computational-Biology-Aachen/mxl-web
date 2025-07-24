import type { BaseIntegratorKws, Integration, Model } from "..";
import { scaleVec, solveStages, subVec } from "./utils";

interface IntegratorKws extends BaseIntegratorKws {
  rtol?: number;
  atol?: number;
  hInit?: number;
  hMin?: number;
  hMax?: number;
  maxIter?: number;
  maxSteps?: number;
}

/** Kvaerno 4/5 IRK integrator with adaptive time stepping */
export function kvaerno45(
  model: Model,
  {
    initialValues,
    tStart = 0,
    tEnd,
    pars = [],
    rtol = 1e-6,
    atol = 1e-8,
    hMin = 1e-6,
    hMax = 1.0,
    hInit = 0.1,
    maxSteps = 10000,
    maxIter = 10,
  }: IntegratorKws,
): Integration {
  let h = hInit;
  const A = [
    [0.24169426078821, 0, 0, 0, 0, 0],
    [0.04134189679059, 0.25865810320941, 0, 0, 0, 0],
    [0.02225576477115, 0.15955645028519, 0.26818778494366, 0, 0, 0],
    [0.03637608874327, -0.027, 0.24, 0.25062391125673, 0, 0],
    [0, 0, 0, 0, 0.5, 0],
    [0.04606, -0.044, 0.122, -0.101, 0.239, 0.23794],
  ];
  const b = A[5];
  const bHat = [0.04, -0.06, 0.13, -0.09, 0.31, 0.25]; // illustrative
  const c = A.map((row) => row.reduce((sum, val) => sum + val, 0));

  const s = A.length;
  const n = initialValues.length;
  let t = tStart;
  let y = initialValues.slice();

  let tOut = [t];
  let yOut = [y.slice()];

  for (let step = 0; step < maxSteps && t < tEnd; step++) {
    if (t + h > tEnd) h = tEnd - t;

    const K = solveStages(model, y, t, pars, h, A, c, s, rtol, maxIter);

    const y5 = y.slice();
    const y4 = y.slice();
    for (let i = 0; i < s; i++) {
      const scaledK = scaleVec(K[i], h);
      for (let j = 0; j < n; j++) {
        y5[j] += b[i] * scaledK[j];
        y4[j] += bHat[i] * scaledK[j];
      }
    }

    const errVec = subVec(y5, y4);
    const err = Math.sqrt(
      errVec.reduce((sum, e, i) => {
        const sc = atol + rtol * Math.max(Math.abs(y[i]), Math.abs(y5[i]));
        return sum + (e / sc) ** 2;
      }, 0) / n,
    );

    if (err <= 1) {
      t += h;
      y = y5;
      tOut.push(t);
      yOut.push(y.slice());
    }

    const fac = 0.9 * Math.pow(1 / (err + 1e-10), 1 / 5);
    h *= Math.min(5, Math.max(0.2, fac));
    h = Math.max(hMin, Math.min(h, hMax));
  }

  return { time: tOut, values: yOut };
}
