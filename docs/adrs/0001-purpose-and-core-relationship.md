# ADR 0001: MxlWeb's Purpose — General-Purpose Explorer and Core's Development Driver

**Status:** Implemented
**Scope:** whole site

---

## 1. Context

MxlWeb hosts ~20 models spanning many domains (Lotka-Volterra, SIR epidemiology, a
long list of photosynthesis models, population dynamics, tripartite interactions,
entrobactin dynamics). Unlike GreenSloth (see the sibling `greensloth` repo's ADRs),
MxlWeb has no model-generator pipeline (`generate-mxl.ts`, `issue-to-model.mjs`) and no
community-contribution workflow — models are added directly as part of site/feature
development.

The `mxlweb-core` README states MxlWeb "also drives the development of" `mxlweb-core`.

## 2. Decision

MxlWeb serves two roles simultaneously:

1. **General-purpose, cross-domain browser ODE model explorer** — not scoped to any one
   biological domain, unlike GreenSloth's photosynthesis focus.
2. **Primary development/integration site for `mxlweb-core`** — new core capabilities
   are built and proven out here first, with models added by hand as part of that work,
   not through a generalized content pipeline.

## 3. Rationale

Because MxlWeb's models are added as an integral part of developing `mxlweb-core`
itself (new builder features, new backends, new UI capabilities), they don't need the
safety net a generalized, externally-facing contribution pipeline provides — the person
adding a model _is_ the person who understands the current state of the core library,
unlike GreenSloth's community contributors. Building a generator/validation pipeline
here would be solving a problem MxlWeb doesn't actually have.

## 4. Consequences

- Don't propose porting GreenSloth's `generate-mxl.ts`/`issue-to-model.mjs` pipeline to
  MxlWeb by default — it solves a community-contribution problem this site doesn't have.
  If MxlWeb ever opens up to external model contributions, that's the point to revisit.
- When a new `mxlweb-core` capability needs a reference implementation/example, this is
  the site to build it in.
