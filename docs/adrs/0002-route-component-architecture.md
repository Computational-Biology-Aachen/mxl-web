# ADR 0002: Route → Dashboard → Editor → WorkerManager Layering

**Status:** Implemented
**Scope:** `src/routes/models/<name>/+page.svelte`, `AnalysesDashboard`, `ModelEditor`,
`WorkerManager`

---

## 1. Context

Each model lives at its own route (`src/routes/models/<name>/+page.svelte`), which
defines `Model` and `Analyses` configs. The runtime layering is:

```
Route page (defines Model + Analyses config)
  → AnalysesDashboard (simulation controls, result tabs, parameter sweeps)
    → ModelEditor (variables/parameters/reactions/derived, inline editing)
      → WorkerManager (dispatches to jsWorker / pyWorker / wasmWorker)
        → mxlweb-core backends → Chart.js visualization
```

## 2. Decision

Keep a strict one-way layering: route pages own configuration only; `AnalysesDashboard`
owns simulation/analysis UI state; `ModelEditor` owns live model-editing UI state;
`WorkerManager` is the sole dispatch point to compute backends, hiding which backend
(JS/Pyodide/WASM) actually runs a given simulation from everything above it.

## 3. Rationale

This mirrors `mxlweb-core`'s own layering (builders → IR → backends) one level up the
stack: each layer has one job, and the backend choice is fully encapsulated behind
`WorkerManager` so that swapping/adding a backend (as happened historically — see
`mxlweb-core` ADR 0004's JS→Pyodide→WASM evolution) never needs changes to
`AnalysesDashboard` or `ModelEditor`. Per-model route configs stay declarative
(`Model`/`Analyses` data), so adding a new model is a matter of adding a route + config,
not writing new UI logic.

## 4. Consequences

- New analysis features belong in `AnalysesDashboard`; new editing affordances belong in
  `ModelEditor`; neither should reach past `WorkerManager` to talk to a specific backend
  directly.
- Adding a new model should not require touching `AnalysesDashboard`/`ModelEditor`/
  `WorkerManager` — if it does, that's a sign the model needs a capability those layers
  don't yet expose generically.
