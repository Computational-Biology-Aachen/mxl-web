---
name: mxl-web
description: Browser-side ODE model explorer for CPBL's published photosynthesis/plant-biology models
colors:
  instrument-slate-border: "#e5e7eb"
  instrument-slate-muted: "#6b7280"
  instrument-slate-heading: "#374151"
  instrument-slate-text: "#4b5563"
  node-leaf-bg: "#e2e8f0"
  node-leaf-text: "#1f2937"
  color-danger: "rgb(204, 7, 30)"
  color-warning: "#e07b00"
  slate-300: "rgb(203, 213, 225)"
  slate-600: "rgb(71, 85, 105)"
  categorical-steel-blue: "#4e79a7"
  categorical-amber: "#f28e2b"
  categorical-brick: "#e15759"
  categorical-seafoam: "#76b7b2"
  categorical-moss: "#59a14f"
  categorical-mustard: "#edc948"
  categorical-mauve: "#b07aa1"
  categorical-blush: "#ff9da7"
  categorical-tan: "#9c755f"
  categorical-stone: "#bab0ac"
  outcome-collapse: "#d3d3d3"
  outcome-public: "#008000"
  outcome-cheater: "#000000"
  outcome-private: "#ffa500"
  outcome-coexistence: "#4169e1"
  outcome-unstable: "#708090"
components:
  eq-window-header:
    backgroundColor: "{colors.instrument-slate-heading}"
    textColor: "#ffffff"
    typography: "label"
    padding: "0.75rem 1rem"
  node-leaf:
    backgroundColor: "{colors.node-leaf-bg}"
    textColor: "{colors.node-leaf-text}"
    rounded: "full"
    padding: "0.35rem 0.55rem"
  table-header:
    backgroundColor: "{colors.instrument-slate-border}"
    padding: "1rem 1.5rem"
---

# Design System: mxl-web

<!-- This file documents ONLY what is specific to mxl-web. The base visual
system — palette, typography, spacing, shadows, motion, and shared components
(Navbar, NavItem, Button, Section, Card, LineChart/SimChart, etc.) — is owned
by @computational-biology-aachen/design and is NOT redefined here. See
pkg-js/design/DESIGN.md (and its PRODUCT.md) in the meta-repo for that layer.
ADR 0003 in this repo (docs/adrs/0003-shared-design-package.md) records the
decision to build on that package rather than fork it locally: "Site-specific
styling should build on top of design's tokens/components, not duplicate or
fork them locally." -->

## Overview

**Creative North Star: "The Circuit Board"**

Underneath CPBL's inherited "Journal Figure" system — flat, petrol-and-neutral, one accent used sparingly — mxl-web adds a second, site-specific register for the parts of the product that are genuinely its own: the equation builder, the node-based expression tree, and the parameter/reaction tables. These surfaces read like a breadboard, not a page: discrete rectangular nodes wired into equations, snapped together and pulled apart by drag; selection and drop-target states behave like connections lighting up (a soft petrol tint fill plus a solid or dashed petrol border) rather than a page element being "selected" in the editorial sense. The "window" chrome around the builder and preview panes (a labeled title bar over a bordered panel) borrows the vocabulary of a instrument panel or IDE, not a document.

This register never touches color, type, or the shared components the design package owns — it only governs the model-building/data-table surfaces layered on top. Confirmed anti-reference: no skeuomorphic circuit-board decoration (no literal PCB traces, connector icons, or copper texture) — "circuit board" is the interaction logic (nodes, connections, snapping, wiring), not surface imagery.

**Key Characteristics:**

- Equation nodes behave like breadboard components: square operator glyphs, rectangular operand cards, drag-to-rearrange, petrol-tinted selection/drop-target halos.
- A neutral "Instrument Slate" gray family (distinct from the design system's own muted text color) carries table headers, borders, and secondary labels across every editor/table surface.
- Panels are framed as labeled "windows" (title bar + body), not bare cards.
- A second, wider "Extended Series" categorical palette exists specifically for ensemble/multi-member fit charts, where more than the design system's 4 ordered chart colors are unavoidable.

## Colors

Base palette (Deep Petrol primary, Signal Orange accent, the 4-color ordered chart palette, all neutrals) is inherited unchanged from `@computational-biology-aachen/design`; see that package's DESIGN.md for those roles. Only mxl-web-specific additions are listed below.

### Instrument Slate (editor/table chrome — local extension)

- **Instrument Slate Border** (`#e5e7eb`): table header fill, card-action dividers, hairline borders across `Table*.svelte` and `EqEditor.svelte`.
- **Instrument Slate Muted** (`#6b7280`): secondary labels, hint text, palette-group labels, parenthesis/comma glyphs in the equation tree.
- **Instrument Slate Heading** (`#374151`): hover state for group labels, form `<label>` text, and the equation-window title bar background.
- **Instrument Slate Text** (`#4b5563`): body copy inside the equation palette (hints, comments, badges).

### Node Leaf (equation-tree local extension)

- **Node Leaf Fill** (`#e2e8f0`) / **Node Leaf Text** (`#1f2937`): the pill-shaped variable/parameter chip at the leaves of the equation tree (`EqNode.svelte`) — the one place a slate-blue chip look appears instead of Instrument Slate gray or a design-system token.

### Semantic tokens (site-local additions, defined in `src/app.css`)

`@computational-biology-aachen/design` does not export danger/warning colors, and only three steps of its own `--slate-*` scale (`--slate-50/400/500`). mxl-web fills both gaps once, in `app.css`, instead of leaving every consumer to hardcode its own literal:

- **`--color-danger`** (`rgb(204, 7, 30)`, the design package's own RWTH red — see `--rwth-red` in its `tokens.css`): error text and load-failure states (`AnalysesDashboard.svelte`, `Fit.svelte`, `SimErrDisplay.svelte`, and the `showcase/nde`/`showcase/ude` fit forks).
- **`--color-warning`** (`#e07b00`): non-convergence / "didn't converge" messaging (`ParameterScan.svelte`, `SteadyStateSweep.svelte`).
- **`--slate-300`** (`rgb(203, 213, 225)`) / **`--slate-600`** (`rgb(71, 85, 105)`): fill in the two additional steps `EditorTutorial.svelte` needs from the same Tailwind slate scale the design package already partially exports.

These are genuine gaps in the shared package, not mxl-web opinions — if `@computational-biology-aachen/design` ever adds its own `--color-danger`/`--color-warning`/full slate scale, drop the local `:root` block in `app.css` and let the import from the package win.

### Extended Series (ensemble-fit chart palette — local extension, named exception)

A second, 10-color categorical palette used only in `Fit.svelte`'s ensemble mode (mean/std band + per-member convergence lines, ADR 0006 §2.6), where a target's band and each member's line need a stable, explicit per-index color that the design system's 4-color ordered chart palette can't cover:
Steel Blue `#4e79a7`, Amber `#f28e2b`, Brick `#e15759`, Seafoam `#76b7b2`, Moss `#59a14f`, Mustard `#edc948`, Mauve `#b07aa1`, Blush `#ff9da7`, Tan `#9c755f`, Stone `#bab0ac`.

**The Chart-Palette-Stays-Scoped Rule.** The design system's 4-color ordered chart palette (petrol/violet/blue/magenta) is for ordinary simulation charts (`LineChart`/`SimChart`). Extended Series is reserved for `Fit.svelte`'s ensemble views specifically — never mix the two palettes on one chart, and never use Extended Series outside ensemble fitting.

### Categorical Outcome Series (discrete-heatmap palette — local extension)

A third, purpose-built categorical palette for `CategoricalHeatmap.svelte` (a reusable discrete/`imshow`-style grid chart, distinct from `LineChart`/`SimChart`'s continuous time-series charts and from Extended Series' per-member line charts) — currently consumed by `tripartite-ph`'s `OutcomeHeatmap.svelte` to color its six ecological-outcome categories, matching the source notebook's own `matplotlib` `ListedColormap`:
Collapse `#d3d3d3`, Public `#008000`, Cheater `#000000`, Private `#ffa500`, Coexistence `#4169e1`, Unstable `#708090`.

Scoped the same way Extended Series is: reach for this palette only when building another categorical/discrete-grid chart on `CategoricalHeatmap`, never for an ordinary line chart or an ensemble view.

### Known inconsistencies (record accurately, do not repeat)

- **`--color-surface` used where text/border needs to be visible, not white — one instance remains, confined to `dev/`.** `src/routes/dev/+page.svelte` still sets `color: var(--color-surface)` (white on white). The equivalent bugs in `AnalysesDashboard.svelte`'s `.picker-option:hover` and `EqEditor.svelte`'s `.palette-button:hover` are fixed (both now use `var(--color-primary)`, matching every other hover accent in the codebase). `dev/*` is exempt from the public polish bar (see PRODUCT.md), so this one is left as a known, low-priority paper cut rather than fixed opportunistically.
- **An undocumented "second gray scale" of one-off utility grays.** `#888`/`#666`/`#f5f5f5`/`#c00` (`PamScanEditor.svelte`), `#888` (`ParameterScan.svelte`, `ParameterScanEditor.svelte`, `SteadyStateSweepEditor.svelte`, `TimeCourseEditor.svelte`), `#f9fafb`/`#111827` (`EqEditor.svelte`'s palette buttons), `#fafafa` (`EqNode.svelte`'s node-card background), and assorted `rgba(0, 0, 0, N%)` de-emphasis/shadow literals (`LineChart.svelte`, `routes/+page.svelte`) don't match Instrument Slate, Node Leaf, or any design-package token. None of these are wrong on their own (they're all plausible muted-text/disabled/shadow choices), but none are named or deliberate either — recorded here so they're tracked drift rather than invisible drift. Before adding a new one, check whether an existing Instrument Slate or semantic-token value already does the same job.

## Typography

Inherited unchanged from `@computational-biology-aachen/design`: Space Grotesk across display/headline/title/body/label roles, bold headings, 400/500 body/label weights. mxl-web adds no new typeface or role.

The one departure is unavoidable rather than stylistic: KaTeX renders all rendered mathematics (equation previews, MathML output) in its own math font stack, not Space Grotesk — this is a hard constraint of math typesetting, not a design choice, and should not be treated as license to introduce other secondary fonts.

## Layout

Editor/table surfaces are composed as vertical stacks of "window" panels and card grids, following the design system's Section-band composition at the page level. Internal spacing in `Table*.svelte`/`EqEditor.svelte`/`EqNode.svelte` is written as literal rem values rather than `var(--space-*)`, but the values used (`0.35rem`, `0.5rem`, `0.75rem`, `1rem`, `1.5rem`) consistently land on the design system's spacing scale (`--space-1` through `--space-6`) — reuse those literals for consistency with the existing surfaces rather than introducing new steps, or prefer the token when writing new code.

The equation-node tree is responsive by re-flowing structure, not by shrinking it: below 640px (the design system's `--sm` breakpoint) each operator's operands stack vertically into an indented outline with a petrol guide rail on the selected node's branch, and inline grouping punctuation (parens, commas) is dropped as redundant once operands are stacked.

## Elevation & Depth

Every editor/table surface now lifts with a real token: `Table*.svelte` cards, `EqEditor.svelte`'s `.window`, `EditorTutorial.svelte`'s tour card, `AnalysesDashboard.svelte`'s `.grid-row`, `SteadyStateDashboard.svelte`, and `+error.svelte` all use `box-shadow: var(--shadow-sm)`. `EqNode.svelte`'s node card follows the same baseline, then steps up to `var(--shadow-md)` on `[data-selected="true"]`, giving selection a real depth cue instead of only a border/tint change.

This replaces a previously-shipped bug worth remembering when reviewing old diffs or other sites built on this package: all of the above used to write `box-shadow: var(--shadow)`, a token name that was never defined in `@computational-biology-aachen/design` (only `--shadow-sm`, `--shadow-md`, and `--shadow-primary` exist there) and so silently rendered flat. `src/routes/dev/+page.svelte` still has one leftover instance — `dev/*` is exempt from the public polish bar (see PRODUCT.md).

`BuildChooser.svelte`'s `.model-card` remains the reference for a hover-lift treatment: `box-shadow: var(--shadow-sm)` at rest, `var(--shadow-primary)` plus a `translateY(-3px)` lift on hover.

### Named Rules

**The Real-Token Rule.** Never write `box-shadow: var(--shadow)`. Use `--shadow-sm`, `--shadow-md`, or `--shadow-primary` from the design package — those are the only elevation tokens that actually exist.

## Motion

Inherited transition timings (120–200ms ease) are unchanged from the design package's own components. mxl-web-local motion respects `prefers-reduced-motion: reduce`:

- **Hover lifts** (`BuildChooser.svelte`'s `.model-card`, `EqEditor.svelte`'s `.palette-button`): the `translateY` drops out under reduced motion; the shadow/border-color feedback stays, so hover is still legible without spatial movement.
- **`EditorTutorial.svelte`'s spotlight**: its top/left/width/height transition is disabled under reduced motion, so the highlight jumps straight to the next tour target instead of sliding — position and size still update, only the animation is removed.
- **Loading spinners** (`LineChart.svelte`, `ParameterScan.svelte`): the infinite `spin` rotation swaps for an opacity `pulse` under reduced motion — "still loading" stays legible without a continuously rotating element.

## Shapes

Inherited radius scale (`--radius-sm/md/lg/full`) is used consistently: `1rem`/`var(--radius-lg)` for cards, windows, inputs, and the equation-node operand box; `var(--radius-full)` for the leaf chip and round controls; table corners round only on the outermost cells (first/last `th`/`td`), not every cell. No new corner or border language is introduced beyond the design system's.

## Components

### Data Table / Parameter Card

The shared pattern across every `Table*.svelte` (Parameters, Variables, Reactions, Differentials, Readout, Assignment, NNBlocks): a `<table>` on wide screens (header row filled with Instrument Slate Border `#e5e7eb`, bold uppercase 0.75rem labels, outer-corner radius only) that collapses to a stack of bordered `.card`s with the same content as label/value rows on narrow screens. Row hover uses `lch(from var(--color-surface) calc(l - 5) c h)` — a relative-color darken of the surface token rather than a separate hover token. Card/section labels use Instrument Slate Muted (`#6b7280`), uppercase, 0.75rem, bold. Every raw `<input>` in these tables (the Name/Tex name columns, plus `TableNNBlocks.svelte`'s numeric fields) carries an `aria-label` matching its column header — a screen reader would otherwise announce every cell as bare "edit text" with no way to tell Name from Tex name from Initial value.

### Equation Builder Window

- **Shape:** `.window` is a bordered, `var(--radius-lg)` panel with a title bar (`.window-header`, Instrument Slate Heading background, white bold label) over a padded body — the "instrument panel" framing for the builder canvas and the live preview pane.
- **Palette buttons:** the operator/function picker is a grid of bordered cards (`#f9fafb` fill) that lift 2px and gain a soft ad hoc shadow (`0 6px 16px rgba(0,0,0,0.08)`, not a design-system shadow token) on hover; disabled entries drop to 45% opacity with no lift.

### Equation Node (signature component)

The recursive expression-tree renderer (`EqNode.svelte`) is mxl-web's most distinctive UI: each node is a draggable, bordered card (`var(--radius-lg)`, `var(--shadow-sm)`, see Elevation) with a square operator glyph (`.op`, petrol text on a bordered surface square, `2.75rem` square — a 44px touch target) at its head.

- **Selected** (`data-selected="true"`): petrol border + an 8%-alpha petrol background tint (`rgb(from var(--color-primary) r g b / 8%)`) + `var(--shadow-md)`.
- **Drop target** (`data-drop-target="true"`): dashed petrol border + a stronger 15%-alpha petrol tint — visually distinct from a plain selection.
- **Dragging** (`data-dragging="true"`): 40% opacity.
- **Leaf chip:** variables/parameters render as a rounded pill (`node-leaf-bg` #e2e8f0 / `node-leaf-text` #1f2937) — the one place this component uses a slate-blue chip instead of Instrument Slate gray.
- Structural glyphs (parens, commas, the piecewise "if" label) use Instrument Slate Muted, not full-strength text color, so they read as connective tissue rather than content.
- **Keyboard path:** the node card is `role="button" tabindex="0"` with an `aria-label` naming the node and its current state. Enter/Space selects it (mirroring the mouse click already wired to the same handler). `Ctrl`/`Cmd`+`X` marks a node as cut (same state as picking it up with the mouse — `data-dragging`); `Ctrl`/`Cmd`+`V` on a focused, valid destination drops it there (`data-drop-target` lights up identically to a mouse drag-over); `Escape` cancels a pending cut. This is the only way a keyboard-only user can select a leaf (`Name`/`Num`) node or reorder the tree at all — mouse-only drag/drop has no other equivalent.

### Fit / Ensemble Chart

`Fit.svelte`'s live-updating prediction/residual charts use a **local fork** of the design system's `LineChart` (documented in the component's own header comment and this file's Colors section), kept specifically because the upstream component recreates its whole Chart.js instance on every data update, which visibly jarred a running fit's charts; the fork updates the existing instance in place instead. This fork is intentionally scoped to `mxl-web` rather than upstreamed until the behavior change is confirmed safe for every other `LineChart` consumer. Ensemble mode's multi-series charts use the Extended Series palette (see Colors) via a stable `paletteColor(i)` lookup, so a target's band and its members never desync color across re-renders.

### Site Shell

The navbar, footer/imprint, and page chrome are composed entirely from design-system components (`Navbar`, `NavItem`, `CollapseToBurger`, `NavGH`, `Button`, `Imprint`, `SectionMain`) with zero local overrides — the only custom mark is the wordmark/logo lockup in the navbar brand slot, styled with `var(--color-primary)` and `var(--space-2)`, both real tokens.

## Do's and Don'ts

### Do:

- **Do** build every new mxl-web surface on `@computational-biology-aachen/design` tokens/components first (ADR 0003); reach for Instrument Slate, Node Leaf, Extended Series, or Categorical Outcome Series only for the specific editor/tree/ensemble-chart/discrete-heatmap contexts documented above.
- **Do** use the petrol selection/drop-target tint pattern (`rgb(from var(--color-primary) r g b / N%)`, solid border for selected, dashed for drop-target) for any new drag/drop or pick-state UI, to stay consistent with `EqNode`.
- **Do** use `--shadow-sm` / `--shadow-md` / `--shadow-primary` for elevation (per `BuildChooser.svelte`), following the same hover-lift shape (`translateY` or `scale`, paired with a shadow step-up).
- **Do** reuse the Extended Series palette, in order, for any future ensemble/multi-member view that needs more than 4 simultaneous series; keep it out of single-run charts.
- **Do** give any new hover-lift, spotlight/positional animation, or looping indicator a `prefers-reduced-motion: reduce` alternative that keeps the state feedback and drops only the spatial motion (see Motion).

### Don't:

- **Don't** write `box-shadow: var(--shadow)` — it is not a defined token and silently renders flat. Use `--shadow-sm`/`--shadow-md`/`--shadow-primary` instead (see Elevation & Depth).
- **Don't** set `color` or `border-color` to `var(--color-surface)` for anything that needs to stay legible — it resolves to white. Use `var(--color-primary)` for hover accents instead, matching every other hover state in the codebase. (One known instance remains, confined to the polish-exempt `dev/+page.svelte` — see Known inconsistencies.)
- **Don't** use a raw hex literal for error/warning states — use `--color-danger`/`--color-warning` (site-local tokens defined in `app.css`, see Colors).
- **Don't** add a new one-off gray without checking Instrument Slate and the semantic tokens first — see the "second gray scale" note under Known inconsistencies before reaching for another literal.
- **Don't** wire up a click-only interaction (drag, select, reorder) without a keyboard equivalent — `EqNode.svelte`'s cut/paste keyboard path (see Components) is the reference for retrofitting one onto an existing mouse-only pattern.
- **Don't** mix the Extended Series palette into ordinary `LineChart`/`SimChart` series, or the design system's 4-color chart palette into ensemble views — they're scoped to different chart types.
- **Don't** fork or restyle a design-system component locally without the same explicit, documented rationale `LineChart`'s fork carries (a stated upstream limitation, a scoping reason, and a note on when it should be upstreamed instead).
