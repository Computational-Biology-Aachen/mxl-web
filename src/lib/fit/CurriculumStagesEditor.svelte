<!--
 @component
 Optional curriculum-learning schedule editor (see ./curriculum.ts): a
 sequence of (data cutoff, iteration budget) stages that progressively grow
 the fitted data prefix, mirroring MxlPy's jax/train.py curriculum.
 Collapsed by default — a single stage (`stages.length === 1`) is
 indistinguishable from a plain fit.

 Modeled as a single splittable, draggable bar rather than an add/remove
 table: a stage is created only by splitting an existing one (double-click,
 or the small + button — same action, pointer or keyboard), so stages can
 never end up duplicated or out of order — dragging a divider past a
 neighbor is clamped, not merely validated after the fact. A stage is
 removed only via its divider's own × button (merging its budget into its
 right neighbor, or dropping it if the right neighbor is the final stage) —
 dragging/nudging a divider close to a neighbor deliberately does *not*
 auto-merge (an earlier version did, keyed off proximity; the threshold for
 "close enough to merge" ended up wider than the drag clamp itself, so
 releasing a divider anywhere near its natural limit silently deleted the
 stage). "Split into N equal stages" replaces the whole schedule with a
 quick even starting point.

 The total step budget (`budgetScale`, the fit's own
 `maxFunctionEvaluations`) is fixed — every bar's height is its *share* of
 that fixed total, not an independent value, so growing one stage's share
 necessarily shrinks another's. Every stage but the last has a draggable
 top edge (or ArrowUp/ArrowDown when focused) that trades budget only
 against the *final* stage's share; the final stage's own bar is never
 draggable, since its share isn't a value to set — it's simply whatever's
 left after every other stage's own share (see curriculum.ts's
 `finalStageBudget`), floored at `minBudgetWarn` (or `BUDGET_MIN`) so it
 can't be squeezed away entirely. This is also why a single stage (no
 curriculum) renders identically to "one full-width bar getting the whole
 budget" — there's nothing else claiming a share of it.

 `stages` always includes the *final* stage as its last element (its own
 `cutoffT` is an `Infinity` sentinel, ignored — see curriculum.ts); its
 *stored* `maxIterations` is likewise vestigial (never read for budget
 purposes, only its derived share is) but kept around as a starting point
 for the next split.
-->
<script lang="ts">
  import { finalStageBudget, type CurriculumStage } from "./curriculum";

  let {
    stages = $bindable(),
    tEnd,
    budgetScale = 1000,
    minBudgetWarn,
  }: {
    stages: CurriculumStage[];
    /** Full data time range — the chart's x-axis and the unit a divider's
     * position/keyboard step are expressed in. */
    tEnd: number;
    /** The fixed total step budget every stage's bar is a share of — pass
     * the fit's own `maxFunctionEvaluations`. */
    budgetScale?: number;
    /** The final stage's budget floor, and the threshold below which any
     * other stage's share is flagged — pass the same floor `chunkMaxfev`
     * already enforces (LM/LM-Jacobian's minimum viable chunk size), so a
     * schedule that would silently fail under those backends (or leave the
     * final stage no room to actually converge) is visible before "Run
     * fit" is ever clicked. */
    minBudgetWarn?: number;
  } = $props();

  const BUDGET_MIN = 10;
  const BUDGET_STEP = 10;
  const EQUAL_SPLIT_COUNTS = [2, 3, 4, 5, 6];

  // The minimum width a stage can be dragged/nudged/split down to — *not*
  // also a merge-proximity threshold (a previous version conflated the
  // two: merging triggered at a wider distance than dragging could ever
  // be clamped to, so releasing a divider at its own drag limit always
  // merged it away). Removal is explicit now (removeDivider), so this only
  // has to keep segments from collapsing to zero width.
  let minGap = $derived(Math.max(tEnd * 0.03, 1e-9));
  let budgetMax = $derived(Math.max(budgetScale, BUDGET_MIN));
  // The final stage's own floor — dragging/splitting other stages can
  // never squeeze its derived share below this.
  let finalReserve = $derived(
    Math.max(minBudgetWarn ?? BUDGET_MIN, BUDGET_MIN),
  );

  function clamp(v: number, lo: number, hi: number): number {
    return Math.min(hi, Math.max(lo, v));
  }
  function budgetHeightPct(b: number): number {
    return clamp(12 + (b / budgetMax) * 82, 12, 94);
  }
  function fmtTime(t: number): string {
    return (Math.round(t * 10) / 10).toString();
  }

  type Segment = {
    start: number;
    end: number;
    maxIterations: number;
    final: boolean;
    index: number;
  };

  let segments = $derived.by((): Segment[] => {
    const sorted = [...stages].sort((a, b) => a.cutoffT - b.cutoffT);
    const finalBudget = finalStageBudget(sorted, budgetMax);
    let start = 0;
    return sorted.map((s, i) => {
      const final = i === sorted.length - 1;
      const seg: Segment = {
        start,
        end: final ? tEnd : s.cutoffT,
        maxIterations: final ? finalBudget : s.maxIterations,
        final,
        index: i,
      };
      start = seg.end;
      return seg;
    });
  });

  // ---- mutation (all against `stages`, assumed sorted by cutoffT — split
  // always inserts in position and drag/keyboard clamp against neighbors,
  // so sortedness holds without a separate re-sort step) -----------------

  function updateCutoff(i: number, t: number) {
    stages = stages.map((s, idx) => (idx === i ? { ...s, cutoffT: t } : s));
  }

  /** The most stage `i` (a non-final stage) can be dragged/nudged/split up
   * to — whatever's left of the total after every *other* non-final
   * stage's own share and the final stage's reserved floor. */
  function maxBudgetFor(i: number): number {
    const othersSum = stages.reduce(
      (sum, s, idx) =>
        idx !== i && idx !== stages.length - 1 ? sum + s.maxIterations : sum,
      0,
    );
    return Math.max(BUDGET_MIN, budgetMax - othersSum - finalReserve);
  }

  function updateBudget(i: number, b: number) {
    const clamped = clamp(b, BUDGET_MIN, maxBudgetFor(i));
    stages = stages.map((s, idx) =>
      idx === i ? { ...s, maxIterations: clamped } : s,
    );
  }

  function dividerBounds(i: number): { prev: number; next: number } {
    return {
      prev: i === 0 ? 0 : stages[i - 1].cutoffT,
      next: i === stages.length - 2 ? tEnd : stages[i + 1].cutoffT,
    };
  }

  /** Removes the divider between segment `i` and segment `i + 1`, merging
   * them — the right segment absorbs the left one's budget (its own
   * cutoff, now the merged segment's right edge, is unchanged), unless the
   * right segment is the final stage, whose own *stored* budget field
   * is unused either way — there, the departing stage's budget is simply
   * dropped rather than merged in. */
  function removeDivider(i: number) {
    const n = stages.length;
    if (i === n - 2) {
      stages = stages.filter((_, idx) => idx !== i);
    } else {
      const merged = {
        ...stages[i + 1],
        maxIterations: stages[i].maxIterations + stages[i + 1].maxIterations,
      };
      stages = [...stages.slice(0, i), merged, ...stages.slice(i + 2)];
    }
  }

  /** Replaces the whole schedule with `n` equal-width stages — a quick
   * starting point instead of splitting one at a time. Each of the `n - 1`
   * non-final stages gets one share of `budgetMax / (n + 1)`; the final
   * stage gets two shares (its own stored value is vestigial — its real
   * budget is always the derived remainder, which comes out to exactly
   * `2 * unit` here since `(n - 1) * unit + 2 * unit = (n + 1) * unit =
   * budgetMax`). The final stage getting double the others' share isn't
   * arbitrary: it's the stage actually expected to reach convergence on
   * the full dataset, so it should have more room than any single warm-up
   * stage before it. */
  function splitIntoEqualChunks(n: number) {
    const unit = Math.max(BUDGET_MIN, Math.floor(budgetMax / (n + 1)));
    const newStages: CurriculumStage[] = [];
    for (let k = 1; k < n; k++) {
      newStages.push({ cutoffT: (tEnd * k) / n, maxIterations: unit });
    }
    newStages.push({ cutoffT: Infinity, maxIterations: unit * 2 });
    stages = newStages;
  }

  function splitSegment(seg: Segment, atTime: number) {
    if (seg.end - seg.start <= 2 * minGap) return; // too narrow to split further
    const t = clamp(atTime, seg.start + minGap, seg.end - minGap);
    if (seg.final) {
      // Draws from the final stage's own *current* derived budget, same as
      // splitting any other segment — the total never grows from a split,
      // it only gets divided further.
      const half = Math.max(BUDGET_MIN, Math.round(seg.maxIterations / 2));
      stages = [
        ...stages.slice(0, stages.length - 1),
        { cutoffT: t, maxIterations: half },
        stages[stages.length - 1],
      ];
    } else {
      const current = stages[seg.index];
      const half = Math.max(BUDGET_MIN, Math.round(current.maxIterations / 2));
      const rest = Math.max(BUDGET_MIN, current.maxIterations - half);
      stages = [
        ...stages.slice(0, seg.index),
        { cutoffT: t, maxIterations: half },
        { ...current, maxIterations: rest },
        ...stages.slice(seg.index + 1),
      ];
    }
  }

  // ---- pointer + keyboard interaction -----------------------------------

  let chartEl: HTMLDivElement | undefined;

  function timeFromClientX(clientX: number): number {
    if (!chartEl) return 0;
    const rect = chartEl.getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width, 0, 1) * tEnd;
  }
  function budgetFromClientY(clientY: number): number {
    if (!chartEl) return BUDGET_MIN;
    const rect = chartEl.getBoundingClientRect();
    const f = clamp((rect.bottom - clientY) / rect.height, 0, 1);
    return Math.round(
      clamp(((f - 0.12) / 0.82) * budgetMax, BUDGET_MIN, budgetMax),
    );
  }

  function startDividerDrag(e: PointerEvent, i: number) {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    const { prev, next } = dividerBounds(i);
    function move(ev: PointerEvent) {
      updateCutoff(
        i,
        clamp(timeFromClientX(ev.clientX), prev + minGap, next - minGap),
      );
    }
    function up() {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    }
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  }

  function onDividerKeydown(e: KeyboardEvent, i: number) {
    const { prev, next } = dividerBounds(i);
    const step = Math.max(tEnd * 0.02, 1e-9);
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      updateCutoff(
        i,
        clamp(stages[i].cutoffT - step, prev + minGap, next - minGap),
      );
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      updateCutoff(
        i,
        clamp(stages[i].cutoffT + step, prev + minGap, next - minGap),
      );
    } else if (e.key === "Home") {
      e.preventDefault();
      updateCutoff(i, prev + minGap);
    } else if (e.key === "End") {
      e.preventDefault();
      updateCutoff(i, next - minGap);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      removeDivider(i);
    }
  }

  function startBarDrag(e: PointerEvent, i: number) {
    e.preventDefault();
    e.stopPropagation();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    function move(ev: PointerEvent) {
      updateBudget(i, budgetFromClientY(ev.clientY));
    }
    function up() {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    }
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
  }

  function onBarKeydown(e: KeyboardEvent, i: number) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      // updateBudget itself clamps to maxBudgetFor(i) — no need to pre-clamp
      // to budgetMax here, since the real ceiling is usually tighter.
      updateBudget(i, stages[i].maxIterations + BUDGET_STEP);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      updateBudget(
        i,
        clamp(stages[i].maxIterations - BUDGET_STEP, BUDGET_MIN, budgetMax),
      );
    }
  }

  function onSegmentDoubleClick(e: MouseEvent, seg: Segment) {
    splitSegment(seg, timeFromClientX(e.clientX));
  }
  function onSplitClick(e: MouseEvent, seg: Segment) {
    e.stopPropagation();
    splitSegment(seg, (seg.start + seg.end) / 2);
  }
</script>

<details class="curriculum-editor">
  <summary>Curriculum learning (advanced)</summary>

  <p class="legend">
    Every bar shares one fixed step budget. Drag a divider to move a cutoff,
    drag a bar's top edge (or focus it and use the arrow keys) to change its
    share — the <strong>final stage isn't draggable</strong>, it always gets
    whatever's left. Double-click a bar or use its <strong>+</strong> to split
    it, use a divider's <strong>×</strong> (or Delete/Backspace while it's focused)
    to remove it.
  </p>

  <div class="quick-split">
    <span class="quick-split-label">Split into equal stages:</span>
    {#each EQUAL_SPLIT_COUNTS as n (n)}
      <button
        type="button"
        onclick={() => splitIntoEqualChunks(n)}>{n}</button
      >
    {/each}
  </div>

  <div
    class="chart"
    bind:this={chartEl}
  >
    {#if minBudgetWarn !== undefined}
      <div
        class="threshold"
        style="bottom: {budgetHeightPct(minBudgetWarn)}%"
      >
        <span>min viable</span>
      </div>
    {/if}
    {#each segments as seg (seg.final ? "final" : seg.index)}
      <div
        class="segment"
        class:final={seg.final}
        class:warn={minBudgetWarn !== undefined &&
          seg.maxIterations < minBudgetWarn}
        style="left: {(seg.start / tEnd) * 100}%; width: {((seg.end -
          seg.start) /
          tEnd) *
          100}%"
      >
        <button
          type="button"
          class="split-button"
          title="Split this stage"
          onclick={(e) => onSplitClick(e, seg)}>+</button
        >
        <div
          class="bar"
          style="height: {budgetHeightPct(seg.maxIterations)}%"
          ondblclick={(e) => onSegmentDoubleClick(e, seg)}
          role="button"
          tabindex="-1"
        >
          <!-- Double-click is a mouse-only shortcut for splitSegment(); the
               .split-button above is the keyboard/screen-reader equivalent,
               so this isn't a separate tab stop. -->
          <span class="budget-label"
            >{seg.maxIterations} it.{seg.final ? " (final)" : ""}</span
          >
          {#if minBudgetWarn !== undefined && seg.maxIterations < minBudgetWarn}
            <span
              class="warn-icon"
              title={seg.final
                ? "Below the reserved final-stage floor"
                : "Below the LM/LM-Jacobian backends' minimum viable chunk size"}
              >⚠</span
            >
          {/if}
          {#if !seg.final}
            <div
              class="top-handle"
              role="slider"
              tabindex="0"
              aria-label="Stage {seg.index + 1} iteration budget"
              aria-valuemin={BUDGET_MIN}
              aria-valuemax={maxBudgetFor(seg.index)}
              aria-valuenow={seg.maxIterations}
              aria-orientation="vertical"
              onpointerdown={(e) => startBarDrag(e, seg.index)}
              onkeydown={(e) => onBarKeydown(e, seg.index)}
            ></div>
          {/if}
        </div>
      </div>
    {/each}

    {#each stages.slice(0, -1) as stage, i (i)}
      <div
        class="divider"
        style="left: {(stage.cutoffT / tEnd) * 100}%"
      >
        <div
          class="divider-handle"
          role="slider"
          tabindex="0"
          aria-label="Stage {i + 1} cutoff"
          aria-valuemin="0"
          aria-valuemax={tEnd}
          aria-valuenow={stage.cutoffT}
          onpointerdown={(e) => startDividerDrag(e, i)}
          onkeydown={(e) => onDividerKeydown(e, i)}
        >
          <div class="divider-grip"></div>
        </div>
        <button
          type="button"
          class="remove-button"
          title="Remove this cutoff"
          onclick={(e) => {
            e.stopPropagation();
            removeDivider(i);
          }}>×</button
        >
      </div>
    {/each}
  </div>
  <div class="axis">
    <span style="left: 0%">t=0</span>
    {#each stages.slice(0, -1) as stage, i (i)}
      <span style="left: {(stage.cutoffT / tEnd) * 100}%"
        >t={fmtTime(stage.cutoffT)}</span
      >
    {/each}
    <span style="left: 100%">t={fmtTime(tEnd)}</span>
  </div>

  <table class="stages-readout">
    <thead>
      <tr>
        <th>Stage</th>
        <th>Data cutoff</th>
        <th>Iteration budget</th>
      </tr>
    </thead>
    <tbody>
      {#each segments as seg (seg.final ? "final" : seg.index)}
        <tr>
          <td>{seg.index + 1}{seg.final ? " (final)" : ""}</td>
          <td>{seg.final ? "full data" : `t ≤ ${fmtTime(seg.end)}`}</td>
          <td
            class:warn-cell={minBudgetWarn !== undefined &&
              seg.maxIterations < minBudgetWarn}
          >
            {seg.maxIterations} iterations{seg.final
              ? " (runs to convergence within this)"
              : ""}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</details>

<style>
  .curriculum-editor {
    font-size: 0.875rem;
  }
  .curriculum-editor summary {
    cursor: pointer;
    font-weight: var(--weight-bold);
  }
  .legend {
    margin: 0.5rem 0;
    color: var(--color-text-muted);
    font-size: 0.78rem;
  }

  .chart {
    position: relative;
    margin-top: 0.5rem;
    border-bottom: 2px solid var(--color-text-muted);
    height: 160px;
    touch-action: none;
    user-select: none;
  }
  .threshold {
    position: absolute;
    right: 0;
    left: 0;
    opacity: 0.6;
    border-top: 1px dashed var(--color-danger);
    height: 0;
  }
  .threshold span {
    position: absolute;
    right: 0;
    transform: translateY(-100%);
    color: var(--color-danger);
    font-size: 0.62rem;
  }

  .segment {
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .segment .bar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    background: var(--color-primary);
  }
  .segment.warn .bar {
    background: var(--color-danger);
  }
  .segment .bar:hover {
    filter: brightness(1.08);
  }
  .budget-label {
    position: absolute;
    top: -1.25rem;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    white-space: nowrap;
  }
  .warn-icon {
    position: absolute;
    top: -2.35rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--color-danger);
  }
  .top-handle {
    position: absolute;
    top: -0.4rem;
    right: 0;
    left: 0;
    cursor: ns-resize;
    height: 0.75rem;
  }
  .top-handle:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }
  .split-button {
    position: absolute;
    top: 0.25rem;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    z-index: 2;
    transition: opacity 120ms ease;
    cursor: pointer;
    border: none;
    border-radius: var(--radius-full, 999px);
    background: color-mix(in srgb, var(--color-text-muted) 15%, transparent);
    width: 1.1rem;
    height: 1.1rem;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    line-height: 1;
  }
  .segment:hover .split-button,
  .split-button:focus-visible {
    opacity: 1;
  }

  .divider {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    justify-content: center;
    margin-left: -0.45rem;
    width: 0.9rem;
  }
  .divider::before {
    opacity: 0.4;
    background: var(--color-text-muted);
    width: 2px;
    content: "";
  }
  .divider:hover::before,
  .divider:focus-within::before {
    opacity: 0.8;
  }
  .divider-handle {
    position: absolute;
    cursor: ew-resize;
    inset: 0;
  }
  .divider-handle:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 1px;
  }
  .divider-grip {
    position: absolute;
    top: -0.9rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    border: 2px solid white;
    border-radius: var(--radius-lg);
    background: var(--color-accent);
    width: 0.9rem;
    height: 0.9rem;
  }
  .remove-button {
    position: absolute;
    top: -1.95rem;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    z-index: 2;
    transition: opacity 120ms ease;
    cursor: pointer;
    border: none;
    border-radius: var(--radius-full, 999px);
    background: color-mix(in srgb, var(--color-danger) 15%, transparent);
    width: 1.1rem;
    height: 1.1rem;
    color: var(--color-danger);
    font-size: 0.8rem;
    line-height: 1;
  }
  .divider:hover .remove-button,
  .divider:focus-within .remove-button {
    opacity: 1;
  }

  .quick-split {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
  }
  .quick-split-label {
    color: var(--color-text-muted);
    font-size: 0.78rem;
  }
  .quick-split button {
    cursor: pointer;
    border: var(--border);
    border-radius: var(--radius-lg);
    background: transparent;
    padding: 0.15rem 0.55rem;
    font-size: 0.78rem;
  }
  .quick-split button:hover {
    border: var(--border-primary);
  }

  .axis {
    position: relative;
    margin-top: 0.25rem;
    height: 1.1rem;
  }
  .axis span {
    position: absolute;
    transform: translateX(-50%);
    color: var(--color-text-muted);
    font-size: 0.68rem;
    white-space: nowrap;
  }

  .stages-readout {
    margin-top: 0.75rem;
    border-collapse: collapse;
    width: 100%;
    text-align: left;
  }
  .stages-readout th,
  .stages-readout td {
    border-bottom: var(--border);
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  .stages-readout th {
    color: var(--color-text-muted);
    font-weight: var(--weight-bold);
    font-size: 0.65rem;
    text-transform: uppercase;
  }
  .warn-cell {
    color: var(--color-danger);
  }
</style>
