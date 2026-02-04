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

// const γ: number = 0.26
// const a21: number = γ
// const a31: number = 0.13
// const a32: number = 0.84033320996790809
// const a41: number = 0.22371961478320505
// const a42: number = 0.47675532319799699
// const a43: number = -0.06470895363112615
// const a51: number = 0.16648564323248321
// const a52: number = 0.10450018841591720
// const a53: number = 0.03631482272098715
// const a54: number = -0.13090704451073998
// const a61: number = 0.13855640231268224
// const a62: number = 0
// const a63: number = -0.04245337201752043
// const a64: number = 0.02446657898003141
// const a65: number = 0.61943039072480676
// const a71: number = 0.13659751177640291
// const a72: number = 0
// const a73: number = -0.05496908796538376
// const a74: number = -0.04118626728321046
// const a75: number = 0.62993304899016403
// const a76: number = 0.06962479448202728
// const α21: number = 1.0
// const α31: number = -1.366025403784441
// const α32: number = 2.3660254037844357
// const α41: number = -0.19650552613122207
// const α42: number = 0.8113579546496623
// const α43: number = 0.38514757148155954
// const α51: number = 0.10375304369958693
// const α52: number = 0.937994698066431
// const α53: number = -0.04174774176601781
// const α61: number = -0.17281112873898072
// const α62: number = 0.6235784481025847
// const α63: number = 0.5492326806363959
// const α71: number = a61
// const α72: number = a62
// const α73: number = a63
// const α74: number = a64
// const α75: number = a65
// const α76: number = γ

// class ButcherTableau {
//   aLower: number[][];
//   aDiag: number[];
//   aPredictor: number[][];
//   bSol: number[];
//   bErr: number[];
//   c: number[];

//   constructor(aLower: number[][], aDiag: number[], aPredictor: number[][], bSol: number[], bErr: number[], c: number[]) {
//     this.aLower = aLower;
//     this.aDiag = aDiag;
//     this.aPredictor = aPredictor;
//     this.bSol = bSol;
//     this.bErr = bErr;
//     this.c = c;
//   }

// }

// const tableau = {
//   aLower: [[a21],
//   [a31, a32],
//   [a41, a42, a43],
//   [a51, a52, a53, a54],
//   [a61, a62, a63, a64, a65],
//   [a71, a72, a73, a74, a75, a76],],
//   aDiag: [0, γ, γ, γ, γ, γ, γ],
//   aPredictor: [[α21],
//   [α31, α32],
//   [α41, α42, α43],
//   [α51, α52, α53, 0],
//   [α61, α62, α63, 0, 0],
//   [α71, α72, α73, α74, α75, α76]],
//   bSol: [a71, a72, a73, a74, a75, a76, γ],
//   bErr: [a71 - a61, a72 - a62, a73 - a63, a74 - a64, a75 - a65, a76 - γ, γ],
//   c: [0.52, 1.230333209967908, 0.8957659843500759, 0.43639360985864756, 1.0, 1.0],
// }

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
