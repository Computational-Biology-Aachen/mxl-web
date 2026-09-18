---
target: "Equation/model builder (models/new: kinetic/ode/steady-state)"
total_score: 21
max_score: 40
na_heuristics:
p0_count: 1
p1_count: 3
target_identity: "file:/home/marvin/git/0-admin/pages/mxl-web/src/routes/models/new"
timestamp: 2026-09-18T05-20-34Z
slug: src-routes-models-new
---

Method: dual-agent (A: design-review sub-agent · B: detector+browser-evidence sub-agent)

**Fix pass update (2026-09-18):** 3 of 5 Priority Issues fixed and verified live (P0 mobile palette, both P1s on the placeholder/tab-stops). The Escape P1 did not reproduce under direct live testing — no fix applied. The P2 toolbar-ordering issue was traced to a shared, site-wide component (`AnalysesDashboard.svelte`) and deferred as out of scope for this surface. See per-issue _Outcome_ notes under Priority Issues below.

## Design Health Score

| #   | Heuristic                       | Score | Key Issue                                                                                                                                              |
| --- | ------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Visibility of System Status     | 3     | Live KaTeX preview and dynamic `aria-label` hints are strong; mobile buries the canvas below the palette                                               |
| 2   | Match System / Real World       | 3     | LaTeX/math notation fits a scientist audience                                                                                                          |
| 3   | User Control and Freedom        | 1     | Escape closes the _entire_ nested-popover stack, not just the innermost editor — confirmed live                                                        |
| 4   | Consistency and Standards       | 2     | `Mul` renders a literal "x" glyph while `Nary` uses proper ∧/∨/≥ symbols; three nested popovers each have their own identically-labeled "Save"         |
| 5   | Error Prevention                | 1     | Cut/drop silently backfills the vacated slot with an unlabeled `default()` placeholder styled exactly like a real variable                             |
| 6   | Recognition Rather Than Recall  | 3     | `getNodeStatusHint` gives state-aware plain-language guidance per node                                                                                 |
| 7   | Flexibility and Efficiency      | 2     | Undo/redo exists, but moving from one sibling to another inside a single `Mul` costs 3 Tab stops instead of 1 (non-leaf wrappers are all `tabindex=0`) |
| 8   | Aesthetic and Minimalist Design | 3     | Clean on desktop; palette hints ("a × b") are a nice touch                                                                                             |
| 9   | Error Recovery                  | 1     | No visible flag on the injected `default()` placeholder; no equation-level validation before Save                                                      |
| 10  | Help and Documentation          | 2     | One hint line + a Tutorial button; keyboard shortcuts aren't listed anywhere discoverable                                                              |

**Total: 21/40 — Acceptable.** Significant improvements needed before this surface is comfortable to use, especially for keyboard/mobile users.

## Design Specificity Verdict

**LLM assessment:** The equation builder is genuinely authored for this product, not a reskinned generic form-builder. `EqNode.svelte`'s square operator glyphs, rectangular leaf chips, petrol selection fill, and dashed drop-target halo directly deliver the documented "Circuit Board" brief, and `EqEditor.svelte`'s windowed chrome earns the "instrument panel" framing DESIGN.md claims. It falls short on polish, not concept — undocumented one-off grays and an inconsistent operator-glyph system (`Mul`'s literal "x" vs. `Nary`'s proper logic/comparison symbols) chip away at the otherwise distinctive execution.

**Deterministic scan:** `impeccable detect` ran clean (exit 0) with 5 advisory `design-system-color` findings, all pre-existing, undocumented literals already flagged in DESIGN.md's own "Known inconsistencies" section: `EqEditor.svelte:928/935/960/980` (`#f9fafb`, `rgba(0,0,0,0.08)`, `#111827`, `#fff`) and `EqNode.svelte:839` (`#fafafa`). No findings on any `Table*.svelte` or route file. These corroborate rather than surprise — DESIGN.md already tracks this exact drift.

**Visual overlays:** No live overlay was produced this run — the dev server crashed mid-session before the detect.js injection step, and a restart got Assessment B back online only after it had already returned its report. No user-visible overlay is available for this run; the CLI JSON above is the only deterministic evidence.

## Overall Impression

The Circuit Board concept is real and well-executed at the component level — this isn't generic UI. But three concrete, testable interaction bugs (Escape's blast radius, the silent `default()` placeholder, and redundant Tab stops) sit directly on the primary "build and edit a model" path, and the mobile layout puts the operator palette in front of the actual work surface. The gap here isn't taste, it's interaction correctness — the kind of thing a researcher will hit in their first five minutes and describe as "broken," not "unpolished."

## What's Working

- **`getNodeStatusHint` in `EqNode.svelte`** — state-aware, plain-language `aria-label`s ("Press Control+V to move the cut node here" vs. "Not a valid destination") are unusually deliberate accessibility craft for a from-scratch node editor.
- **Table→card responsive pattern** — all six `Table*.svelte` variants collapse consistently to labeled cards on narrow screens, each raw `<input>` carrying a matching `aria-label`.
- **The two-pane builder/preview window** — live KaTeX re-render on every edit is a genuine "it just works" moment that rewards experimentation.

## Priority Issues

**[P0] Mobile palette buries the canvas.** At 390px, the default-open "Arithmetic" group (9 buttons) plus 5 collapsed group headers fill the whole popover viewport; the actual node tree being edited sits far below the fold. A mobile user can't see what they're editing while picking an operator.
_Fix:_ Collapse "Arithmetic" by default under the design system's `--sm` breakpoint, or reorder the panel so the canvas sits above the palette.
_Suggested command:_ `/impeccable adapt`
_Outcome (2026-09-18): FIXED._ `EqEditor.svelte`'s `.editor-grid`/`.palette-groups` now carry `order: 1`/`order: 2` under `max-width: 640px`, with the palette capped to `max-height: 45vh; overflow-y: auto`. Verified live at 390px: canvas + preview render before any palette button; screenshot confirmed no scrolling needed to see the equation on open.

**[P1] Escape closes the whole modal stack, not one layer.** Reproduced live: pressing Escape inside the Eq Editor exits all the way out of Model Details, discarding the entire session context — a wildly disproportionate consequence for what should be a single-level cancel.
_Fix:_ Scope the Escape handler to the innermost open popover/dialog only.
_Suggested command:_ `/impeccable harden`
_Outcome (2026-09-18): DID NOT REPRODUCE — no fix applied._ Re-tested live via Playwright against `eq-editor-0` nested inside `model-editor` (confirmed a true light-DOM descendant): plain Escape, Escape while a toolbar button held focus, and Escape mid-cut (`draggedId !== null`, exercising `EqNode.svelte`'s own Escape-cancel handler) all closed only the topmost popover, leaving `model-editor` open in every case. The native Popover API's auto-nesting is working correctly here. The only real global Escape listener in the codebase is `EditorTutorial.svelte`'s (intentionally exits the guided tour). Original finding may have been a multi-press or tutorial-state artifact from the review agent's session; left as-is rather than adding a fix for a non-reproducing bug. Flag for re-review if a user reports this again, ideally with exact repro steps.

**[P1] Silent `default()` placeholder on cut/move.** Cutting a node backfills the vacated slot with `Name.prototype.default()`, styled identically to a real variable chip, with no warning. This is exactly the kind of silently-wrong equation the app is supposed to prevent — a model can be saved and fit against it without anyone noticing.
_Fix:_ Give the placeholder a distinct amber/dashed treatment and auto-open its Name dropdown so it demands resolution.
_Suggested command:_ `/impeccable clarify`
_Outcome (2026-09-18): FIXED._ `EqNode.svelte` now renders any `Name` node with `name === "default"` as a dashed amber "unnamed" chip (`data-placeholder="true"`, using the site's `--color-warning` token) with an updated `aria-label` ("Unresolved placeholder. Needs a variable or parameter name"). `EqEditor.svelte`'s `insertNode` now auto-selects the first such placeholder inside any freshly built node via a new `firstDefaultNameNode` helper, so the Name dropdown opens immediately on insert (not just after a cut/paste). `handleDrop`'s post-move selection was left untouched (still selects the moved node, matching user intent), relying on the new visual chip instead. Verified live: inserting "Add" produces two dashed "unnamed" chips with the first auto-selected and its Name `<select>` visible.

**[P1] Redundant keyboard tab stops.** Every `EqNode` wrapper div is independently `tabindex=0` in addition to its children, so moving between two siblings inside one `Mul` costs 3 Tabs instead of 1 — this is the one interaction Sam (keyboard-only) has no alternative to.
_Fix:_ Set `tabindex=-1` on non-leaf wrapper divs; the parent's Enter-to-select already covers what the extra tab stop does.
_Suggested command:_ `/impeccable audit`
_Outcome (2026-09-18): FIXED._ All 15 inline `.op`/`.op.fn-label` buttons in `EqNode.svelte` now carry `tabindex="-1"`; their click handlers still fire on mouse/Enter, and the parent node's existing keydown handlers (Enter to select, Ctrl+X to cut) still catch bubbled events from the button. Verified live via a focusable-elements query on a fresh `Add(default, default)` tree inside a `Mul`: the tab sequence is now [Mul wrapper] → [Add wrapper] → [placeholder 1] → [placeholder 2] → [x0], i.e. moving between sibling leaves is 1 Tab, not 2–3.

**[P2] Toolbar-before-content on mobile.** Load/Save/Fit/Reset/Edit Model render as four stacked full-width buttons above the page's own heading on mobile, pushing orienting copy off the first screen for a first-time visitor.
_Suggested command:_ `/impeccable layout`
_Outcome (2026-09-18): DEFERRED — out of scope, not fixed._ Traced to `AnalysesDashboard.svelte`: its top `Row` (breadcrumb + Load/Save/Fit/Reset/Edit model) unconditionally renders before `{@render children()}` (the route's own `<h1>`/intro), on every viewport, for every model page. This component is shared by all ~25 published model pages, not just the builder — fixing it here would be a site-wide layout change beyond the "equation/model builder" surface this critique scoped to. Left unfixed; worth a dedicated `/impeccable layout` pass on `AnalysesDashboard.svelte` itself if the site-wide ordering should change.

## Persona Red Flags

**Jordan (first-timer):** Lands on the mobile kinetic/ode route to a wall of four action buttons before any explanatory copy is visible; opens Edit Model → Reactions → the pencil icon and meets 9+ operator buttons before ever seeing the equation they're supposed to be editing.

**Sam (keyboard/screen-reader):** The documented Ctrl+X → Enter → Ctrl+V path does work end-to-end, and the dynamic status hints are excellent — but the extra non-leaf tab stops (P1 above) and the unflagged `default()` chip mean a successfully completed move can still leave an invisible correctness error with no way to detect it non-visually.

## Minor Observations

- `Mul`'s literal "x" glyph is visually confusable with an actual variable named `x` (the starter kinetic model ships `x0`/`x1`) — inconsistent with `Nary`'s proper ∧/∨/≥ symbols.
- Three nested popovers each expose their own identically-labeled "Save" button at different scopes — easy to save the wrong thing.
- The "Generated LaTeX Code" panel has no copy button despite being written for reuse.

## Questions to Consider

- If Ctrl+X/Ctrl+V is the only fully accessible reorder path, should it also become the primary _documented_ method for mouse users too, given native drag has no visible handle?
- Should cut/paste ever leave an orphaned `default()` node, or should it default to a true swap instead?
