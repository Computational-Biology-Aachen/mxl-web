// keep this a module so TypeScript treats it as a worker module
import type { Model } from "$lib/integrators";
import { euler } from "$lib/integrators/explicit";
export { };






onmessage = (event: MessageEvent) => {

    console.log("Starting js integration")
    console.log(`Pars: ${event.data.pars}`)
    let tStart = Date.now();
    let model: Model = (t: number, y: number[], pars: number[]) => y;

    // console.log(event.data.model);
    eval(`model = ${event.data.model}`);
    console.log(model)

    const outcome = euler(model, {
        initialValues: event.data.initialValues,
        tStart: 0,
        tEnd: event.data.tEnd,
        stepSize: 0.01,
        pars: event.data.pars,
    });

    console.log(`Javascript Integration took ${Date.now() - tStart} ms`);
    postMessage(outcome);
}
