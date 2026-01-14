import { base } from '$app/paths';
import { loadPyodide, version } from "pyodide";

let pyodideReady = false;
let pyFuncs: any;

const indexURL = `https://cdn.jsdelivr.net/pyodide/v${version}/full/`;

async function setupPyodide() {
  try {
    const pyodide = await loadPyodide({ indexURL, packages: ['numpy', "scipy"] });

    const response = await fetch(`${base}/main.py`);
    const pythonScript = await response.text();
    pyFuncs = pyodide.runPython(pythonScript);
    console.log('Python Ready');
    pyodideReady = true;
    return pyodide
  } catch(e) {
    console.error('Python loading failed.');
    console.error(e);
  }
}

const pyodidePromise = setupPyodide();

onmessage = async function(e: MessageEvent){
  const pyodide = await pyodidePromise;

  if (!pyodideReady || !pyodide) {
    postMessage("pyodide_not_available");
    return;
  }

  const model = e.data.model;
  const y0 = e.data.initialValues;
  const tEnd = e.data.tEnd;
  const pars = e.data.pars;

  const [tPy, yPy] = pyFuncs.integrate(pyodide.runPython(model), y0, tEnd, pars);
  const time = tPy.toJs();
  const values = yPy.toJs();
  console.log("Integration finished")
  console.log(time[time.length - 1]);
  console.log(values[0]);

  postMessage({time: time, values: values})

}
