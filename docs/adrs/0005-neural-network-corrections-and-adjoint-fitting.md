# ADR 0005: Neural Network Block Authoring and Fit-Backend Selection (UI)

**Status:** Implemented
**Scope:** `ModelEditor.svelte`, `TableNNBlocks.svelte`, `Fit.svelte`,
`stores/fitStore.ts` (this repo)

---

## 1. Context

ADR 0004 established fitting via cminpack's `lmdif`, noting explicitly that "no autodiff
exists in the mathml AST, and `lmdif` internally does forward-difference Jacobians."
Users want to augment an otherwise-mechanistic model with a small neural-network
correction term (a universal differential equation, UDE) — most concretely for PETC
(photosynthetic electron transport chain) models, where mechanistic knowledge of some
sub-process is incomplete but the rest of the kinetic model is well characterized.

The NN-block generator, the AST's reverse-mode sensitivity (`pushGradient`), the entire
continuous-adjoint algorithm, and the C-side `adjoint_init`/`adjoint_chunk` driver all
turned out to live in the sibling `mxlweb-core` repo, not here — see that repo's
**ADR 0008** for the full design and rationale (why continuous adjoint over backsolve or
discrete adjoint, the Hermite-interpolation decision, the `-1`-seed trick, multi-observation
jump conditions, and non-smooth-node gradient conventions). This ADR was originally
written to cover that whole design; it has been trimmed to the decisions that are
genuinely `mxl-web`-side — how a block is authored and toggled in the UI, one UI-owned
fitting default, how the fit backend gets chosen, and how backend-agnostic progress is
displayed.

## 2. Decision

### 2.1 A generated weight must not default to log-space fitting

ADR 0004 §2.4's fit-parameter default is log-space, "since... virtually every fittable
parameter... must stay positive." That default is wrong for NN weights and biases,
which must range over all reals to represent anything nontrivial.

`mxlweb-core`'s own `Parameter` type (`modelBuilderBase.ts`) has no `logSpace` field —
only `value`/`displayName`/`texName`/`slider` — because `FitParameterConfig.logSpace` is
an `mxl-web`-side concept. The obligation lands here: whichever code turns a block's
"train this block" toggle into `FitParameterConfig` entries for its weights must
default `logSpace: false` for every one of them.

### 2.2 Weights are a separate concept from parameters — never individual table rows

ADR 0004 §2.4's parameter table is built around a human looking at and hand-tuning each
row: current value doubles as initial guess, one fit checkbox per row. That model
doesn't survive a 6×64 block's ≈20,800 weights. `TableNNBlocks.svelte` keeps NN weights
and ODE parameters as deliberately separate concepts: a block is authored/resized as one
unit in its own UI (architecture spec, which variable/reaction it corrects), never
expanded into individual rows in `ModelEditor`'s existing parameter table. Weights are
seeded via standard randomized init (Xavier/Glorot-style) and from then on change _only_
through fitting — never hand-edited. Fitting itself is a **per-block toggle** ("train
this block: yes/no"), not per-weight checkboxes — there's no real scenario where half a
block's weights should be frozen while the rest train. This also makes §2.1's log-space
default purely an internal-representation correctness question rather than a
UX-surfacing one, since a weight is never visible through the UI path that default
applies to.

### 2.3 Backend selection: a per-model suggestion, user-overridable (amended)

Originally: any active NN block forced `"adjoint"` unconditionally, and the choice was
never shown to the user (see below). `mxlweb-core` has since grown a second NN-capable
backend — an analytic-Jacobian LM path (`jacobianWat`, a forward-sensitivity augmented
ODE combined with cminpack's `lmder`) that's both faster and numerically more reliable
than `"adjoint"`'s per-step cost for a _small_ trained block, proven empirically (a
1-hidden-layer-of-4 block, ~20 fit params, converges in 30-300 evals). With two realistic
NN-capable backends instead of one obvious default, guessing silently stopped being
defensible — `Fit.svelte` now exposes a `BackendChoice` = `"lm" | "lm-jacobian" |
"adjoint"` selector directly in the fit settings table, and computes a suggested value
per model (`suggestBackend()`) rather than forcing one:

- no trained NN block → `"lm"` (unchanged — finite differences are fine for ordinary
  kinetic parameters, which don't have `jacobianWat`/`adjointWat`'s NN-weight-specific
  motivation: a `scale`-damped output falling below the forward-difference noise floor)
- a trained NN block, any fit target is a derived quantity → `"adjoint"` (`"lm-jacobian"`
  can't do derived targets yet, see below)
- a trained NN block, any _mechanistic_ parameter is also being fit alongside it →
  `"adjoint"` (not a crash any more, see below — but unproven as a good default there)
- a trained NN block, state-only targets, no mechanistic parameter also fit, total
  trained NN param count ≤ `SMALL_NN_BLOCK_PARAM_THRESHOLD` (currently 50, deliberately
  uncalibrated placeholder — see §4) → `"lm-jacobian"`
- otherwise (a large trained block) → `"adjoint"`

Fitting a mechanistic parameter _alongside_ a trained NN block used to hit a real bug in
`buildJacobianGraph`'s codegen (`modelIr.ts`), found while wiring this up into the UDE
showcase: its default Alpha+Beta+NN-block fit threw "Maximum call stack size exceeded"
under `"lm-jacobian"` (caught by `buildFitConfig`'s own `try`/`catch`, so it surfaced as a
visible error rather than crashing — but still a bad default), while `"adjoint"` handled
the exact same fit fine (171 evals, converges). Root cause: `dfDy[k][m]` (the sensitivity
ODE's `∂f_k/∂y_m` coupling term) doesn't depend on which fit parameter `j` an equation is
for, so it got embedded `n_theta` times over — once per `j` — as a raw, unshared
expression object instead of a named local, the same sharing every other named
intermediate already gets. For that showcase's model this produced >1MB of WAT (~90k
S-expression nodes) that crashed `wat-compiler`'s own recursive encoder — not from deep
_nesting_ (only ~30 levels), but from sheer duplicated node count.

**Fixed**: `buildJacobianGraph` now binds each `dfDy[k][m]` to its own named intermediate
(`__jac_${k}_dfdy_${m}`) exactly like the existing per-node accumulators, cutting that
same case's WAT from >1MB to ~150KB. `dfDTheta[k][j]` didn't need the same treatment —
each entry is used exactly once (one equation per `(j,k)` pair), so there was nothing to
share there. Covered by a new regression test in `jacobianWat.test.ts` (mirrors the UDE
showcase's exact model) that compiles the WAT end-to-end and checks it against finite
differences, not just that `buildJacobianGraph` itself doesn't throw — the bug was in
_compiling_ the generated WAT, not in generating it.

The suggestion rule above still routes to `"adjoint"` for this combination even though
`"lm-jacobian"` no longer crashes — a quick manual check after the fix (same UDE model,
forced to `"lm-jacobian"`) ran 105 evals to a residual of 2.5, well short of `"adjoint"`'s
451 evals to 0.0999 on the identical fit. That's one anecdotal data point, not a
calibrated comparison, but not obviously a good default either — left as `"adjoint"`
pending an actual comparison across more models.

The suggestion is computed once per distinct `model` (an `$effect` keyed on `model`'s own
identity, with every other reactive read inside `untrack`ed) — this popover is a
dashboard-wide singleton reused across "Load"s (§2.4's own framing), so a plain `$state`
initializer would only ever fire once for the popover's whole lifetime, never re-suggest
when the loaded model actually changes. Once suggested, the user's own selection is never
silently overwritten — toggling an NN block's "trained" state or remapping a target
afterward does not re-trigger the suggestion.

`"adjoint"` and `"lm-jacobian"` share the same v1 restriction (both need a _second_
generated gradient/Jacobian graph over `derived_fn`'s own expression tree to support a
derived-quantity target, which doesn't exist yet — `adjoint_wrapper.c`'s and
`jacobian_wrapper.c`'s own doc comments in `mxlweb-core`) — `buildFitConfig()` rejects
picking either with a derived-quantity target mapped, independent of whether an NN block
is even involved (both backends work over any fit-parameter set, mechanistic included).
Extending `jacobianWat` (and by the same mechanism, `adjointWat`) to support derived
targets is expected to be straightforward — mirrors the existing state-target graph, just
built over a different expression tree — just not done yet.

### 2.4 Backend-agnostic progress display

`fitStore.ts`/`Fit.svelte` render `FitProgress`/`FitStopReason` (defined in
`mxlweb-core`, ADR 0008 §2.4) without needing to know which backend produced them:
`gradNorm` is simply absent under `"lm"`, and `"converged_step"` never appears under
`"adjoint"`.

### 2.5 The optimizer's per-chunk budget and the UI's progress-display cadence are separate concerns (amended)

Originally a single field, `chunkMaxfev` ("Function evaluations per progress update" in
the settings table), served two unrelated purposes at once: how much budget
`fit_chunk`/`jacobian_chunk` got per call, _and_ how often the chart/preview refreshed.
That conflation is a real bug, not just a naming issue: `fit_chunk`/`jacobian_chunk`
cold-restart their trust region from scratch on every external call (fresh `diag`, fresh
`delta = factor*xnorm`, ADR 0004 §2.7's own chunking design), so a small chunk isn't just
"less-frequent updates" — for `"lm"`/`"lm-jacobian"` it can mean _no progress is possible
at all_. Confirmed on the UDE showcase's own default 25-parameter fit: the flat default
of 5 made `"lm"` fail outright (never clears `fit_chunk`'s own `budgetLeft > n` guard,
since `lmdif`'s own `fdjac2` needs `n` extra evals per outer iteration just for its
finite-difference Jacobian) and stalled `"lm-jacobian"` flat (5 evals/chunk starves the
trust region of room to make real progress before the next chunk resets it) — a user who
only wanted smoother-looking plot updates could accidentally break the fit by setting
this "cosmetic" field too low.

Split into two, both in `Fit.svelte` and both showcase forks:

- `chunkMaxfev` — the actual budget sent to `session.chunk()`, `$derived` (not
  `$state`) directly from the live fit-parameter count
  (`Math.max(5, totalFitParamCount + 20)`, same uncalibrated-margin caveat as §2.3's
  `SMALL_NN_BLOCK_PARAM_THRESHOLD`). No longer user-facing at all — unlike
  `backendChoice`, there's no legitimate reason to override it: smaller risks the same
  failure mode that motivated this split, and larger has no downside worth trading off
  against, so a live-tracking `$derived` is strictly better than a one-time suggestion a
  user could accidentally shrink.
- `progressUpdateInterval` — the settings-table field that used to be `chunkMaxfev`,
  now purely cosmetic, defaulting to the original flat 5, sent to the worker as
  `FitInitRequest.progressUpdateInterval`.

**First attempt (superseded): a client-side display throttle.** The initial fix kept
`progressUpdateInterval` client-only, throttling `residualHistory`/`previewTrajectory`
updates to "at least every N evals since the last redraw." This didn't work: raw
`FitProgress` events only ever arrived once per `chunkMaxfev`-sized chunk (now ~45 evals
for a typical fit), so a throttle — which can only make updates _less_ frequent than its
input, never more — left the UI redrawing at whatever cadence chunks happened to
complete, silently ignoring a user-set `progressUpdateInterval` of 5. Worse, it was
actively misleading: the field reads as "the plot updates every N evals," but it might
update only once per 10x that.

**Actual fix: a genuine mid-chunk progress callback from inside the C driver's own
evaluation loop.** Each of the three drivers (`fit_wrapper.c`'s `fit_fcn`,
`jacobian_wrapper.c`'s `jacobian_fcn`, `adjoint_wrapper.c`'s `adjoint_chunk`) now takes a
`progress_interval` in its `*_init` call and tracks its own `chunk_nfev` (evals/steps so
far in the _currently executing_ chunk, reset to 0 at the start of every `*_chunk` call —
deliberately separate from `chunkMaxfev`'s own, much coarser, correctness-mandated
budget). Every `progress_interval`-th evaluation, it invokes a JS callback
(`fit_set_progress_fn`/`jacobian_set_progress_fn`/`adjoint_set_progress_fn`, an
Emscripten `addFunction` table slot, registered once per worker lifetime in
`fitWorker.ts` since it's stateless) synchronously, _from inside_ the blocking
`_fit_chunk`/`_jacobian_chunk`/`_adjoint_chunk` WASM call — the same reentrant
JS↔WASM pattern `previewTrajectory` already relies on one layer up
(`onProgress` calling back into the WASM module), just one layer deeper here.
`fitWorker.ts` reports these as ordinary `FitProgress` messages with a new
`intermediate: true` flag, always paired with `done: false` and no `reason`/`err`.

Client code (`Fit.svelte` and both showcase forks) branches on `progress.intermediate`:
every tick (intermediate or not) updates `nfev`/`residualNorm`/`fittedValues`/
`residualHistory`/the trajectory preview unconditionally — no throttle needed any more,
since the interval is now enforced at the source — but only a _non_-intermediate tick
(an actual chunk completion) runs the patience/stall-tracking and
continue-vs-stop decision, so `FIT_PATIENCE_CHUNKS` and ADR 0004 §2.7's per-chunk
cancelability are exactly as before: unaffected by how many intermediate ticks landed
in between.

## 3. Rationale

Reuses ADR 0004's existing `FitParameterConfig`/parameter-table machinery everywhere it
still applies (§2.1), and keeps the block-authoring UI a single dedicated surface (§2.2)
rather than forcing ≈20,800 weights through a UI designed for a human to hand-tune a
few dozen mechanistic constants. Backend choice (§2.3) was originally invisible to the
end user by design; now that there are two realistic NN-capable backends with a genuine
speed/robustness trade-off instead of one obvious default, that stopped being tenable —
exposing it (with a sensible per-model suggestion pre-filled) lets users who care compare
backends directly, while anyone who doesn't just keeps the suggested one.

## 4. Consequences / Open Questions

- **The measured-cost auto-selection heuristic is not implemented.** The original design
  called for: in the no-active-NN-block case, measure one forward solve's wall-clock
  cost (already computed for `initialResidualNorm`, ADR 0004 §2.11), multiply by the
  fitted-parameter count, and compare against a time budget (placeholder ~200ms,
  deliberately uncalibrated) to decide between `"lm"` and `"adjoint"` for a purely
  mechanistic model with many fitted kinetic parameters. `Fit.svelte` currently only
  implements §2.3's simpler rule; a purely mechanistic fit always gets `"lm"` regardless
  of how many parameters are fitted. Needs real PETC/PAM models to calibrate against
  before implementing, not a guess. Still true for the purely-mechanistic case — §2.3's
  amendment only covers the NN-block branch.
- **`SMALL_NN_BLOCK_PARAM_THRESHOLD` (§2.3, currently 50) is an equally uncalibrated
  placeholder**, chosen only to comfortably cover this session's one proven case (~20
  params) while staying orders of magnitude below §2.3's original "obviously
  intractable" example (a 6×64 block's ≈20,800 weights). Since the backend is now a
  user-overridable suggestion rather than a forced decision, a wrong guess here is much
  lower-stakes than it would have been under the old design — but it still needs real
  models of varying block size to calibrate properly.
- **`jacobianWat`/`adjointWat`'s derived-target restriction (§2.3) is expected to be
  straightforward to lift** — noted as a near-term follow-up, not done yet.
- **`buildJacobianGraph`'s stack-overflow bug (§2.3) is fixed** (`dfDy[k][m]` now shares a
  named intermediate instead of being re-embedded `n_theta` times) — but the suggestion
  rule still avoids `"lm-jacobian"` for a mechanistic-parameter-plus-NN-block fit, since
  fixing the crash didn't establish it's actually a _good_ default there (§2.3's own
  anecdotal counter-evidence). Revisit once there's a real comparison, not a guess.
- `mxlweb-core`'s own analytic-Jacobian LM addition (`jacobian_wrapper.c`, `lmder.c`,
  `buildJacobianGraph`/`irToJacobianWat` in `modelIr.ts`) has no ADR of its own yet —
  only doc comments in the source. Worth writing up there if it grows further.
- See `mxlweb-core`'s ADR 0008 for the algorithmic design (NN-block generation,
  `pushGradient`, the continuous-adjoint driver) and its own open questions (Hermite
  interpolation accuracy, shared augmented-state tolerance, v1's state-targets-only
  restriction).
