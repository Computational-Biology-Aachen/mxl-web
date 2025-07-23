// Euler's method, first order

import type { Integration, rHS } from "..";

interface IntegratorKws {
    initialValues: Array<number>,
    tStart?: number,
    tEnd: number,
    stepSize: number,
    pars: number[]
}

export function euler(
    rhs: rHS,
    { initialValues, tStart = 0, tEnd, stepSize, pars = [] }: IntegratorKws): Integration {
    const n = Math.ceil((tEnd - tStart) / stepSize) + 1
    let values: Array<Array<number>> = Array(n)
    let time: Array<number> = Array.from(Array(n), (_, k) => k * stepSize + tStart)

    values[0] = initialValues
    for (let i = 0; i < n; i++) {
        values[i + 1] = values[i].map((val, idx) => val + rhs(time[i], values[i], pars)[idx] * stepSize)
    }
    return { time, values }
}
