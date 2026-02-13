<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  let {
    children,
  }: {
    children?: Snippet;
  } = $props();

  type Box = {
    id: number;
    col: number;
    span: number;
    title: string;
  };

  type DragPreview = {
    boxId: number;
    col: number;
    row: number;
    span: number;
    kind: "width" | "move";
  };

  const GRID_COLS = 6;
  const DEFAULT_COL_SPAN = 3;

  let boxes: Array<Box[]> = $state([
    [
      {
        id: 1,
        col: 1,
        span: 3,
        title: "Analysis 1",
      },
      {
        id: 2,
        col: 4,
        span: 3,
        title: "Analysis 2",
      },
    ],
    [
      {
        id: 3,
        col: 1,
        span: 3,
        title: "Analysis 3",
      },
      {
        id: 4,
        col: 4,
        span: 2,
        title: "Analysis 4",
      },
    ],
    [
      {
        id: 5,
        col: 1,
        span: 2,
        title: "Analysis 5",
      },
      {
        id: 6,
        col: 4,
        span: 3,
        title: "Analysis 6",
      },
    ],
    [
      {
        id: 7,
        col: 1,
        span: 2,
        title: "Analysis 7",
      },
      {
        id: 8,
        col: 4,
        span: 2,
        title: "Analysis 8",
      },
    ],
  ]);
  let maxRowUsed = $derived(boxes.length);
  let nextId = $state(9);

  let gridEl: HTMLDivElement | null = $state(null);
  let dragPreview: DragPreview | null = $state(null);

  /** Check which columns of the row are full */
  function buildOccupancy(row: number, ignoreId?: number): Set<number> {
    console.log(row);

    const occupied = new Set<number>();
    for (const box of boxes[row]) {
      if (box.id === ignoreId) continue;
      for (let c = box.col; c < box.col + box.span; c += 1) {
        occupied.add(c);
      }
    }
    return occupied;
  }

  function canPlace(
    row: number,
    col: number,
    span: number,
    ignoreId?: number,
  ): boolean {
    if (col < 1 || row < 0) return false;
    if (col + span - 1 > GRID_COLS) return false;

    const occupied = buildOccupancy(row, ignoreId);
    for (let c = col; c < col + span; c += 1) {
      if (occupied.has(c)) return false;
    }
    return true;
  }

  function clearEmptyRow(row: number) {
    if (boxes[row].length === 0) {
      boxes = [...boxes.slice(0, row), ...boxes.slice(row + 1)];
    }
  }

  function removeBox(row: number, boxId: number) {
    boxes[row] = boxes[row].filter((box) => box.id !== boxId);
    clearEmptyRow(row);
  }

  function tryResize(row: number, boxId: number, span: number) {
    boxes[row] = boxes[row].map((box) => {
      if (box.id !== boxId) return box;
      if (!canPlace(row, box.col, span, box.id)) return box;
      return { ...box, span };
    });
    boxes = boxes.slice();
  }

  function splitByCond(boxes: Box[], boxId: number): [Box[], Box] {
    let boxesFalse = [];
    let boxesTrue = [];

    for (const box of boxes) {
      if (box.id === boxId) {
        boxesTrue.push(box);
      } else {
        boxesFalse.push(box);
      }
    }
    return [boxesFalse, boxesTrue[0]];
  }

  /** Move box to another row.
   * We don't need to check whether we can place the box here, as this is checked
   * by the dragPreview
   */
  function moveBox(boxId: number, fromRow: number, toRow: number, col: number) {
    const [row, box] = splitByCond(boxes[fromRow], boxId);
    box.col = col;
    boxes[fromRow] = row;
    boxes[toRow] = [...boxes[toRow], box];
    clearEmptyRow(fromRow);
  }

  function findSpotInRow(row: number, span: number): number | null {
    for (let col = 1; col <= GRID_COLS - span + 1; col += 1) {
      if (canPlace(row, col, span)) return col;
    }
    return null;
  }

  function addRightAtRow(row: number) {
    const col = findSpotInRow(row, 1);
    if (col === null) return;
    boxes[row] = [
      ...boxes[row],
      {
        id: nextId,
        col,
        span: 1,
        title: `Analysis ${nextId}`,
      },
    ];
    boxes = boxes.slice();
    nextId += 1;
  }

  function addBelow() {
    boxes = [
      ...boxes,
      [
        {
          id: nextId,
          col: 1,
          span: DEFAULT_COL_SPAN,
          title: `Analysis ${nextId}`,
        },
      ],
    ];
    nextId += 1;
  }

  function getGridMetrics() {
    if (!gridEl) return null;
    const styles = getComputedStyle(gridEl);
    const cell = Number.parseFloat(styles.getPropertyValue("--cell")) || 160;
    const gap = Number.parseFloat(styles.getPropertyValue("--gap")) || 12;
    return { cell, gap, pitch: cell + gap };
  }

  function startResize(
    event: PointerEvent,
    row: number,
    boxId: number,
    kind: "width",
  ) {
    if (event.button !== 0) return;
    const metrics = getGridMetrics();
    if (!metrics) return;
    const box = boxes[row].find((item) => item.id === boxId);
    if (!box) return;

    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture(
      event.pointerId,
    );

    const startX = event.clientX;
    const startColSpan = box.span;
    const maxColSpan = GRID_COLS - box.col + 1;

    dragPreview = {
      boxId,
      row: row,
      col: box.col,
      span: box.span,
      kind,
    };

    const handleMove = (moveEvent: PointerEvent) => {
      const delta = moveEvent.clientX - startX;
      const step = Math.round(delta / metrics.pitch);
      const nextColSpan = Math.max(
        1,
        Math.min(maxColSpan, startColSpan + step),
      );
      if (canPlace(row, box.col, nextColSpan, boxId)) {
        dragPreview = {
          boxId,
          row: row,
          col: box.col,
          span: nextColSpan,
          kind,
        };
      }
      return;
    };

    const handleUp = () => {
      if (dragPreview?.boxId === boxId) {
        tryResize(row, boxId, dragPreview.span);
      }
      dragPreview = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  function startMove(event: PointerEvent, startRow: number, boxId: number) {
    if (event.button !== 0) return;
    const metrics = getGridMetrics();
    if (!metrics) return;
    const box = boxes[startRow].find((item) => item.id === boxId);
    if (!box) return;

    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture(
      event.pointerId,
    );

    const startX = event.clientX;
    const startY = event.clientY;
    const startCol = box.col;
    const maxCol = GRID_COLS - box.span + 1;

    dragPreview = {
      boxId,
      row: startRow,
      col: box.col,
      span: box.span,
      kind: "move",
    };

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const stepX = Math.round(deltaX / metrics.pitch);
      const stepY = Math.round(deltaY / metrics.pitch);
      const nextCol = Math.max(1, Math.min(maxCol, startCol + stepX));
      const nextRow = Math.max(1, startRow + stepY);
      if (canPlace(nextRow, nextCol, box.span, boxId)) {
        dragPreview = {
          boxId,
          row: nextRow,
          col: nextCol,
          span: box.span,
          kind: "move",
        };
      }
    };

    const handlePointerUp = () => {
      if (dragPreview?.boxId === boxId) {
        moveBox(boxId, startRow, dragPreview.row, dragPreview.col);
      }
      dragPreview = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  function rowNotFull(row: number): boolean {
    return findSpotInRow(row, 1) !== null;
  }
</script>

<div class="grid" bind:this={gridEl}>
  {#each boxes as boxRow, row}
    {#each boxRow as box (box.id)}
      <div
        class="box"
        style={`grid-column: ${box.col} / span ${box.span}; grid-row: ${row + 1};`}
      >
        <div
          class="box-header"
          role="button"
          tabindex="0"
          onpointerdown={(event) => startMove(event, row, box.id)}
        >
          <div class="title">{box.title}</div>
          <div class="subtitle">Placeholder</div>
        </div>
        <button class="btn-close" onclick={() => removeBox(row, box.id)}>
          <Icon>close</Icon>
        </button>
        <button
          class="resize-handle"
          onpointerdown={(event) => startResize(event, row, box.id, "width")}
          aria-label="Resize width"
        ></button>
      </div>
    {/each}
    {#if rowNotFull(row)}
      <button
        class="ghost add-button"
        style={`grid-column: ${findSpotInRow(row, 1)} / span 1; grid-row: ${row + 1};`}
        onclick={() => addRightAtRow(row)}
      >
        <Icon color="inherit">add</Icon>
      </button>
    {/if}
  {/each}

  {#if dragPreview}
    <div
      class="preview-box"
      style={`grid-column: ${dragPreview.col} / span ${dragPreview.span}; grid-row: ${dragPreview.row + 1}`}
    ></div>
  {/if}
  <button
    class="ghost add-button add-button--below"
    style={`grid-column: 1 / span ${GRID_COLS}; grid-row: ${maxRowUsed + 1};`}
    onclick={addBelow}
  >
    Add new analysis
  </button>
</div>

<style>
  .ghost {
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
    cursor: pointer;
    border: 1px solid rgba(120, 120, 120, 0.5);
    border-radius: 10px;
    background: rgba(120, 120, 120, 0.1);
    padding: 10px 16px;
    color: #1f1f1f;
  }

  .ghost:hover {
    background: rgba(120, 120, 120, 0.25);
  }

  .grid {
    --gap: 12px;
    display: grid;
    grid-template-columns: repeat(6, var(--cell));
    align-items: stretch;
    gap: var(--gap);
  }

  .grid > * {
    position: relative;
  }

  .box {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 12px;
    z-index: 2;
    border: 1px solid #d0d0d0;
    border-radius: 14px;
    background: #f2f2f2;
    padding: 12px;
  }

  .box-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    cursor: grab;
  }

  .box-header:active {
    cursor: grabbing;
  }

  .title {
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .subtitle {
    color: #5a5a5a;
    font-size: 0.85rem;
  }

  .btn-close {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
    border: none;
    border-radius: 50px;
  }
  .btn-close:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }

  .resize-handle {
    position: absolute;
    top: 50%;
    right: -8px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: pointer;
    cursor: ew-resize;
    border: 1px solid rgba(120, 120, 120, 0.6);
    border-radius: 6px;
    background: rgba(120, 120, 120, 0.35);
    width: 18px;
    height: 18px;
  }

  .box:hover .resize-handle {
    opacity: 1;
  }

  .preview-box {
    z-index: 3;
    border: 2px dashed rgba(90, 90, 90, 0.8);
    border-radius: 12px;
    background: rgba(160, 160, 160, 0.15);
    pointer-events: none;
  }

  .add-button {
    display: grid;
    place-items: center;
    z-index: 1;
    text-align: center;
  }
</style>
