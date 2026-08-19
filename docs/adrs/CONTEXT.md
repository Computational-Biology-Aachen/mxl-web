# MxlWeb: Architecture Context

Entry point for _why_ this site is shaped the way it is, written ahead of a maintainer
handoff. See the sibling `mxlweb-core` repo's `docs/adrs/CONTEXT.md` for the shared
engine this site is built on and drives development of, and `mxlpy`'s
`docs/adrs/CONTEXT.md` for the Python side of the tool family.

## What This Site Is

→ [ADR 0001 — General-purpose model explorer, and mxlweb-core's development driver](0001-purpose-and-core-relationship.md)

This is the key fact that explains an asymmetry with the sibling `greensloth` site:
MxlWeb has no model-generator or community-contribution pipeline, because its models
are added by core contributors as part of developing `mxlweb-core` itself — not
sourced from an external community. See `greensloth`'s ADRs for the contrasting case.

## Structure

→ [ADR 0002 — Route → Dashboard → Editor → WorkerManager layering](0002-route-component-architecture.md)
→ [ADR 0003 — Shared `design` package for CPBL branding](0003-shared-design-package.md)

## Features

→ [ADR 0004 — Fit model to uploaded data](0004-fit-model-to-data.md)

Spans this repo and `mxlweb-core`: fitting reuses the WASM backend's in-WASM
function-pointer pattern (vendoring `cminpack`'s `lmdif` alongside the existing
Radau5/DOP853/DOPRI5 build) rather than adding a JS-side optimization library.

→ [ADR 0005 — Neural network corrections as generated model terms, and adjoint-based fitting](0005-neural-network-corrections-and-adjoint-fitting.md)

Spans this repo and `mxlweb-core`: makes every model a potential UDE by generating neural
network blocks as ordinary expressions from existing `mathml` node types (no new AST
surface — same trick `KineticModelBuilder`'s reactions already use), adds a
continuous-adjoint sensitivity backend (reusing the existing solver for both passes,
avoiding the backsolve instability on stiff PETC/PAM models) alongside `lmdif`, and
generalizes ADR 0004's fit stopping criteria/progress reporting to be backend-agnostic.

## Inherited from mxlweb-core

This site does not re-decide: the no-server/all-client-side stance, the three compute
backends and their relative roles, the `.mxl.json` format, or the MathML expression
representation — all of that is `mxlweb-core`'s decision, documented in its own ADRs
and consumed here as-is.
