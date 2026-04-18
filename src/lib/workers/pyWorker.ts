import type { WorkerMessage } from "$lib/stores/workerStore";
import { loadPyodide, version } from "pyodide";
export {}; // make it a module

let pyodideReady = false;
let pyFuncs: any;
let basePath = ""; // Will be set via initialization message
let pyodidePromise: Promise<any> | null = null;

const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

export interface SimulationRequest {
  // Required; don't change!
  requestId: string;
  model: string;
  derived: string;
  initialValues: number[];
  tEnd: number;
  nTimePoints: number;
  pars: number[];
  method: string;
  calculateDerived: boolean;
  // Optional
  type?: string;
  protocol?: { t_end: number; PFD: number }[];
}

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

  const {
    model,
    derived,
    initialValues: y0,
    tEnd,
    pars,
    requestId,
    nTimePoints,
    method,
    protocol,
    calculateDerived,
  } = event.data as SimulationRequest;

  let tPy: any, yPy: any, errPy: any;
  if (protocol) {
    [tPy, yPy, errPy] = pyFuncs.integrate_protocol(
      pyodide.runPython(model),
      pyodide.runPython(derived),
      y0,
      pars,
      nTimePoints,
      method,
      pyodide.toPy(protocol),
      calculateDerived,
    );
  } else {
    [tPy, yPy, errPy] = pyFuncs.integrate(
      pyodide.runPython(model),
      pyodide.runPython(derived),
      y0,
      tEnd,
      pars,
      nTimePoints,
      method,
      calculateDerived,
    );
  }
  const err: string | undefined = errPy;
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
