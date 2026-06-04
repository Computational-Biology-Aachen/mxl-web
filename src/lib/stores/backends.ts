import { browser } from "$app/environment";
import type { KineticModelBuilder } from "@computational-biology-aachen/mxlweb-core";
import { WorkerPool } from "./workerPool";

import jsWorkerUrlString from "@computational-biology-aachen/mxlweb-core/backends/js/jsWorker.ts?worker&url";
import pyWorkerUrlString from "@computational-biology-aachen/mxlweb-core/backends/py/pyWorker.ts?worker&url";
import wasmWorkerUrlString from "@computational-biology-aachen/mxlweb-core/backends/wasm/wasmWorker.ts?worker&url";

const jsWorkerUrl = browser
  ? new URL(jsWorkerUrlString, import.meta.url)
  : new URL("http://localhost");
const pyWorkerUrl = browser
  ? new URL(pyWorkerUrlString, import.meta.url)
  : new URL("http://localhost");
const wasmWorkerUrl = browser
  ? new URL(wasmWorkerUrlString, import.meta.url)
  : new URL("http://localhost");

function once<T>(factory: () => T): () => T {
  let value: T | null = null;
  return () => {
    if (value === null) value = factory();
    return value;
  };
}

const getWasmPool = once(() => new WorkerPool(wasmWorkerUrl, 1));
const getPyPool = once(() => new WorkerPool(pyWorkerUrl));
const getJsPool = once(() => new WorkerPool(jsWorkerUrl));

type BuildOpts = {
  userParameters?: string[];
  derivedSelection?: string[];
};

type BackendRequest = {
  rhsFn?: string;
  rhsWat?: string;
  allDerivedFn: string;
  selectDerivedFn: string;
  pars: number[];
  parNames?: string[];
  method: string;
};

export interface Backend {
  id: string;
  label: string;
  method: string;
  getPool(): WorkerPool;
  buildRequest(model: KineticModelBuilder, opts: BuildOpts): BackendRequest;
}

function makePyBackend(method: string, label: string): Backend {
  return {
    id: `py-${method.toLowerCase()}`,
    label: `Python / ${label}`,
    method,
    getPool: getPyPool,
    buildRequest(model, { userParameters = [], derivedSelection } = {}) {
      const built = model.buildPython(userParameters, derivedSelection);
      return {
        rhsFn: `${built}\nmodel`,
        allDerivedFn: `${built}\nall_derived`,
        selectDerivedFn: `${built}\nderived`,
        pars: [],
        method,
      };
    },
  };
}

function makeJsBackend(method: string, label: string): Backend {
  return {
    id: `js-${method.toLowerCase()}`,
    label: `JS / ${label}`,
    method,
    getPool: getJsPool,
    buildRequest(model, { derivedSelection } = {}) {
      const { allDerived, selectDerived } =
        model.buildJsDerived(derivedSelection);
      return {
        rhsFn: model.buildJs(),
        allDerivedFn: allDerived,
        selectDerivedFn: selectDerived,
        pars: model.resolveParameters(),
        parNames: model.getParameterNames(),
        method,
      };
    },
  };
}

function makeWasmBackend(method: string, label: string): Backend {
  return {
    id: `wasm-${method}`,
    label: `WASM / ${label}`,
    method,
    getPool: getWasmPool,
    buildRequest(model, { derivedSelection } = {}) {
      const { allDerived, selectDerived } =
        model.buildJsDerived(derivedSelection);
      return {
        rhsWat: model.buildWat(),
        allDerivedFn: allDerived,
        selectDerivedFn: selectDerived,
        pars: model.resolveParameters(),
        parNames: model.getParameterNames(),
        method,
      };
    },
  };
}

export const wasmRadau5 = makeWasmBackend("radau5", "RADAU5");
export const wasmDop853 = makeWasmBackend("dop853", "DOP853");
export const wasmDopri5 = makeWasmBackend("dopri5", "DOPRI5");

export const pyRadau = makePyBackend("Radau", "Radau");
export const pyLSODA = makePyBackend("LSODA", "LSODA");
export const pyRK45 = makePyBackend("RK45", "RK45");
export const pyBDF = makePyBackend("BDF", "BDF");

export const jsRK45 = makeJsBackend("rk45", "RK45");
export const jsKvaerno45 = makeJsBackend("kvaerno45", "Kvaerno45");
export const jsRK2 = makeJsBackend("rk2", "RK2 (Heun)");
export const jsEuler = makeJsBackend("euler", "Euler");

export const allBackends: Backend[] = [
  wasmRadau5,
  wasmDop853,
  wasmDopri5,
  pyRadau,
  pyLSODA,
  pyRK45,
  pyBDF,
  jsRK45,
  jsKvaerno45,
  jsRK2,
  jsEuler,
];

export const backends = {
  wasmRadau5,
  wasmDop853,
  wasmDopri5,
  pyRadau,
  pyLSODA,
  pyRK45,
  pyBDF,
  jsRK45,
  jsKvaerno45,
  jsRK2,
  jsEuler,
};
