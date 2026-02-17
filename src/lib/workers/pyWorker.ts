import type { WorkerMessage } from "$lib/stores/workerStore";
import { loadPyodide, version } from "pyodide";
export {}; // make it a module

let pyodideReady = false;
let pyFuncs: any;
let basePath = ""; // Will be set via initialization message
let pyodidePromise: Promise<any> | null = null;

const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

async function setupPyodide() {
  try {
    const pyodide = await loadPyodide({
      indexURL,
      packages: ["numpy", "scipy"],
    });

    const response = await fetch(`${basePath}/main.py`);
    const pythonScript = await response.text();
    pyFuncs = pyodide.runPython(pythonScript);
    // console.log("Python Ready");
    pyodideReady = true;
    return pyodide;
  } catch (e) {
    console.error("Python loading failed.");
    console.error(e);
  }
}

onmessage = async function (event: MessageEvent) {
  if (event.data.type === "__INIT__") {
    basePath = event.data.basePath || "";
    pyodidePromise = setupPyodide();
    return;
  }
  const pyodide = await pyodidePromise;

  if (!pyodideReady || !pyodide) {
    postMessage("pyodide_not_available");
    return;
  }

  const model = event.data.model;
  const y0 = event.data.initialValues;
  const tEnd = event.data.tEnd;
  const pars = event.data.pars;
  const requestId = event.data.requestId;
  const nTimePoints = 500;
  const method = "LSODA";

  const [tPy, yPy, errPy] = pyFuncs.integrate(
    pyodide.runPython(model),
    y0,
    tEnd,
    pars,
    nTimePoints,
    method,
  );
  const err: string | undefined = errPy?.toJs();
  const time: number[] = tPy.toJs();
  const values: number[][] = yPy.toJs();

  const message: WorkerMessage = {
    time: time,
    values: values,
    requestId: requestId,
    message: err,
  };
  postMessage(message);
};
