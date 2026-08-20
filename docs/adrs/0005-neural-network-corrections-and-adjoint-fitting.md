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
  is an _expanding_, error-amplifying process when run backward, and that corrupts the
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
differentiating the _solver_, only computing vector-Jacobian products of the _RHS_. The
RHS is already a `mathml` AST — a closed, finite set of node types (`Base`'s
`Nullary`/`Unary`/`Binary`/`Nary` hierarchy, ~48 concrete classes across
`mathml/{unary,unary-special,binary,nary}.ts`) evaluated through a shared visitor pattern
(`Base.toWat`/`toJs`/`toPy`/`toTex`/`toSBML`/`toTs`/`toJson`). A VJP for that graph is one
more visitor method, generated at compile time — no CAS, no `simplify()`/CSE step, no new
dependency. And once an NN correction term is just an _instance_ of that same AST built
from existing node types (§2.1) rather than a distinct kind of thing, "UDE" stops being a
separate model class: a plain mechanistic model is simply the case where no generated NN
term is present. Adjoint-based fitting is therefore useful beyond NN-augmented models —
any model with many fitted mechanistic parameters benefits too, since `lmdif`'s
finite-difference Jacobian cost scales with fitted-parameter count regardless of where
those parameters came from.

## 2. Decision

### 2.1 Neural network blocks as _generated_ expressions — zero new `mathml` node types

A UDE correction term needs **no new `mathml` node types at all**. `KineticModelBuilder`
already establishes the precedent: `Reaction` isn't its own AST node — `reactionTerm()`
(`kineticModelBuilder.ts`) builds each dx/dt contribution as literal `new Mul([new
Num(coeff), new Name(rxnName)])` instances, summed via `new Add(terms)`, using the
existing `Mul`/`Add`/`Num`/`Name` classes. An NN block follows the same shape: an affine
combination is `Add` of `Mul(Name(weight), Name(input))` terms plus a bias `Name`, wrapped
in an activation node that — per §2.1.1 below — is _also_ built from existing primitives.
The whole block is an ordinary, if larger, expression tree indistinguishable from any
hand-written rate law once generated. Consequently, §2.2's per-node backward rule only
ever needs to cover the ~48 node types that already exist — there is no NN-specific
differentiation code to write, ever; a generated block differentiates correctly for the
same reason it evaluates correctly, because nothing downstream can tell it apart from a
hand-authored expression.

Concretely, a `KineticModelBuilder`-side generator function (mirroring `reactionTerm()`'s
shape) takes an architecture spec (n inputs → depth × width hidden layers → m outputs) and
produces (a) new `Parameter` entries for every weight and bias and (b) the nested
expression per output — generated once when the block is authored or resized, never
hand-typed.

**Depth is arbitrary/configurable from v1, not capped at one hidden layer.** A single
hidden layer is theoretically sufficient (the universal approximation theorem is stated for
exactly that case), but real prior work in this problem domain needed more: 3 layers deep
in `2026-ps-model-comp`, 6 layers deep (`flux_width=64`) in `2026-chilling-nights`. Capping
v1 at one layer would make it unable to reproduce work already done. A block at that scale
(6 × 64 ≈ 20,800 parameters) is exactly the regime §2.1.3 and §2.4 are designed around —
this is not a hypothetical edge case.

**This generator is builder-agnostic and must be, since it isn't only consumed by
`KineticModelBuilder`.** `OdeModelBuilder` (`odeModelBuilder.ts`) has no reactions or
stoichiometry concept whatsoever — `setDifferential(key, fn: Base)` sets each variable's
dx/dt directly as a plain `Base` expression, and the two builders only converge downstream
("lower into the same shared IR," per that file's own doc comment). The generator's output
— a `Base` expression plus a set of `Parameter` entries — is the same regardless of
builder; only how it's wired in differs, and both wiring points already exist with no new
concept needed:

- **`KineticModelBuilder`**: the generated expression becomes an ordinary reaction's `fn`,
  with stoichiometry `{ variable: 1 }` — a UDE correction term _is_ a reaction whose rate
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
must range over all reals to represent anything nontrivial.

Checked while implementing §2.1's generator: the "fit in linear space" toggle
(`FitParameterConfig.logSpace`) is a `mxl-web`-side concept — `mxlweb-core`'s own
`Parameter` type (`modelBuilderBase.ts`) has no such field, only `value`/`displayName`/
`texName`/`slider`. So the generator itself has nothing to set here; it only ever produces
plain `Parameter` entries. The obligation lands on whichever `mxl-web` code turns a
block's "train this block" toggle (§2.1.3) into `FitParameterConfig` entries for its
weights — that code must default `logSpace: false` for every one of them. Not yet
implemented (§2.1.3's UI is unstarted); noted here so it isn't lost when that UI is built.

#### 2.1.3 Weights are a separate concept from parameters — never individual table rows

ADR 0004 §2.4's parameter table is built around a human looking at and hand-tuning each
row: current value doubles as initial guess, one fit checkbox per row. That model doesn't
survive a 6×64 block's ≈20,800 weights. NN weights and ODE parameters are kept as
deliberately separate concepts: a block is authored/resized as one unit in its own UI
(architecture spec, which variable/reaction it corrects), never expanded into individual
rows in `ModelEditor`'s existing parameter table. Weights are seeded via standard
randomized init (Xavier/Glorot-style) and from then on change _only_ through fitting —
never hand-edited. Fitting itself becomes a **per-block toggle** ("train this block: yes/
no"), not per-weight checkboxes; there's no real scenario where half a block's weights
should be frozen while the rest train. This also makes §2.1.2's log-space trap purely an
internal-representation correctness question rather than a UX-surfacing one, since a weight
is never visible through the UI path that default applies to.

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
available here even in principle. This is substantially less of a live-UX risk than it
first appears, though: `buildModelWat`'s signature (`equations`, `varNames`, `parNames`)
depends only on model _structure_ — values (including weight values during fitting) flow
in separately at runtime via `y_ptr`/`rpar_ptr`, never baked into the compiled WAT. Both
the forward and backward codegen passes therefore only re-run on structural edits (adding a
reaction, resizing an NN block), never on value edits (a fit iteration, dragging a
parameter slider) — the cost of differentiating a large block is paid once per deliberate
architecture decision, not per fit-iteration or per keystroke.

#### 2.2.1 Non-smooth node types: zero gradient by convention, documented at each site

Most of the ~48 node types are ordinary calculus (`Exp' = Exp`, `Sin' = Cos`, ...) with no
design decision to make. The exceptions:

- **`Floor`/`Ceiling`**: piecewise-constant, so the honest derivative is `0` almost
  everywhere (undefined exactly at integer boundaries — measure zero). Implemented as
  literal zero, the same convention every AD system uses. Consequence worth documenting
  loudly at the implementation site, not just here: if a fitted parameter's only path to
  the loss runs through one of these, Adam sees zero gradient and that parameter simply
  won't move — correct behavior, but easy to mistake for a bug without a comment explaining
  it.
- **Comparison/boolean nodes** (`Eq`, `GreaterThan`, `And`, etc.): same reasoning, same
  convention — a truth value doesn't vary smoothly with its operands. In practice these are
  almost always a `Piecewise` condition, not a value flowing further into arithmetic.
- **`Factorial`**: a proper derivative needs the digamma function, which isn't among the
  existing WAT math imports (`exp`/`log`/`sin`/`...`/`pow`/`max`/`min`/`rem` — no digamma).
  Declined to add it: `Factorial` is never emitted by the NN-block generator and is rare in
  hand-written kinetic rate laws, so it isn't worth expanding the primitive math surface
  for. Treated as gradient-zero, same as the discrete nodes above.
- **`Piecewise`/`Max`/`Min`**: not actually a problem, despite not being smooth at their
  branch/tie boundaries — route the adjoint only into whichever branch or argument was
  actually selected during the forward pass (the standard `lax.cond`/`jnp.where`-style
  rule). Zero into every branch not taken.
- **`RateOf`**: needs no rule at all — it's already a literal zero stub in every numeric
  backend (`toJs`/`toPy`/`toWat` all emit `"0"`; only `toTex`/`toSBML` render it
  meaningfully, for SBML-roundtrip display), an artifact of importing SBML's `rateOf`
  csymbol into a system that only solves explicit ODEs. Its backward rule is trivially
  zero, consistent with the rest of it.

Every zero-emitting rule above must carry an explicit code comment stating _why_ it's zero
— a documented convention, not a silent stub that reads as an oversight.

### 2.3 Continuous adjoint, reusing the existing black-box solver for both passes

Forward-solve as today, unmodified. For the backward pass, do **not** reconstruct y(t) by
re-integrating the forward vector field backward in time (`BacksolveAdjoint` — see §1).
Instead, obtain y(t) at whatever points the backward pass needs directly from the forward
solve. Only the adjoint variable λ (plus a parameter-gradient quadrature accumulator) is
backward-integrated. λ's ODE is linear given y(t) and inherits the _same_ stiffness ratio
as the forward problem (transposed, not worse) — it needs an implicit integrator too, but
being linear, its per-step "Newton iteration" is a single linear solve, cheaper than the
forward nonlinear one.

This deliberately does not imitate diffrax's own preferred `RecursiveCheckpointAdjoint`:
reaching into and differentiating Hairer's vendored Fortran step routines was considered
and rejected as a categorically larger, higher-risk undertaking than interpolating a
trajectory the solver already knows how to produce.

#### 2.3.1 Getting y(t): checkpoint + local Hermite interpolation, not Hairer's dense output

Checked, not assumed: real dense output is **not** currently reachable. All three wrappers
(`radau5_wrapper.c`) call their solver with `IOUT = 1` (Hairer's "call `solout` every
accepted step, but skip computing the dense-output polynomial" mode). `contr5_`/`contd8_`/
`contd5_` exist in the vendored source but their `CONT` coefficient arrays are never
populated in this mode — ADR 0004 §2.6's "already produce dense output" meant "produce
enough step points for linear interpolation to look smooth," not Hairer's literal
continuous extension.

Two ways to get real y(t) at the backward pass's query points: (A) flip `IOUT` to 2,
store the `CONT` array per step, export the `contr5_`/`contd8_`/`contd5_` query functions
— higher accuracy, matching each solver's own order, but reaches into Hairer's vendored
solver-driver internals in three places and grows memory per step (a coefficient array, not
two numbers); or (B) reuse the `(t, y)` checkpoint data **already collected today** for
chart plotting (`_get_out_t`/`_get_out_y`) and do local cubic Hermite interpolation within
the bracketing step, using `y` and `f = dy/dt` at both endpoints (one extra RHS evaluation
per endpoint, already have the RHS) — third-order accurate, zero changes to the vendored
solver-driver code.

**Decision: B.** This ADR already rejects reaching into Hairer's vendored internals once,
for exactly this reason (§2.3's `RecursiveCheckpointAdjoint` rejection) — option A would
quietly break that same principle for a secondary accuracy gain. Revisit only if B's
accuracy is a measured problem later, not a theoretical one. A direct consequence: **the
forward pass needs zero C changes** — `run_radau5`/`_get_out_t`/`_get_out_y` already
produce exactly the checkpoint data B needs.

#### 2.3.2 Backward integrator: reuse whichever solver ran forward

No separate backend-solver choice — the backward pass uses whichever of
radau5/dop853/dopri5 `FitInitRequest.solver` already selected. Stiffness is a property of
the system, not of which method was picked: if the forward pass needed Radau5's implicit
solve, the backward adjoint ODE (same eigenvalue structure, transposed) needs it too; if
dop853 sufficed forward, it suffices backward.

#### 2.3.3 New C entry points, not an extension of `fit_init`/`fit_chunk`

The adjoint backend gets its own `adjoint_init`/`adjoint_chunk`/`adjoint_free`, dispatched
from `fitWorker.ts` on `session.backend` (already exists per §2.4), rather than growing
`fit_init`/`fit_chunk` in place. `fit_init`'s current signature (`y0, pars, fitIdx,
logFlags, targets, dataT, dataY, tEnd, nDerived, solver, rtol, atol, targetResidualNorm`)
has no room for `gradNormTol`/`plateau`, and shares essentially no algorithm with an
ODE-based backward integration — MINPACK's QR/trust-region machinery and Adam-on-an-
augmented-adjoint-ODE have nothing in common to factor out.

#### 2.3.4 The backward/VJP WAT is generated lazily — only when actually needed

Mirrors an existing pattern rather than inventing one: `FitInitRequest.derivedWat` is
already optional, generated by the caller only when some fit target needs a derived
quantity — the WASM side never computes it otherwise. The backward graph does the same:
a new `FitInitRequest.adjointWat?: string`, generated by a new backward-codegen method on
`KineticModelBuilder`/`OdeModelBuilder`, called by `mxl-web` **only** when it's about to
request `backend: "adjoint"`. Plain simulation (`wasmWorker.ts`) never touches it, and
neither does an `"lm"` fit, which has no use for analytic derivatives at all.

### 2.4 Two fit backends, auto-selected once at `FIT_INIT` — invisible to the user

`lmdif` (ADR 0004) remains the default, unchanged: for a handful of fitted mechanistic
parameters its finite-difference Jacobian is cheap and its Gauss-Newton convergence beats
a first-order method. It cannot scale to NN-sized parameter counts, though — not because
its Jacobian estimate is inexact, but because it needs the full Jacobian of the _residual
vector_, and reverse-mode/adjoint is only cheap for the _opposite_ shape (gradient of one
scalar loss, cost independent of parameter count). So a second backend is needed, not a
drop-in replacement of `lmdif`'s Jacobian step: it runs the adjoint (§2.3) to get ∇_θL for
the summed-residual loss each iteration, then takes an **Adam** step (learning rate
`1e-4`, matching prior real usage across adam/adamw/adabelief in this problem domain — v1
ships plain Adam only, the others deferred). L-BFGS was considered and rejected outright,
not just deprioritized: its line-search-driven, full-batch quasi-Newton approach assumes a
smoother, more locally-quadratic loss surface than deep, non-convex ODE/UDE landscapes
actually have — the same reason Adam-family optimizers displaced L-BFGS for NN training
generally, reinforced here by direct prior experience with these specific loss landscapes,
not just general folklore.

Backend choice is made once inside `fit_init`, before either backend's session state is
allocated, and is never exposed as a user-facing setting — mxlweb's audience should never
need to know an optimizer choice exists. `FitInitRequest` may carry an undocumented
`backend?: FitBackend` override (not wired into `FitEditor.svelte`) strictly for tests and
debugging.

The trigger simplifies given §2.1.3's per-block toggle: **any active NN block forces
`"adjoint"` unconditionally** — no cost computation needed, since a 6×64 block's ≈20,800
finite-difference forward solves are obviously intractable regardless of measured per-solve
cost. The measured-cost heuristic is only needed for the narrower case it was always
better suited to: a purely mechanistic model with many fitted kinetic parameters and no NN
block at all. There, `FIT_INIT` already performs one forward solve to compute
`initialResidualNorm` (ADR 0004 §2.11); that measured wall-clock cost, multiplied by
`fitIdx.length`, is compared against a time budget — capturing stiffness-driven cost
directly (a slow PETC/PAM solve trips the switch sooner even with few fitted parameters),
which a purely structural proxy like `#reactions × #fittedParams` cannot. The exact budget
number is deliberately left uncalibrated — not something to responsibly guess without
benchmarking against real models; start with a conservative placeholder (e.g. 200ms) and
tune once real models exist to measure against.

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

| `info`            | MINPACK meaning                                                                                             | `FitStopReason`      |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | -------------------- |
| 1, 3              | relative reduction in sum-of-squares below `ftol`                                                           | `converged_residual` |
| 2                 | relative change in solution below `xtol`                                                                    | `converged_step`     |
| 4, 8              | residuals orthogonal to Jacobian columns (`gtol`) — already a first-order-optimality / gradient-based check | `converged_gradient` |
| 6, 7              | `ftol`/`xtol` too small to improve further — already a "stopped improving" signal                           | `plateau`            |
| 5                 | `maxfev` (now `maxIterations`) exhausted                                                                    | `budget_reached`     |
| custom `-2`       | `targetResidualNorm` crossed (ADR 0004 §2.7, unchanged)                                                     | `target_reached`     |
| 0, other negative | bad input / genuine failure                                                                                 | `error`              |

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
deliberate departure from prior art is _not_ following diffrax's own preferred adjoint
strategy (§2.3) — the reason is architectural (opaque solver), not a disagreement with
that recommendation.

## 4. Consequences / Open Questions

Every major branch of this design is now resolved (§2.1–§2.5, via a dedicated design
session — see the ADR history for what was reconsidered along the way, e.g. the original
"new AST node types" and "single hidden layer" framings, both superseded). What remains is
implementation, plus two things that are deliberately _not_ design decisions to make from
first principles:

- The exact auto-selection time-budget threshold (§2.4) — a placeholder (200ms) ships
  first; the real number needs calibration against real PETC/PAM models, not a guess.
- Whether local Hermite interpolation's accuracy (§2.3.1, option B) is ever actually a
  problem in practice — revisit toward Hairer's true dense output (option A) only if
  measured, not preemptively.
- Implementation spans both repos, per ADR 0004's precedent. Suggested order: (1) the
  per-node backward/VJP rule (§2.2, §2.2.1) — foundational, self-contained, testable against
  finite differences in isolation; (2) the NN-block generator (§2.1) — pure AST generation
  using node types that already codegen correctly; (3) the graph-level backward-WAT
  orchestration tying (1) into a full model (topological walk, intermediate-sharing scheme
  — not yet designed at that level of detail, deliberately deferred past this ADR); (4) the
  C-side adjoint entry points and Hermite interpolation (§2.3.1–§2.3.4); (5) `ModelEditor`
  UI for authoring/toggling blocks (§2.1.3).
