# MxlWeb: Architecture Context

Entry point for *why* this site is shaped the way it is, written ahead of a maintainer
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

## Inherited from mxlweb-core

This site does not re-decide: the no-server/all-client-side stance, the three compute
backends and their relative roles, the `.mxl.json` format, or the MathML expression
representation — all of that is `mxlweb-core`'s decision, documented in its own ADRs
and consumed here as-is.
