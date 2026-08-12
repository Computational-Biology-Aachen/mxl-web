# ADR 0004: Fit Model to Uploaded Data

**Status:** Proposed
**Scope:** `AnalysesDashboard`, `ModelEditor` (this repo); `src-c/`, `build:wasm`,
`src/backends/wasm/` (sibling `mxlweb-core` repo)

---

## 1. Context

Users want to fit a mxlweb model's parameters against their own measured data (CSV/TSV
upload), for both raw state variables and derived/observable quantities (e.g. a measured
flux computed from states, not a state itself).

`mxlweb-core`'s WASM backend (`wasmWorker.ts`) already JIT-compiles a model's RHS from
WAT to a real `WebAssembly.Instance` sharing linear memory with the Emscripten-compiled
Radau5/DOP853/DOPRI5 module, registered into its function table via `addFunction` — so
the integrator already calls the user's model as a native in-WASM function pointer, with
zero JS marshalling per integration step (`buildModelWat` in `wat-codegen.ts`).

`scipy.optimize.curve_fit`/`least_squares(method='lm')` — the standard tool for this
problem — is a thin wrapper over MINPACK's `lmdif`/`lmder` (Fortran, same vintage/scope
as Hairer's Radau5, which this project already vendors via Fortran→C→Emscripten).
`cminpack` (`devernay/cminpack`) is a maintained, dependency-free C port of the same
routines. The `lmdif` (derivative-free) variant fits this project directly: no autodiff
exists in the mathml AST, and `lmdif` internally does forward-difference Jacobians.

`mxlweb-core` is a sibling git submodule (`pkg/mxlweb-core`), not just a vendored npm
package — its `src-c/` and `build:wasm` script are directly editable, so this ADR's
decisions span both repos.

## 2. Decision

### 2.1 Fitting engine: vendor `cminpack`'s `lmdif` into the existing `emcc` build

Add the minimal `lmdif` dependency set (`lmdif.c`, `lmpar.c`, `qrfac.c`, `qrsolv.c`,
`enorm.c`, `fdjac2.c`, `dpmpar.c` — ~1900 LOC, zero external deps) to `mxlweb-core`'s
`src-c/` and link them into the same `emcc` invocation that already produces
`radau5.wasm`. The fit's inner loop calls the already-linked integrator as a plain C
function call — no JS↔WASM boundary crossing per trial parameter set, which is where
the actual cost of a fit lives (hundreds of integrator calls per fit: iterations ×
(params + 1) for each finite-difference Jacobian).

### 2.2 Fit targets: state variables _and_ derived quantities, entirely in WASM

`wat-codegen.ts`'s `expr.toWat(ctx)` is already generic per-AST-node codegen;
`buildModelWat` is a thin wrapper around it for the RHS case. Add a parallel
`buildDerivedWat()` that reuses the same codegen + intermediates/topological-order
pattern to compute the specific derived quantities the user maps as fit targets (not the
full derived-variable set — only what's needed for the mapped columns). The fit loop
registers **two** function-table entries before starting (RHS + derived-eval), both
called from the C-side `fcn` callback. This keeps derived-quantity fitting inside WASM
without a new codegen backend or a per-residual JS round-trip.

### 2.3 Data upload & column mapping

`papaparse` (~7.5 kB gzip) parses the uploaded CSV/TSV, reusing the existing file-input
pattern in `AnalysesDashboard.svelte` (currently used for SBML upload). Columns are
auto-matched to variable/derived-quantity names case-insensitively, with a manual
dropdown per column to override. One column is designated the time axis (auto-suggested
for `t`/`time` headers). Unmapped columns are ignored — tolerates metadata columns
(units, replicate IDs) in real-world exports without erroring.

### 2.4 Parameter selection, initial guess, bounds

A "fit" checkbox column is added to `ModelEditor`'s parameter table; unchecked
parameters stay fixed at their current value. The current table value doubles as the
initial guess. Since `lmdif` is unconstrained and mxlweb's model libraries
(mxlbricks/mxlmodels) are kinetic/biological — virtually every fittable parameter (rate
constants, Vmax, Km) must stay positive — parameters fit in **log-space** by default
(`fcn` exponentiates before calling the model), guaranteeing positivity for free. A
per-parameter "fit in linear space" toggle is the escape hatch for parameters that are
legitimately signed or zero.

### 2.5 Loss function: auto-normalized residuals

Each target's residuals are normalized by that target's own data scale (`max(|data_i|)`
over the uploaded column) before summing: `residual_ij = (model_ij - data_ij) / scale_i`.
This prevents a large-scale target (e.g. a concentration in the 100s) from drowning out
a small-scale one (e.g. a flux in the 0.001s) without requiring users to hand-tune
weights. No manual per-target weight input in v1.

### 2.6 Time alignment

Radau5/DOP853/DOPRI5 already produce dense output; `wasmWorker.ts`'s `resampleUniform()`
already does linear interpolation for chart display, but in JS. A small C port
(~20-30 LOC) of the same interpolation, operating on the _user's actual data
timestamps_ (irregular, not uniform), keeps residual computation inside WASM during the
fit.

### 2.7 Interactivity: chunked `maxfev`, not `nprint` + `SharedArrayBuffer`

`lmdif` supports two native hooks: `nprint` (periodic synchronous callback with current
`x`/`fvec`) and a `negative-iflag-return` abort. `nprint` would need `SharedArrayBuffer`
for the worker to report progress mid-call without blocking, which needs COOP/COEP
headers — awkward on GitHub Pages static hosting. Instead: call `lmdif` with a small
`maxfev` budget, return to JS, `postMessage` progress (current params, normalized
residual norm), then re-invoke `lmdif` seeded with the returned `x` as the new starting
point. Not a true resume (trust-region state like `diag` resets each call), but
restarting LM from an improved `x` is standard practice and converges fine.

Cancellation is cooperative at the JS level: the UI simply doesn't request the next
chunk. `iflag < 0` (the abort mechanism) is reserved for this cancel path, not for
integration failures (see 2.8). `worker.terminate()` remains available as a blunt
fallback if a single chunk hangs.

### 2.8 Solver failure mid-fit

If a trial parameter set causes an integration failure (e.g. Radau5 `IDID < 0`) during a
finite-difference Jacobian step, `fcn` returns a **large finite penalty residual**, not
an `iflag < 0` abort. This lets `lmdif`'s own trust-region logic reject and shrink away
from that region — standard robust behavior. Treating every solver hiccup as a hard
abort would make fitting near the edges of numerical stability (common in kinetic
parameter search) unusable.

### 2.9 Worker architecture

A new dedicated `fitWorker.ts` in `mxlweb-core`, not an extension of `wasmWorker.ts`.
The chunked-`maxfev`/progress/cancel protocol is a fundamentally different message
lifecycle than the existing one-shot `SimulationRequest`→`SimulationResult`; keeping the
plain simulation worker simple is worth the small amount of duplicated
Emscripten-module-loading code.

### 2.10 UI placement

A new mode/tab within `AnalysesDashboard.svelte` (not a new route), since fitting needs
the same model config, parameter table, and chart the dashboard already assembles — a
separate route would duplicate or awkwardly share that state.

### 2.11 Results display: fitted values and a convergence plot

The parameter table (2.4) gains a live "Fitted value" column next to "Initial guess",
updating on every chunk's progress — sourced from `Fit.svelte`'s own transient state,
not persisted into `FitParameterConfig` (that type holds saved _choices_ — which
parameters to fit, log-space or not — not a run's _results_).

A second chart, separate from the trajectory-vs-data chart, plots residual norm against
cumulative function evaluations (linear x, logarithmic y — residual norm typically drops
by orders of magnitude as a fit converges, and a linear axis flattens the late-stage
improvement to invisibility). One point per chunk response, since that's the resolution
`fit_chunk` actually reports at (2.7 already established there's no per-inner-iteration
signal without `SharedArrayBuffer`). History resets at the start of each run.

### 2.12 Applying fitted parameters back to the model

An "Apply fitted parameters" button writes the current best-fit values into
`model.parameters` — the same `SvelteMap.set()` pattern `AnalysesDashboard.svelte`'s
parameter sliders already use to mutate the shared, reactive `model` object — then calls
a new `onApply?: () => void` prop that `AnalysesDashboard` wires to its existing
`runAllSimulations()`, so every other analysis box (Simulation/ParameterScan/PAM) re-runs
against the newly-applied values exactly as it would after a manual slider edit.

The button is available as soon as the first chunk's progress has landed, not gated on
full convergence — a cancelled or still-running fit's current values are still real,
useful numbers a user may want to keep. No confirmation dialog: applying a fitted value
is not treated differently from any other parameter edit in this app, none of which
confirm today.

Applying only ever touches parameters currently marked "fit" (2.4) — fixed parameters
are never written, and initial conditions are untouched (fitting has never targeted
them, per 2.4's scope). Because the parameter table's "Initial guess" column already
reads live from `model.parameters`, applying updates it for free — the next fit run
(on this data or new data) starts from the just-applied values.

## 3. Rationale

Every piece of this reuses an existing pattern in the codebase rather than introducing a
new one: the `emcc`+function-table wiring for calling user code from inside WASM (2.1,
2.2), the AST's generic per-node codegen (2.2), the file-upload pattern (2.3), the
parameter table (2.4), the dense-output/interpolation approach already used for charts
(2.6), and the worker-per-backend architecture (2.9). The one genuinely new piece of
infrastructure is `lmdif` itself plus its ~1900 LOC of stable, decades-old dependency
functions — the same category of "vendor stable Fortran-derived C" this project already
does for the integrators.

`SharedArrayBuffer`-based synchronous progress (native to `nprint`) was rejected
specifically because of this project's GitHub Pages static-hosting constraint — not a
general rejection of the mechanism.

## 4. Consequences

- Implementation spans two repos: `mxlweb-core` (C sources, `build:wasm`, new
  `fitWorker.ts`, `buildDerivedWat`) and `mxlweb` (upload UI, column mapping, parameter
  "fit" checkboxes, progress/cancel UI).
- Fitting against derived quantities requires the derived-variable dependency subgraph
  for the mapped targets to be extractable in topologically-sorted form for
  `buildDerivedWat` — the same shape of data `allDerivedFn`/`selectDerivedFn` already
  consume for the JS backend.
- A fit only runs against the WASM backend (Radau5/DOP853/DOPRI5) — the JS and Pyodide
  integrators are not fit targets, since the whole design rests on the in-WASM
  function-pointer call pattern specific to that backend.
- Log-space-by-default parameter fitting means a parameter whose true optimum is exactly
  zero can never be reached exactly (asymptotic only) — acceptable for rate constants in
  practice, but worth surfacing in the UI copy near the per-parameter linear-space
  toggle.
- Restarting `lmdif` per chunk means convergence diagnostics (`info` code) are only
  meaningful for the final chunk; progress reporting between chunks is limited to
  residual norm and current parameters, not full MINPACK convergence state.
- Applying fitted parameters (2.12) mutates the same `model` object every other analysis
  box on the dashboard references — there is no per-analysis "sandboxed" parameter set.
  This matches how every other parameter edit in this app already works (sliders,
  direct value edits), but means Fit is not a safe place to explore "what if" parameter
  values without affecting the rest of the dashboard; `AnalysesDashboard`'s existing
  "Reset" button (re-runs `initModel()`) is the escape hatch.
