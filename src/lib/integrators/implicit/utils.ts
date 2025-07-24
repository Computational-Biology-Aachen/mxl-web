import type { Model } from "..";

/** Utility functions */
export function subVec(a: number[], b: number[]): number[] {
  return a.map((val, i) => val - b[i]);
}
export function scaleVec(v: number[], s: number): number[] {
  return v.map((val) => val * s);
}
export function maxNorm(v: number[]): number {
  return Math.max(...v.map(Math.abs));
}

/** Solve Ax = b using naive Gauss elimination */
export function solveLinear(A: number[][], b: number[]): number[] {
  const n = b.length;
  const M = A.map((row, i) => row.concat(b[i]));

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    const pivot = M[i][i];
    if (Math.abs(pivot) < 1e-12) throw new Error("Singular matrix");

    for (let j = i; j <= n; j++) M[i][j] /= pivot;

    for (let k = 0; k < n; k++) {
      if (k === i) continue;
      const factor = M[k][i];
      for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
    }
  }

  return M.map((row) => row[n]);
}

/** Jacobian approximation */
export function approxJacobian(
  model: Model,
  t: number,
  y: number[],
  pars: number[],
  eps = 1e-8,
): number[][] {
  const n = y.length;
  const J: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const f0 = model(t, y, pars);

  for (let j = 0; j < n; j++) {
    const yj = y[j];
    const h = eps * Math.max(1, Math.abs(yj));
    y[j] += h;
    const f1 = model(t, y, pars);
    y[j] = yj;

    for (let i = 0; i < n; i++) {
      J[i][j] = (f1[i] - f0[i]) / h;
    }
  }

  return J;
}

/** Newton-Raphson solver for IRK stages */
export function solveStages(
  model: Model,
  y: number[],
  t: number,
  pars: number[],
  h: number,
  A: number[][],
  c: number[],
  stages: number,
  tol: number,
  maxIter: number,
): number[][] {
  const n = y.length;
  let K = Array.from({ length: stages }, () => Array(n).fill(0));

  for (let iter = 0; iter < maxIter; iter++) {
    let maxErr = 0;

    for (let i = 0; i < stages; i++) {
      const Ytemp = y.slice();
      for (let j = 0; j < stages; j++) {
        for (let k = 0; k < n; k++) {
          Ytemp[k] += h * A[i][j] * K[j][k];
        }
      }

      const fEval = model(t + c[i] * h, Ytemp, pars);
      const res = subVec(K[i], fEval);
      maxErr = Math.max(maxErr, maxNorm(res));

      const J = approxJacobian(model, t + c[i] * h, Ytemp, pars);
      const Aij = A[i][i];
      for (let r = 0; r < n; r++) {
        for (let c2 = 0; c2 < n; c2++) {
          J[r][c2] *= -h * Aij;
        }
        J[r][r] += 1;
      }

      const dK = solveLinear(J, res);
      for (let k = 0; k < n; k++) {
        K[i][k] -= dK[k];
      }
    }

    if (maxErr < tol) break;
    if (iter === maxIter - 1) console.warn("Newton-Raphson did not converge");
  }

  return K;
}
