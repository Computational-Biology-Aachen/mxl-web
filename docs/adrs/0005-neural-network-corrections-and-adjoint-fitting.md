# ADR 0005: Neural Network Corrections via AST Nodes, and Adjoint-Based Fitting

**Status:** Proposed
**Scope:** `ModelEditor` (this repo); `mathml/`, `src-c/`, `backends/wasm/` (sibling
`mxlweb-core` repo)

---

## 1. Context

ADR 0004 established fitting via cminpack's `lmdif`, noting explicitly that "no autodiff
exists in the mathml AST, and `lmdif` internally does forward-difference Jacobians." That
constraint is the starting point for this ADR: users want to augment an otherwise-
mechanistic model with a small neural-network correction term (a universal differential
equation, UDE) — most concretely for PETC (photosynthetic electron transport chain)
models, where mechanistic knowledge of some sub-process is incomplete but the rest of the
kinetic model is well characterized.

Two constraints rule out the obvious approaches:

- **Stiffness.** PETC models, especially under PAM protocols, are stiff — that's why this
  project vendors Hairer's implicit Radau5 at all (ADR 0005, `mxlweb-core`:
  vendored-hairer-solvers). The standard Neural-ODE continuous adjoint
  ("`BacksolveAdjoint`" in SciMLSensitivity/diffrax terms — reconstruct the state
  trajectory by re-integrating the forward vector field backward in time, alongside the
  adjoint variable) is explicitly documented as unstable on stiff problems by both
  ecosystems, independent of implementation quality: a forward-dissipative vector field
  is an *expanding*, error-amplifying process when run backward, and that corrupts the
  coupled adjoint variable regardless of its own dynamics.
- **Opaque forward solver.** diffrax's own preferred default
  (`RecursiveCheckpointAdjoint`, discretize-then-optimize) sidesteps that instability by
  differentiating the solver's own step function directly — but that requires the step
  function to be differentiable code. Ours isn't: Radau5/DOP853/DOPRI5 are opaque
  compiled Fortran→C→Emscripten (`vendored-hairer-solvers`), not JAX. No JS/WASM ML
  library changes this — a survey of jax-js, TensorFlow.js's WebGPU backend, and Burn's
  WGPU+autodiff stack found none of them can differentiate through the vendored solver
  either, because none can differentiate through opaque compiled machine code.

The reframe that unblocks both constraints: the adjoint method doesn't require
differentiating the *solver*, only computing vector-Jacobian products of the *RHS*. The
RHS is already a `mathml` AST — a closed, finite set of node types (`Base`'s
`Nullary`/`Unary`/`Binary`/`Nary` hierarchy, ~48 concrete classes across
`mathml/{unary,unary-special,binary,nary}.ts`) evaluated through a shared visitor pattern
(`Base.toWat`/`toJs`/`toPy`/`toTex`/`toSBML`/`toTs`/`toJson`). A VJP for that graph is one
more visitor method, generated at compile time — no CAS, no `simplify()`/CSE step, no new
dependency. And once NN blocks are just more node types in that same AST, "UDE" stops
being a separate model class: a plain mechanistic model is simply the case where no NN
node is present. Adjoint-based fitting is therefore useful beyond NN-augmented models —
any model with many fitted mechanistic parameters benefits too, since `lmdif`'s
finite-difference Jacobian cost scales with fitted-parameter count regardless of where
those parameters came from.

## 2. Decision

### 2.1 Neural network blocks as new `mathml` AST node types

A UDE correction term is authored as new node types alongside the existing
`Nullary`/`Unary`/`Binary`/`Nary` hierarchy — an affine/dense node (weighted sum of named
inputs plus bias) and activation nodes reusing (or extending, where absent) the existing
`Unary` subclasses in `unary.ts` (`Tanh` etc.). Each participates in the same visitor
pattern every other node already does; `wat-codegen.ts`'s `buildModelWat`/`buildDerivedWat`
need no changes at all — NN nodes emit WAT like any other node. Exact node shapes are an
open question (§4).

### 2.2 Reverse-mode sensitivity as one more `Base` visitor method — no CAS required

`Base` gains one more abstract method for backward/VJP accumulation, implemented once per
concrete node class using that node's own known local derivative rule — the same two-pass
graph walk PyTorch/JAX use internally (forward pass records values, one backward pass
accumulates one adjoint per node in reverse topological order), not textual symbolic
differentiation. Because the node-type set is closed and the graph has no control flow,
mutation, or aliasing, this needs no simplifier or CSE pass and no CAS dependency — the
same category of change `toWat` already was: one more thing every node type knows how to
do.

This must run live, in-browser: `ModelEditor.svelte` recompiles the AST at runtime on
every edit, and `misc/mxl-codegen` (the offline Python pipeline, sibling `mxlpy`) only
pre-generates initial model pages, not runtime edits — so there is no sympy/CAS shortcut
available here even in principle. It does introduce a real constraint: derivative-graph
codegen latency is now a live-UX cost on the edit-recompile loop, not a batch-job cost,
most binding for large NN blocks (§4).

### 2.3 Continuous adjoint, reusing the existing black-box solver for both passes

Forward-solve as today, unmodified. For the backward pass, do **not** reconstruct y(t) by
re-integrating the forward vector field backward in time (`BacksolveAdjoint` — see §1).
Instead, obtain y(t) at whatever points the backward pass needs directly from the forward
solve: Hairer's built-in dense-output/continuous-extension routines (`CONTR5`/`CONTD8`/
`CONTD5`), or checkpointed accepted-step values with local interpolation as a fallback if
dense output isn't currently exposed through the WASM bindings (open question, §4). Only
the adjoint variable λ (plus a parameter-gradient quadrature accumulator) is
backward-integrated. λ's ODE is linear given y(t) and inherits the *same* stiffness ratio
as the forward problem (transposed, not worse) — it needs an implicit integrator too, but
being linear, its per-step "Newton iteration" is a single linear solve, cheaper than the
forward nonlinear one.

This deliberately does not imitate diffrax's own preferred `RecursiveCheckpointAdjoint`:
reaching into and differentiating Hairer's vendored Fortran step routines was considered
and rejected as a categorically larger, higher-risk undertaking than interpolating a
trajectory the solver already knows how to produce.

### 2.4 Two fit backends, auto-selected once at `FIT_INIT` — invisible to the user

`lmdif` (ADR 0004) remains the default, unchanged: for a handful of fitted mechanistic
parameters its finite-difference Jacobian is cheap and its Gauss-Newton convergence beats
a first-order method. It cannot scale to NN-sized parameter counts, though — not because
its Jacobian estimate is inexact, but because it needs the full Jacobian of the *residual
vector*, and reverse-mode/adjoint is only cheap for the *opposite* shape (gradient of one
scalar loss, cost independent of parameter count). So a second backend is needed, not a
drop-in replacement of `lmdif`'s Jacobian step: it runs the adjoint (§2.3) to get ∇_θL for
the summed-residual loss each iteration, then takes a first-order optimizer step (exact
algorithm: open question, §4).

Backend choice is made once inside `fit_init`, before either backend's session state is
allocated, and is never exposed as a user-facing setting — mxlweb's audience should never
need to know an optimizer choice exists. `FitInitRequest` may carry an undocumented
`backend?: FitBackend` override (not wired into `FitEditor.svelte`) strictly for tests and
debugging. The trigger is a measured cost estimate, not a purely structural one:
`FIT_INIT` already performs one forward solve to compute `initialResidualNorm` (ADR 0004
§2.11); that measured wall-clock cost, multiplied by `fitIdx.length`, is compared against a
time budget. This captures stiffness-driven cost directly — a slow PETC/PAM solve trips
the switch sooner even with few NN weights — which a purely structural proxy like
`#reactions × #fittedParams` cannot. Exact threshold: open question, §4.

### 2.5 Backend-agnostic stopping criteria and progress reporting

Both backends report through one shape, so `fitStore.ts`/`FitEditor.svelte` never need to
know which one ran:

```ts
export type FitBackend = "lm" | "adjoint";

export type FitStopReason =
  | "converged_residual"
  | "converged_gradient"
  | "converged_step"
  | "plateau"
  | "target_reached"
  | "budget_reached"
  | "error";

export interface FitStoppingCriteria {
  /** Renamed from `maxfev` (ADR 0004). Unit is backend-specific: function
   * evaluations under "lm", optimizer steps under "adjoint". */
  maxIterations: number;
  /** Shared, unchanged semantics from ADR 0004 §2.7/2.11. */
  targetResidualNorm?: number;
  /** "adjoint" only — ignored (or rejected at FIT_INIT) under "lm". */
  gradNormTol?: number;
  /** "adjoint" only. */
  plateau?: { patience: number; minDelta: number };
}

export interface FitProgress {
  requestId: string;
  backend: FitBackend;
  nfev: number;
  residualNorm: number;
  /** "adjoint" only; absent under "lm". */
  gradNorm?: number;
  params: number[];
  done: boolean;
  reason?: FitStopReason; // present iff done
  err?: SimulationError;
}
```

`lmdif`'s raw `info` code is not surfaced to callers — it maps onto `FitStopReason` inside
`fitWorker.ts`:

| `info`  | MINPACK meaning                                     | `FitStopReason`     |
| ------- | ---------------------------------------------------- | -------------------- |
| 1, 3    | relative reduction in sum-of-squares below `ftol`     | `converged_residual` |
| 2       | relative change in solution below `xtol`              | `converged_step`     |
| 4, 8    | residuals orthogonal to Jacobian columns (`gtol`) — already a first-order-optimality / gradient-based check | `converged_gradient` |
| 6, 7    | `ftol`/`xtol` too small to improve further — already a "stopped improving" signal | `plateau`             |
| 5       | `maxfev` (now `maxIterations`) exhausted              | `budget_reached`     |
| custom `-2` | `targetResidualNorm` crossed (ADR 0004 §2.7, unchanged) | `target_reached` |
| 0, other negative | bad input / genuine failure                 | `error`               |

`converged_step` has no "adjoint" equivalent and is never emitted on that path — a
first-order optimizer's step size reflects its learning-rate schedule, not proximity to a
solution; `plateau` already covers the practical "stopped improving" need.

## 3. Rationale

Every piece reuses an existing pattern rather than introducing a new one: the AST's
generic per-node visitor methods (§2.1, §2.2), the existing chunked
`FIT_INIT`/`FIT_CHUNK`/`FIT_FREE` worker protocol and its `initialResidualNorm` probe
(§2.4), and ADR 0004's fit-target/data plumbing, none of which need to change shape. The
one deliberate departure from prior art is *not* following diffrax's own preferred
adjoint strategy (§2.3) — the reason is architectural (opaque solver), not a disagreement
with that recommendation.

## 4. Consequences / Open Questions

- Exact new node types and their backward rules (dense/affine node shape, which
  activations beyond what `unary.ts` already has) — not yet designed.
- Optimizer for the "adjoint" backend (Adam vs. L-BFGS) and its hyperparameters — not yet
  decided.
- Exact auto-selection time-budget threshold (§2.4) — not yet calibrated; needs
  benchmarking against real PETC/PAM models, not guessed.
- Whether Hairer's dense-output routines are already reachable through the current WASM
  bindings, or need new exposure — not yet checked.
- How the augmented adjoint state (λ plus the quadrature accumulator) is wired into a new
  C-side integration path alongside `radau5_wrapper.c` — not yet designed.
- Codegen latency for the backward graph on live `ModelEditor.svelte` edits is a real UX
  risk for large NN blocks — not yet benchmarked.
- Implementation spans both repos, per ADR 0004's precedent; the backend-agnostic types in
  §2.5 are the only piece of this ADR specified precisely enough to implement without
  further design work.
