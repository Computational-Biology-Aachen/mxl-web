<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";

  type Box = {
    id: number;
    idx: number;
    col: number;
    span: number;
    title: string;
  };

  type BoxSeed = {
    id: number;
    idx: number;
    span: number;
    col?: number;
    title: string;
  };

  type DragPreview = {
    boxId: number;
    col: number;
    row: number;
    span: number;
    kind: "width" | "move";
  };

  let {
    children,
    items,
    onAdd,
    onRemove,
  }: {
    children: Snippet<[{ box: Box }]>;
    items: BoxSeed[];
    onAdd: (box: Box) => number;
    onRemove: (box: Box) => void;
  } = $props();

  const GRID_COLS = 6;
  const DEFAULT_COL_SPAN = 3;

  function getNextId(initialBoxes: Array<Box[]>): number {
    let maxId = 0;
    for (const row of initialBoxes) {
      for (const box of row) {
        maxId++;
      }
    }
    return maxId;
  }

  function findSpotInRowFor(
    rows: Array<Box[]>,
    row: number,
    span: number,
  ): number | null {
    const occupied = new Set<number>();
    const rowBoxes = rows[row] ?? [];
    for (const box of rowBoxes) {
      for (let c = box.col; c < box.col + box.span; c += 1) {
        occupied.add(c);
      }
    }
    for (let col = 1; col <= GRID_COLS - span + 1; col += 1) {
      let fits = true;
      for (let c = col; c < col + span; c += 1) {
        if (occupied.has(c)) {
          fits = false;
          break;
        }
      }
      if (fits) return col;
    }
    return null;
  }

  let boxes: Box[][] = $derived.by(() => {
    const rows: Box[][] = [];
    let nextSeedId = 1;

    for (const item of items) {
      const span = item.span;
      let row = 0;
      while (true) {
        const col = item.col ?? findSpotInRowFor(rows, row, span);

        if (col !== null) {
          const id = item.id ?? nextSeedId;
          rows[row] = rows[row] ?? [];
          rows[row].push({
            id,
            idx: item.idx,
            col,
            span,
            title: item.title ?? `Analysis ${id}`,
          });
          nextSeedId = Math.max(nextSeedId, id + 1);
          break;
        }
        row += 1;
      }
    }
    return rows;
  });
  let maxRowUsed = $derived(boxes.length);
  let nextId = $derived(getNextId(boxes));

  let gridEl: HTMLDivElement | null = $state(null);
  let dragPreview: DragPreview | null = $state(null);

  /** Check which columns of the row are full */
  function buildOccupancy(row: number, ignoreId?: number): Set<number> {
    const occupied = new Set<number>();
    for (const box of boxes.at(row) ?? []) {
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

  function removeBox(row: number, boxId: number) {
    const [others, box] = splitByCond(boxes[row], boxId);
    boxes[row] = others;
    clearEmptyRow(row);
    onRemove(box);
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
    const newBox = {
      id: nextId,
      col,
      idx: -1, // garbage value
      span: GRID_COLS - col + 1,
      title: `Analysis ${nextId}`,
    };
    newBox.idx = onAdd(newBox);

    boxes[row] = [...boxes[row], newBox];
    boxes = boxes.slice();
  }

  function addBelow() {
    const newBox = {
      id: nextId,
      col: 1,
      idx: -1, // garbage value
      span: DEFAULT_COL_SPAN,
      title: `Analysis ${nextId}`,
    };
    newBox.idx = onAdd(newBox);
    boxes = [...boxes, [newBox]];
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
          <h2>{box.title}</h2>
        </div>

        <div class="box-body">
          {@render children({ box })}
        </div>

        <button class="close" onclick={() => removeBox(row, box.id)}>
          <Icon color="inherit">close</Icon>
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
        class="add"
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
    class="add"
    style={`grid-column: 1 / span ${GRID_COLS}; grid-row: ${maxRowUsed + 1};`}
    onclick={addBelow}
  >
    <Icon color="inherit">add</Icon>
  </button>
</div>

<style>
  .grid {
    --gap: 1rem;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--gap);
  }
  .box {
    display: flex;
    position: relative;
    flex-direction: column;
    gap: 12px;
    z-index: 2;
    box-shadow: var(--shadow);
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background-color: var(--bg-l1);
    padding: 2rem;
    width: 100%;
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

  button.close {
    display: flex;
    position: absolute;
    top: 12px;
    right: 12px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 5rem;
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    font-size: 0.75rem;
  }
  button.close:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
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

  .box-body {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .box:hover .resize-handle {
    opacity: 1;
  }

  .preview-box {
    z-index: 3;
    border: 2px dashed rgba(90, 90, 90, 0.8);
    border-radius: 12px;
    background: rgba(160, 160, 160, 0.1);
    pointer-events: none;
  }

  button.add {
    display: grid;
    place-items: center;
    z-index: 1;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
    cursor: pointer;
    border: 1px solid rgba(120, 120, 120, 0.5);
    border-radius: 10px;
    background: var(--bg-l1);
    padding: 10px 16px;
    color: #1f1f1f;
    text-align: center;
  }

  button.add:hover {
    background: rgba(from var(--bg-l1), r g b 0.1);
  }
</style>
