# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Researchers and students exploring published plant-biology/photosynthesis ODE models (e.g. FvCB, Matuszynska NPQ, Bernacchi) one model at a time — browsing the model list, running and tweaking a given model's parameters/equations. A secondary "build your own" flow (`models/new/{kinetic,ode,steady-state}`) serves visitors constructing a model from scratch rather than only browsing curated ones. CPBL lab members also use the site as a reference/dev surface for `mxlweb-core` (per its README), but the confirmed primary audience is the model-exploring researcher/student, not internal lab tooling.

## Product Purpose

Browser-side ODE model explorer: zero-install, no server required, all computation runs client-side (pure JS, Pyodide/WASM Python, or a custom Emscripten WASM build). A visitor picks a published kinetic model, inspects/runs/tweaks it, or builds a new one, entirely in the browser.

## Positioning

Zero-install, in-browser ODE solving — no server, no local Python/R install. The site runs full mechanistic (and NDE/UDE surrogate) ODE simulation entirely client-side via three interchangeable compute backends (pure JS, Pyodide, custom WASM), a claim a typical server-backed modeling tool or notebook environment can't truthfully make.

## Operating Context

- Deployed as a static site (`adapter-static`) at `/mxl-web` under the lab's web properties.
- Each published model is its own route (`model.ts` + `+page.svelte`) generated via `misc/mxl-codegen/codegen_mxlweb.ipynb` in the meta-repo — not hand-authored per model.
- `showcase/nde` and `showcase/ude` demonstrate neural/universal differential equation surrogate fitting alongside the mechanistic models.
- `src/routes/dev/*` (editors, chart/eq/stoich tooling, a Svelte cheatsheet) are internal development/testing routes, not part of the public product surface.
- Depends on `@computational-biology-aachen/mxlweb-core` (shared model IR, MathML→WAT pipeline, the three compute backends) and `@computational-biology-aachen/design` (shared CPBL design system) as git dependencies; this site also drives `mxlweb-core`'s development per its own README.

## Capabilities and Constraints

- Three interchangeable compute backends in web workers: pure JS, Pyodide (Python/WASM), custom WASM (Emscripten, vendoring Hairer's Radau5/DOP853/DOPRI5). Explicit and implicit integrators (Euler, RK2, RK45, BOSH3, Tsit5, backward Euler, Kvaerno45).
- SvelteKit 5 (runes) + adapter-static; no server-side compute path — a hard architectural constraint (per meta-repo CLAUDE.md: "shipping Python to the browser as the primary path isn't the design").
- **Visual system is inherited, not owned here.** mxl-web consumes `@computational-biology-aachen/design` (git dependency, `pkg-js/design` in the meta-repo) for `tokens.css` and shared Svelte components (Navbar, NavItem, Button, Section, Row, Footer, Card, LineChart/SimChart, etc.). That package's own `PRODUCT.md`/`DESIGN.md` (`pkg-js/design/PRODUCT.md`, `pkg-js/design/DESIGN.md`) is the authority for palette, typography, spacing, shadows, motion, and shared-component look/behavior. When mxl-web later gets its own DESIGN.md, it should document only what's specific to this site (model-explorer layout, editors, chart composition) and defer to the design package for anything already tokenized or componentized there, rather than re-deriving it.
- Breaking API changes in `@computational-biology-aachen/design` or `mxlweb-core` propagate to this site via `sync.sh`'s lockfile re-pin — component/engine changes land here on the next sync, not opt-in per site.

## Brand Commitments

- Inherits the design package's RWTH-derived identity (Deep Petrol `rgb(0, 97, 101)` primary, Signal Orange `rgb(246, 168, 0)` accent, Space Grotesk) as a loose starting aesthetic, not a compliance requirement — see `pkg-js/design/PRODUCT.md`.
- Chart data series use the design system's fixed, ordered 4-color palette (petrol/violet/blue/magenta), reserved for `LineChart`/`SimChart` series only, never as general UI accent.

## Evidence on Hand

- ~25 published models under `src/routes/models/*` (e.g. `fvcb`, `matuszynska2016_npq`, `matuszynska2019`, `bernacchi2023`, `bellasio2019`, `poolman2000`, `lotka-volterra`, `sir`), each a working reference implementation generated from the meta-repo's `mxl-bricks`/`mxl-models` via `codegen_mxlweb.ipynb`.
- `showcase/nde` and `showcase/ude` as working references for neural/universal-DE surrogate fitting.
- No user research, analytics, or testimonials exist — internal-family academic tool, not a marketing/customer product.

## Product Principles

- Zero-install, all-client-side compute is non-negotiable — never introduce a required server-side compute path.
- Visual identity is borrowed, not invented: never fork or redefine tokens/components that `@computational-biology-aachen/design` already owns; extend that package instead of duplicating in mxl-web.
- Published model pages are generated artifacts (via `codegen_mxlweb.ipynb`), not hand-tuned per-page content — treat them as reproducible outputs, not one-off designs.
- `src/routes/dev/*` are internal tooling, exempt from the polish bar applied to the public model-explorer/showcase surface.
- `mxlweb-core` and `design` are both moving dependencies this site helps drive — changes here should stay compatible with being re-pinned lab-wide via `sync.sh`.

## Accessibility & Inclusion

WCAG AA baseline expected (public-facing academic property), consistent with the design package's stated baseline.
