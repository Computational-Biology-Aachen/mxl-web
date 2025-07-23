import type { Integration, rHS } from "..";


interface KvaernoOptions {
    tFinal: number;
    pars: number[];
    rtol?: number;
    atol?: number;
    hInit?: number;
    hMin?: number;
    hMax?: number;
    maxIter?: number;
    maxSteps?: number;
}

/** Utility functions */
function subVec(a: number[], b: number[]): number[] {
    return a.map((val, i) => val - b[i]);
}
function scaleVec(v: number[], s: number): number[] {
    return v.map(val => val * s);
}
function maxNorm(v: number[]): number {
    return Math.max(...v.map(Math.abs));
}

/** Solve Ax = b using naive Gauss elimination */
function solveLinear(A: number[][], b: number[]): number[] {
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

    return M.map(row => row[n]);
}

/** Jacobian approximation */
function approxJacobian(model: rHS, t: number, y: number[], pars: number[], eps = 1e-8): number[][] {
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
function solveStages(
    model: rHS,
    y: number[],
    t: number,
    pars: number[],
    h: number,
    A: number[][],
    c: number[],
    stages: number,
    tol: number,
    maxIter: number
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

/** Kvaerno 4/5 IRK integrator with adaptive time stepping */
export function kvaerno45(
    model: rHS,
    y0: number[],
    t0: number,
    opts: KvaernoOptions
): Integration {
    const rtol = opts.rtol ?? 1e-6;
    const atol = opts.atol ?? 1e-8;
    const hMin = opts.hMin ?? 1e-6;
    const hMax = opts.hMax ?? 1.0;
    const pars = opts.pars ?? [];
    let h = opts.hInit ?? 0.1;
    const maxSteps = opts.maxSteps ?? 10000;
    const maxIter = opts.maxIter ?? 10;

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
    const c = A.map(row => row.reduce((sum, val) => sum + val, 0));

    const s = A.length;
    const n = y0.length;
    let t = t0;
    let y = y0.slice();

    let tOut = [t];
    let yOut = [y.slice()];

    for (let step = 0; step < maxSteps && t < opts.tFinal; step++) {
        if (t + h > opts.tFinal) h = opts.tFinal - t;

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
            }, 0) / n
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
