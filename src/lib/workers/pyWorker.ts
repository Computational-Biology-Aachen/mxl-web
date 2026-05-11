import type {
  SimulationError,
  SimulationRequest,
  SimulationResult,
} from "$lib/stores/workerStore";
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
    const msg: SimulationResult = {
      time: [],
      values: [],
      requestId: event.data.requestId,
      err: {
        message: "Python runtime not available",
        hints: [
          "The Pyodide runtime (Python-in-browser) failed to load",
          "Check your internet connection — Pyodide packages are fetched from a CDN",
          "Open the browser console (F12) for details",
          "Hard-refresh the page (Ctrl+Shift+R / Cmd+Shift+R) and try again",
        ],
        dxdt: undefined,
        args: undefined,
      },
    };
    postMessage(msg);
    return;
  }

  const {
    rhsFn,
    allDerivedFn,
    selectDerivedFn,
    initialValues,
    rhsNames,
    allDerivedNames,
    selectDerivedNames,
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
      pyodide.runPython(rhsFn),
      pyodide.runPython(allDerivedFn),
      pyodide.runPython(selectDerivedFn),
      initialValues,
      pars,
      nTimePoints,
      method,
      pyodide.toPy(protocol),
      calculateDerived,
      rhsNames,
      allDerivedNames,
      selectDerivedNames,
    );
  } else {
    [tPy, yPy, errPy] = pyFuncs.integrate(
      pyodide.runPython(rhsFn),
      pyodide.runPython(allDerivedFn),
      pyodide.runPython(selectDerivedFn),
      initialValues,
      tEnd,
      pars,
      nTimePoints,
      method,
      calculateDerived,
      rhsNames,
      allDerivedNames,
      selectDerivedNames,
    );
  }
  const time: number[] = tPy.toJs();
  const values: number[][] = yPy.toJs();

  let err: SimulationError | undefined;
  if (errPy) {
    err = JSON.parse(errPy as string);
  }

  const message: SimulationResult = {
    time,
    values,
    requestId,
    err,
  };
  postMessage(message);
};
