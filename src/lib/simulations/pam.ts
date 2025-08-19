import type { BaseIntegratorKws, Integration, Integrator, Model } from "$lib/integrators";

export type Protocol = { tEnd: number, pars: number[] }[]

export function pam<Options extends BaseIntegratorKws>(
    model: Model,
    protocol: Protocol,
    integrator: Integrator,
    options: Options
): Integration {
    let tStart = 0;
    let initialValues = options.initialValues;
    let results: Integration[] = protocol.map((step) => {
        let res = integrator(model, {
            ...options,
            tStart: tStart,
            tEnd: step.tEnd,
            pars: step.pars,
            initialValues: initialValues
        });
        tStart = step.tEnd
        initialValues = res.values[res.values.length - 1]
        return res;
    })
    return {
        time: results.flatMap(r => r.time),
        values: results.flatMap(r => r.values),
        err: results.find(r => r.err)?.err
    }
}
