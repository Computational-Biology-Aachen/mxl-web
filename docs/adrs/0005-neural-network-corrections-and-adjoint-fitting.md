# ADR 0005: Neural Network Corrections as Generated Model Terms, and Adjoint-Based Fitting

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
dependency. And once an NN correction term is just an *instance* of that same AST built
from existing node types (§2.1) rather than a distinct kind of thing, "UDE" stops being a
separate model class: a plain mechanistic model is simply the case where no generated NN
term is present. Adjoint-based fitting is therefore useful beyond NN-augmented models —
any model with many fitted mechanistic parameters benefits too, since `lmdif`'s
finite-difference Jacobian cost scales with fitted-parameter count regardless of where
those parameters came from.

## 2. Decision

### 2.1 Neural network blocks as *generated* expressions — zero new `mathml` node types

A UDE correction term needs **no new `mathml` node types at all**. `KineticModelBuilder`
already establishes the precedent: `Reaction` isn't its own AST node — `reactionTerm()`
(`kineticModelBuilder.ts`) builds each dx/dt contribution as literal `new Mul([new
Num(coeff), new Name(rxnName)])` instances, summed via `new Add(terms)`, using the
existing `Mul`/`Add`/`Num`/`Name` classes. An NN block follows the same shape: an affine
combination is `Add` of `Mul(Name(weight), Name(input))` terms plus a bias `Name`, wrapped
in an activation node that — per §2.1.1 below — is *also* built from existing primitives.
The whole block is an ordinary, if larger, expression tree indistinguishable from any
hand-written rate law once generated. Consequently, §2.2's per-node backward rule only
ever needs to cover the ~48 node types that already exist — there is no NN-specific
differentiation code to write, ever; a generated block differentiates correctly for the
same reason it evaluates correctly, because nothing downstream can tell it apart from a
hand-authored expression.

Concretely, a `KineticModelBuilder`-side generator function (mirroring `reactionTerm()`'s
shape) takes an architecture spec (n inputs → h hidden units → m outputs) and produces (a)
new `Parameter` entries for every weight and bias and (b) the nested expression per output
— generated once when the block is authored or resized, never hand-typed.

**This generator is builder-agnostic and must be, since it isn't only consumed by
`KineticModelBuilder`.** `OdeModelBuilder` (`odeModelBuilder.ts`) has no reactions or
stoichiometry concept whatsoever — `setDifferential(key, fn: Base)` sets each variable's
dx/dt directly as a plain `Base` expression, and the two builders only converge downstream
("lower into the same shared IR," per that file's own doc comment). The generator's output
— a `Base` expression plus a set of `Parameter` entries — is the same regardless of
builder; only how it's wired in differs, and both wiring points already exist with no new
concept needed:

- **`KineticModelBuilder`**: the generated expression becomes an ordinary reaction's `fn`,
  with stoichiometry `{ variable: 1 }` — a UDE correction term *is* a reaction whose rate
  law happens to be machine-generated instead of hand-typed. Nothing about the
  reaction/stoichiometry abstraction changes.
- **`OdeModelBuilder`**: the generated expression is added into the existing differential —
  `setDifferential(key, new Add([currentExpr, nnBlockExpr]))` — again just composition
  with what's already there.

#### 2.1.1 Activation: softplus, in its numerically-stable form — still no new node type

Softplus is the default activation for both UDE correction terms and full NODEs (not
tanh — tanh was this ADR's original placeholder default, superseded by this decision).
Like tanh, softplus is smooth (C^∞), which matters here more than in ordinary deep
learning: a kink in the vector field (ReLU's, most obviously) gives Radau5/DOP853's
adaptive step-size control a hidden quasi-event to repeatedly shrink around, and violates
the smoothness the adjoint method's own derivation assumes — ReLU is not offered as an
option for this reason. `softplus(x) = ln(1 + exp(x))` is expressible entirely with
existing nodes (`Ln`, `Exp`, `Add`, `Num`) — but generate its numerically-stable form,
`max(x, 0) + ln(1 + exp(-|x|))` (`Max`, `Abs`, `Add`, `Exp`, `Ln`, `Minus`, all existing),
not the naive one: naive `ln(1+exp(x))` overflows to `Infinity` for large `x` instead of
the correct asymptotic value of `x` itself, and a single `Infinity`/`NaN` mid-solve during
a fit corrupts the whole trajectory (see ADR 0004 §2.8's large-finite-penalty handling for
what this is otherwise mistaken for).

#### 2.1.2 A generated weight must not default to log-space fitting

ADR 0004 §2.4's fit-parameter default is log-space, "since... virtually every fittable
parameter... must stay positive." That default is wrong for NN weights and biases, which
must range over all reals to represent anything nontrivial. The generator must set ADR
0004's existing per-parameter "fit in linear space" toggle for every weight/bias it
creates — this needs to happen at generation time, not left as a trap for whoever wires
generated parameters into the existing fit-parameter table.

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

Every piece reuses an existing pattern rather than introducing a new one: `reactionTerm()`'s
generated-expression shape and the reaction/stoichiometry and `setDifferential` wiring
points (§2.1), the AST's generic per-node visitor methods (§2.2), the existing chunked
`FIT_INIT`/`FIT_CHUNK`/`FIT_FREE` worker protocol and its `initialResidualNorm` probe
(§2.4), and ADR 0004's fit-target/data plumbing (including its per-parameter linear-space
toggle, reused rather than replaced in §2.1.2), none of which need to change shape. The one
deliberate departure from prior art is *not* following diffrax's own preferred adjoint
strategy (§2.3) — the reason is architectural (opaque solver), not a disagreement with
that recommendation.

## 4. Consequences / Open Questions

- Backward rules for the ~48 existing node types (§2.2) — not yet designed; this is the
  actual remaining differentiation work, since §2.1 needs no NN-specific rules.
- NN block architecture limits for v1 — single hidden layer only, or deeper? Affects both
  generated-expression size (codegen latency, §2.2) and how many new `Parameter` rows the
  generator dumps into `ModelEditor`'s parameter table per block. Not yet decided.
- How a generated NN block's parameters are presented/grouped in `ModelEditor`'s parameter
  table — one row per weight (could be dozens per block) vs. some collapsed group view —
  not yet designed.
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
