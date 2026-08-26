# ADR 0006: Ensemble Fitting

**Status:** Implemented
**Scope:** `Fit.svelte`, `stores/fitStore.ts`, `stores/backends.ts`, `random.ts`,
`index.ts` (this repo). No `mxlweb-core` changes.

---

## 1. Context

ADR 0004 fits one parameter vector from one starting point. A single `lmdif` run from
one initial guess can land in a local optimum, and gives no sense of how sensitive the
fit is to where it started. Users want an _ensemble_ fit instead: draw N starting points
from a user-specified distribution per parameter, run N independent fits, and look at
the spread of the results — a lightweight, embarrassingly-parallel substitute for a
proper Bayesian/MCMC treatment that reuses every piece of ADR 0004/0005's
machinery unchanged.

Two things ADR 0004 already provides turn out to make this cheap:

- `FitSession` (`fitStore.ts`) already gives each fit its own dedicated `Worker` — a
  single-fit concept only because `Fit.svelte` only ever created one. Nothing about it
  is inherently singular.
- `FitInitRequest`'s only per-run-varying field, across ensemble members, is `pars`
  (the initial guess). `rhsWat`/`derivedWat`/`adjointWat`/`fitIdx`/`logFlags`/targets/data
  are identical for every member of one ensemble (same model, same targets, same which
  parameters are fit) — only _where_ each member starts differs.

## 2. Decision

### 2.1 A parameter's ensemble starting point is a distribution, not a scalar

`FitParameterConfig` (this repo's own type, `index.ts`) gains an optional
`distribution?: FitDistribution` field alongside the existing `initialGuess?: number` —
not a parallel array. One `paramRows` table, one set of "fit"/"log-space" choices,
shared by both modes; the top-of-popover mode selector (§2.9) only changes what the
row's rightmost columns mean/render. Three families, `random.ts`:

- **Normal** (default): `{ mean, std }`. Default `mean` = the parameter's current live
  value, default `std` = 20% of `|mean|` (floor-clamped so it's never exactly 0) — a
  relative default, not an absolute one, because mxlbricks/mxlmodels' kinetic constants
  span many orders of magnitude (a Km of 0.001 and a Vmax of 500 need wildly different
  absolute spreads; a relative one scales for both for free).
- **Uniform**: `{ min, max }`, default `[0.5×, 2×]` the current value — same
  scale-relative reasoning.
- **Log-uniform**: `{ min, max }`, default `[0.5×, 2×]` the current value's _magnitude_
  (`|value|`, floor-clamped positive) — sign-independent, since log-uniform inherently
  needs positive bounds regardless of the parameter's own sign.

A row switching family regenerates fresh defaults from the model's current value rather
than trying to carry over the previous family's numbers — simpler than a
family-to-family conversion rule, and defensible ("switching family starts over with a
sensible default for that family").

### 2.2 Draws are seeded, not `Math.random()`

A user-editable numeric seed (`ensembleSeed`, defaulted to a random value on load, with
a "re-roll" button) drives a small deterministic PRNG (`mulberry32`, `random.ts`) — not
Web Crypto, not `Math.random()`. Reproducibility matters more here than statistical
rigor: re-running the same ensemble config should reproduce the same starting points, so
a user can compare "same draws, different `chunkMaxfev`" runs, or file a bug against a
specific draw. `random.ts` also implements Box-Muller for the normal family and the
obvious inverse-CDF draws for uniform/log-uniform.

### 2.3 Distribution family is independent of the log-space fitting toggle

Every draw — regardless of family — produces one plain linear-space scalar that becomes
that ensemble member's entry in `FitInitRequest.pars`, exactly like today's single
`initialGuess` field. The existing per-parameter "fit in log-space" checkbox
(`FitParameterConfig.logSpace`) is untouched and keeps governing only `lmdif`'s internal
reparameterization inside `fit_init`/`fit_chunk` (ADR 0004 §2.4). Log-uniform is a
convenience for expressing "start somewhere in this multiplicative range," not a signal
about optimizer space — coupling the two would need a coupling rule to explain and to
let users override; keeping them orthogonal needs neither.

### 2.4 Worker architecture: N dedicated `FitSession`s, no shared/lockstep state

`runEnsembleFit()` builds the shared `FitInitRequest` fields once (`buildFitConfig()`,
factored out of the existing single-fit `runFit()` so both modes build the exact same
`rhsWat`/`derivedWat`/`adjointWat`/`fitIdx`/`logFlags`/target/data payload from one code
path), draws N `pars` vectors, and starts N independent `FitSession`s — N real Workers,
each running its own chunked `fit_init`/`fit_chunk`/`fit_free` loop against the same
`chunkMaxfev`/`maxFunctionEvaluations`/`targetResidualNorm` settings as single-fit mode.

Members do not synchronize. Each manages its own `nfev`/chunk-budget loop exactly like
single-fit mode's one session did; one member converging early, hitting its residual
target, or erroring does not pause or accelerate any other member. This directly matches
the brief's "fits are not supposed to interact" — lockstep-syncing chunk rounds across N
workers so they'd all report progress at the same `nfev` was considered and rejected as
exactly the interaction the ensemble is meant to avoid, and as added complexity (a
rendezvous barrier every chunk) for a benefit (perfectly aligned x-axes on the
convergence chart) the per-member chart lines (§2.6) don't need.

`FitSession` instances themselves are kept in a plain (non-`$state`) array parallel to
the reactive per-member display state, deliberately — wrapping a class holding a live
`Worker` in Svelte 5's deep-reactivity proxy has no benefit (nothing reads through it
reactively) and risks surprising proxy behavior around `postMessage`/`terminate`;
single-fit mode's own `session` variable was already plain for the same reason.

### 2.5 Preview trajectories get their own pool, scoped to the ensemble run

Single-fit mode's `previewTrajectory()` posts to the shared `backends.wasmRadau5`
pool — hardcoded to size 1 (ADR 0004), fine when only one fit is ever in flight. An
ensemble needs up to N preview trajectories in flight per round of progress ticks;
serializing all of them through one worker would visibly lag the mean/std band (§2.6)
behind the fit workers themselves.

Rather than resizing the shared singleton (which `backends.ts`'s `once()` memoization
doesn't support resizing anyway, and would change single-fit mode's behavior too), a new
exported `createWasmPool(size)` in `backends.ts` builds an uncached pool. `Fit.svelte`
creates one sized `min(N, hardwareConcurrency)` when an ensemble run starts and
`terminate()`s it when every member finishes or the run is cancelled. Single-fit mode's
pool is untouched.

### 2.6 Prediction chart: mean line + shaded ±1 std band; error chart: one line per member

Per target, at each shared time grid point (every member previews against the same
`tEnd`/`nTimePoints`, so their trajectories share one time axis), compute mean and std
across surviving members' (§2.7) values and render three Chart.js line datasets: an
invisible lower-bound line (`mean − std`), an invisible upper-bound line (`mean + std`,
`fill: '-1'` to shade the region between the two, using the existing
`legend.labels.filter(item => item.text !== "")` convention — already in
`LineChart.svelte` — to keep the two boundary datasets out of the legend), and the
visible mean line on top. This is a literal mean-and-std band, not a true kernel density
estimate — computing a per-timepoint KDE and rendering it as a density-shaded gradient
(rather than a flat-opacity fill) would need a bandwidth choice and isn't something
`LineChart.svelte`'s fill-between-datasets pattern supports; "shaded" here describes the
visual style of a std band, the same thing the request's own "mean +- std" wording
already specifies precisely.

The convergence chart plots each member's own `residualHistory` as a separate dataset
(`{x: nfev, y: residualNorm}` points, not shared `labels` — members' `nfev` sequences
diverge since chunk budgets are consumed differently per member, §2.4) — no aggregation,
per the brief.

### 2.7 A member that errors is dropped, not fatal to the ensemble

If one member's `fit_init` is rejected or a chunk reports `progress.err`, that member is
marked `errored` and stops (its `FitSession` freed) — every other member keeps running
untouched. Ensemble statistics (mean/std band, per-parameter mean±std, Apply) are
computed only over surviving (non-errored) members, with a small "`k` member(s) failed
and were dropped" note. Aborting the whole ensemble on one bad draw would waste every
other member's completed work over what's often just an unlucky wide-uniform/log-uniform
sample landing somewhere numerically unstable for this model — routine, not exceptional,
for kinetic ODE models.

### 2.8 NN block training: supported, via a fresh re-seeded Glorot init per member

A trained NN block (ADR 0005) forces the adjoint backend exactly as in single-fit mode —
unconditionally, unaffected by ensemble mode. Per-weight distribution rows are not
offered (a 6×64 block has ≈20,800 weights; a `FitDistribution` selector per weight is
not a UI).

**Revision (found via a live repro against real data, see below): the first
implementation of this section was wrong.** It gave each trained block one number field
— "init perturbation std" — and drew `weight_i ~ Normal(current_weight_i, std)` for
every weight/bias *and* the block's own `scale` parameter, all from the same std. That
broke ADR 0005 §2.1's explicit "starts small" invariant for `scale`: `scale` defaults to
**0.01**, while a Glorot-initialized weight's natural magnitude — `Uniform(-limit,
limit)`, `limit = sqrt(6/(fanIn+fanOut))` — is order 1 for typical block shapes (`limit =
1.0` for the Lotka-Volterra default 2→4→2 block, confirmed live). The perturbation std's
own default (0.1) is a reasonable ~17% nudge relative to a weight's scale, but is **10×
`scale`'s own default value** — so most ensemble members drew a `scale` anywhere in
roughly `[-0.3, 0.3]`, often sign-flipped, 10–30× larger than the deliberately-tiny
default ADR 0005 relies on to keep a freshly-initialized network's correction term small
on the first fit iteration. Confirmed as the actual cause of a real failure: a single
NN-block fit against a real Lotka-Volterra dataset converged well within ~500
evaluations; the ensemble version of the same fit failed to find a sensible result even
after 7000.

The fix does not touch `scale` at all — every member's `scale` stays at whatever the
block's current live value is, identical across the whole ensemble, exactly like single-
fit mode's own un-overridden start point. Weight/bias diversity instead comes from
literally re-running the same generator that creates them in the first place:
`mxlweb-core`'s exported `buildNNBlock({ name, inputs, layers, seed, scale })` — the
exact call `ModelBuilderBase.addNNBlock` itself makes — is called once per ensemble
member per trained block, with a fresh `seed` drawn from the ensemble's own seeded rng
(`Math.floor(rng() * 2**31)`) and everything else (`inputs`/`layers`) taken from the
block's live `NNBlockConfig`. Each member ends up with its own independently
Glorot-initialized weights/biases, in exactly the same distribution a freshly-authored
block would use — not a perturbation around whatever the current (possibly
already-partially-fitted) weights happen to be. This needs no new user-facing field at
all: the ensemble's existing seed already covers reproducibility for weight init too, so
the "init perturbation std" input is gone entirely, and NN block training doesn't add any
new setting to the ensemble panel.

With no per-member weight variation, every member would start adjoint training from
bit-identical weights and (lmdif/the adjoint optimizer being deterministic, no stochastic
minibatching here) converge to identical results — an ensemble of NN-trained members
needs *some* per-member draw to be worth running at all, which is why weights still get
a fresh, independent draw even though `scale` no longer does.

### 2.9 Mode selector and results display

A `<select>` at the top of `Fit.svelte`'s popover (single fit / ensemble fit) — the
brief's specified location. Switching modes only changes: the parameter table's
rightmost two columns (initial guess + fitted value ↔ distribution editor + fitted
mean±std, §2.1), the NN-block note's own wording (§2.8), the run/progress controls, and
the two charts (§2.6). Everything else — data
upload, column mapping, target selection, which parameters are checked "fit", log-space
toggles — is shared state, untouched by the switch.

Post-fit, the "Fitted value" column always shows empirical **mean ± std** across
surviving members, regardless of which family (normal/uniform/log-uniform) seeded that
row's draws — not a family-matched summary (e.g. min/max for a uniform-seeded row).
One consistent shape needs no per-family rendering branch, and directly answers what
"Apply" does (§2.10) and what a follow-up ensemble run would want to seed a tighter
normal distribution from.

### 2.10 Applying the ensemble: mean of each parameter, gated like single-fit mode

"Apply fitted parameters" in ensemble mode writes each fitted parameter's **empirical
mean** across surviving members into `model.parameters`/`model.nnWeights` — the
ensemble's counterpart to single-fit mode's "write the current best-fit value" (ADR 0004
§2.12). Enabled as soon as **any** member has reported first progress, using the mean
over whichever members have landed so far — identical gating logic to single-fit mode's
"a cancelled or still-running fit's current values are still real, useful numbers,"
extended verbatim to "mean over whatever's landed."

### 2.11 Ensemble size and aggregate progress

`ensembleSize` (default 8, clamped to a fixed cap of 16 — a soft nod to
`hardwareConcurrency`, without querying it for the cap itself, since the cap needs to
hold even if a user later opens this on a low-core-count device with a saved/shared
config) sits in the same settings table as `chunkMaxfev`/`maxFunctionEvaluations` in
ensemble mode. The aggregate progress bar reuses single-fit mode's exact
`nfev / maxFunctionEvaluations` fraction math, just summed:
`Σ(member.nfev) / (N × maxFunctionEvaluations)`. "Running" stays true until every member
has stopped (converged, errored, or cancelled); Stop cancels every still-running member
and tears down the ensemble's preview pool (§2.5) at once. A per-member mini-progress-bar
grid was considered and rejected — more granular, but a new UI element (vs. reusing
`.progress-bar-track`/`.progress-bar-fill` as-is) that gets visually busy past
N≈8.

## 3. Rationale

Every genuinely new piece of infrastructure here is small and self-contained:
`random.ts` (seeded PRNG + three distribution samplers), one new exported pool factory
in `backends.ts`, and one new optional field on an existing type. The rest — N
`FitSession`s, N chunk loops, N preview trajectories — is the exact same ADR 0004
machinery run N times with different `pars`, which is what made this tractable as an
`mxl-web`-only change with zero `mxlweb-core` involvement.

## 4. Consequences

- Ensemble fitting spawns up to N (fit) + N (preview, capped separately at
  `hardwareConcurrency`) Workers concurrently — meaningfully more browser resource
  pressure than single-fit mode's 1+1. Bounded by `MAX_ENSEMBLE_SIZE = 16`, but a user on
  a low-core machine can still ask for 16 fit Workers; nothing currently warns them their
  device may thrash before that cap is reached.
- Per-member `nfev` sequences diverge (§2.4, §2.6), so there is no single well-defined
  "ensemble nfev" other than the sum used for the aggregate progress bar — a member that
  converges after 30 evaluations and one that needs 400 are both just "done" in the
  member-count note, with no per-member visibility beyond the convergence chart's lines.
- The mean±std band (§2.6) is computed only from members whose latest preview trajectory
  has actually landed for that round — a member that errors mid-run keeps whatever
  trajectory it last reported until it's excluded via §2.7's `errored` flag, not
  instantaneously removed from the band the instant its `FitProgress.err` arrives (the
  next band recompute after that state update excludes it, same as any other reactive
  update in this file).
- `random.ts`'s `mulberry32` is a fast, non-cryptographic PRNG chosen for reproducibility
  and simplicity, not statistical quality — adequate for spreading N starting points
  around a distribution, not intended as a general-purpose or scientific Monte Carlo
  source.
- Log-uniform's positivity requirement (§2.1) is not validated against a row whose
  current value is exactly 0 beyond the floor-clamped default — a user can still hand-type
  a degenerate `[0, 0]` range post-default, same "trust the user's number" posture ADR
  0004 §2.4 already takes for the log-space toggle's own positivity requirement.
