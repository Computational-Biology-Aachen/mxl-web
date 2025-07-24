/**
 * Runge-Kutta 2nd order solver (Heun's method)
 */

import type { BaseIntegratorKws, Integration, Model } from "..";

interface IntegratorKws extends BaseIntegratorKws {
  h?: number;
  stepSize?: number;
  maxSteps?: number;
}

export function rk2(
  model: Model,
  {
    initialValues,
    tEnd,
    pars = [],
    tStart = 0,
    h = 0.01,
    maxSteps = 10000,
  }: IntegratorKws,
): Integration {
  console.log(`t_end = ${tEnd}`);

  const nVars = initialValues.length;
  let t = tStart;
  let y = initialValues.slice();

  const tValues = [t];
  const yValues = [y.slice()];

  let step = 0;
  for (; step < maxSteps && t < tEnd; step++) {
    if (t + h > tEnd) h = tEnd - t;

    // Heun's method (RK2)
    // k1 = f(t, y)
    const k1 = model(t, y, pars);

    // k2 = f(t + h, y + h*k1)
    const y1 = y.slice();
    for (let i = 0; i < nVars; i++) {
      y1[i] += h * k1[i];
    }
    const k2 = model(t + h, y1, pars);

    // y_{n+1} = y_n + h/2 * (k1 + k2)
    for (let i = 0; i < nVars; i++) {
      y[i] += (h / 2) * (k1[i] + k2[i]);
    }

    t += h;

    // Store every step for RK2 since it's a fixed step method
    tValues.push(t);
    yValues.push(y.slice());
  }

  console.log(`Took ${step} steps`);

  return { time: tValues, values: yValues };
}
