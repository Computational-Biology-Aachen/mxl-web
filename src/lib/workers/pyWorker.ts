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
  // Handle initialization message
  if (event.data.type === "__INIT__") {
    // console.log("Setting up Python");
    basePath = event.data.basePath || "";
    pyodidePromise = setupPyodide();
    return;
  }

  let tStart = Date.now();
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

  // console.log("Starting py integration");
  // console.log(`Pars: ${pars}`);

  const [tPy, yPy] = pyFuncs.integrate(
    pyodide.runPython(model),
    y0,
    tEnd,
    pars,
  );
  const time = tPy.toJs();
  const values = yPy.toJs();

  // console.log(`Python integration took ${Date.now() - tStart} ms`);
  postMessage({ time: time, values: values, requestId: requestId });
};
