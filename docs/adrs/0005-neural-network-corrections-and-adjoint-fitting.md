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
seeded via standard randomized init (Xavier/Glorot-style) and from then on change *only*
through fitting — never hand-edited. Fitting itself is a **per-block toggle** ("train
this block: yes/no"), not per-weight checkboxes — there's no real scenario where half a
block's weights should be frozen while the rest train. This also makes §2.1's log-space
default purely an internal-representation correctness question rather than a
UX-surfacing one, since a weight is never visible through the UI path that default
applies to.

### 2.3 Backend selection: any active NN block forces "adjoint", unconditionally

`Fit.svelte` computes `backend = nnBlockFitIdx.length > 0 ? "adjoint" : undefined` —
no cost computation needed, since a 6×64 block's ≈20,800 finite-difference forward
solves under `"lm"` are obviously intractable regardless of measured per-solve cost. A
purely mechanistic fit leaves `backend` undefined, which defaults to `"lm"` inside
`mxlweb-core`'s `fitWorker.ts`.

This is the only branch of the original backend-selection design that is implemented —
see §4.

### 2.4 Backend-agnostic progress display

`fitStore.ts`/`Fit.svelte` render `FitProgress`/`FitStopReason` (defined in
`mxlweb-core`, ADR 0008 §2.4) without needing to know which backend produced them:
`gradNorm` is simply absent under `"lm"`, and `"converged_step"` never appears under
`"adjoint"`.

## 3. Rationale

Reuses ADR 0004's existing `FitParameterConfig`/parameter-table machinery everywhere it
still applies (§2.1), and keeps the block-authoring UI a single dedicated surface (§2.2)
rather than forcing ≈20,800 weights through a UI designed for a human to hand-tune a
few dozen mechanistic constants. Backend choice (§2.3) is invisible to the end user by
design — `mxlweb`'s audience should never need to know an optimizer choice exists.

## 4. Consequences / Open Questions

- **The measured-cost auto-selection heuristic is not implemented.** The original design
  called for: in the no-active-NN-block case, measure one forward solve's wall-clock
  cost (already computed for `initialResidualNorm`, ADR 0004 §2.11), multiply by the
  fitted-parameter count, and compare against a time budget (placeholder ~200ms,
  deliberately uncalibrated) to decide between `"lm"` and `"adjoint"` for a purely
  mechanistic model with many fitted kinetic parameters. `Fit.svelte` currently only
  implements §2.3's simpler rule; a purely mechanistic fit always gets `"lm"` regardless
  of how many parameters are fitted. Needs real PETC/PAM models to calibrate against
  before implementing, not a guess.
- See `mxlweb-core`'s ADR 0008 for the algorithmic design (NN-block generation,
  `pushGradient`, the continuous-adjoint driver) and its own open questions (Hermite
  interpolation accuracy, shared augmented-state tolerance, v1's state-targets-only
  restriction).
