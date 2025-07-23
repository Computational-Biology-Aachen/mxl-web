/**
 * Runge-Kutta 4(5) Dormand-Prince solver
 */

import type { Integration, rHS } from "..";


interface IntegratorKws {
    initialValues: Array<number>,
    tStart?: number,
    tEnd: number,
    rtol?: number;
    atol?: number;
    hInit?: number;
    hMin?: number;
    hMax?: number;
    maxSteps?: number;
    pars: number[]
}

export function rk45(
    rhs: rHS,
    { initialValues,
        tEnd,
        pars = [],
        tStart = 0,
        rtol = 1e-6,
        atol = 1e-6,
        // hMin = 1e-6,
        // hMax = 1.0,
        hInit = 0.01,
        maxSteps = 10000 }: IntegratorKws
): Integration {
    console.log(`t_end = ${tEnd}`)
    let h = hInit;

    const nVars = initialValues.length;
    let t = tStart;
    let y = initialValues.slice();

    const tValues = [t];
    const yValues = [y.slice()];

    // Dormand-Prince coefficients
    const c = [0, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
    const a = [
        [],
        [1 / 5],
        [3 / 40, 9 / 40],
        [44 / 45, -56 / 15, 32 / 9],
        [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
        [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
        [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
    ];
    const b = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0];
    const bHat = [
        5179 / 57600,
        0,
        7571 / 16695,
        393 / 640,
        -92097 / 339200,
        187 / 2100,
        1 / 40
    ];

    let step = 0;
    for (; step < maxSteps && t < tEnd; step++) {
        if (t + h > tEnd) h = tEnd - t;

        // Compute Runge-Kutta stages
        const k: number[][] = Array(7);
        for (let i = 0; i < 7; i++) {
            const yi = y.slice();
            for (let j = 0; j < i; j++) {
                const aj = a[i][j] ?? 0;
                for (let l = 0; l < nVars; l++) {
                    yi[l] += h * aj * k[j][l];
                }
            }
            k[i] = rhs(t + c[i] * h, yi, pars);
        }

        // y5: 5th order estimate, y4: 4th order estimate
        const y5 = y.slice();
        const y4 = y.slice();
        for (let l = 0; l < nVars; l++) {
            for (let i = 0; i < 7; i++) {
                y5[l] += h * b[i] * k[i][l];
                y4[l] += h * bHat[i] * k[i][l];
            }
        }

        // Estimate error
        let errNorm = 0;
        for (let l = 0; l < nVars; l++) {
            const sc = atol + rtol * Math.max(Math.abs(y[l]), Math.abs(y5[l]));
            const e = y5[l] - y4[l];
            errNorm += (e / sc) ** 2;
        }
        errNorm = Math.sqrt(errNorm / nVars);

        // Accept step if error is small enough
        if (errNorm <= 1) {
            t += h;
            y = y5;
            if (step % 10 === 0) {
                tValues.push(t);
                yValues.push(y.slice());
            };
        }

        // Adapt step size
        h = h * Math.pow(1 / errNorm, (1 / (5 + 1)))

        // Estimate error
        // let errNorm = 0;
        // for (let l = 0; l < nVars; l++) {
        //     const sc = atol + rtol * Math.max(Math.abs(y[l]), Math.abs(y5[l]));
        //     const e = y5[l] - y4[l];
        //     errNorm += (e / sc) ** 2;
        // }
        // errNorm = Math.sqrt(errNorm / nVars);

        // Adapt step size
        // const safety = 0.9;
        // const minFactor = 0.1;
        // const maxFactor = 5.0;
        // const factor = Math.min(
        //     maxFactor,
        //     Math.max(minFactor, safety * Math.pow(1 / (errNorm || 1e-10), 0.2))
        // );
        // h = Math.min(hMax, Math.max(hMin, h * factor));
    }
    console.log(`Took ${step} steps`)

    return { time: tValues, values: yValues };
}
