import type { Model } from "$lib/integrators";
import { euler } from "$lib/integrators/explicit";
export { }; // keep this a module so TypeScript treats it as a worker module

onmessage = (event: MessageEvent) => {
    // Handle initialization message
    if (event.data.type === '__INIT__') {
        return;
    }

    let tStart = Date.now();
    let model: Model = (t: number, y: number[], pars: number[]) => y;


    const modelString = event.data.model;
    const y0 = event.data.initialValues;
    const tEnd = event.data.tEnd;
    const pars = event.data.pars;

    console.log("Starting js integration")
    console.log(`Pars: ${pars}`)
    eval(`model = ${modelString}`);
    const outcome = euler(model, {
        initialValues: y0,
        tStart: 0,
        tEnd: tEnd,
        stepSize: 0.01,
        pars: pars,
    });

    console.log(`Javascript integration took ${Date.now() - tStart} ms`);
    postMessage(outcome);
}
