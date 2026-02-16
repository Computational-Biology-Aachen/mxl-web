<script lang="ts">
  type Box = {
    id: number;
    row: number;
    col: number;
    colSpan: number;
    rowSpan: number;
    title: string;
  };

  type DragPreview = {
    boxId: number;
    row: number;
    col: number;
    colSpan: number;
    rowSpan: number;
    kind: "width" | "height" | "move";
  };

  const GRID_COLS = 6;
  const DEFAULT_COL_SPAN = 3;
  const DEFAULT_ROW_SPAN = 1;
  const MAX_ROW_SPAN = 4;

  let nextId = $state(3);
  let boxes: Box[] = $state([
    {
      id: 1,
      row: 1,
      col: 1,
      colSpan: DEFAULT_COL_SPAN,
      rowSpan: DEFAULT_ROW_SPAN,
      title: "Analysis 1",
    },
    {
      id: 2,
      row: 1,
      col: 4,
      colSpan: DEFAULT_COL_SPAN,
      rowSpan: DEFAULT_ROW_SPAN,
      title: "Analysis 2",
    },
  ]);

  let gridEl: HTMLDivElement | null = $state(null);
  let dragPreview: DragPreview | null = $state(null);

  const cellKey = (row: number, col: number) => `${row}:${col}`;

  function buildOccupancy(ignoreId?: number): Set<string> {
    const occupied = new Set<string>();
    for (const box of boxes) {
      if (box.id === ignoreId) continue;
      for (let r = box.row; r < box.row + box.rowSpan; r += 1) {
        for (let c = box.col; c < box.col + box.colSpan; c += 1) {
          occupied.add(cellKey(r, c));
        }
      }
    }
    return occupied;
  }

  function canPlace(
    row: number,
    col: number,
    colSpan: number,
    rowSpan: number,
    ignoreId?: number,
  ): boolean {
    if (col < 1 || row < 1) return false;
    if (col + colSpan - 1 > GRID_COLS) return false;
    const occupied = buildOccupancy(ignoreId);
    for (let r = row; r < row + rowSpan; r += 1) {
      for (let c = col; c < col + colSpan; c += 1) {
        if (occupied.has(cellKey(r, c))) return false;
      }
    }
    return true;
  }

  function maxRowUsed(): number {
    return boxes.reduce(
      (max, box) => Math.max(max, box.row + box.rowSpan - 1),
      1,
    );
  }

  function tryResize(boxId: number, colSpan: number, rowSpan: number) {
    boxes = boxes.map((box) => {
      if (box.id !== boxId) return box;
      if (!canPlace(box.row, box.col, colSpan, rowSpan, box.id)) return box;
      return { ...box, colSpan, rowSpan };
    });
  }

  function tryMove(boxId: number, row: number, col: number) {
    boxes = boxes.map((box) => {
      if (box.id !== boxId) return box;
      if (!canPlace(row, col, box.colSpan, box.rowSpan, box.id)) return box;
      return { ...box, row, col };
    });
  }

  function findSpotInRow(
    row: number,
    colSpan: number,
    rowSpan: number,
  ): number | null {
    for (let col = 1; col <= GRID_COLS - colSpan + 1; col += 1) {
      if (canPlace(row, col, colSpan, rowSpan)) return col;
    }
    return null;
  }

  function addRightAtRow(row: number) {
    const col = findSpotInRow(row, DEFAULT_COL_SPAN, DEFAULT_ROW_SPAN);
    if (col === null) return;
    boxes = [
      ...boxes,
      {
        id: nextId,
        row,
        col,
        colSpan: DEFAULT_COL_SPAN,
        rowSpan: DEFAULT_ROW_SPAN,
        title: `Analysis ${nextId}`,
      },
    ];
    nextId += 1;
  }

  function addBelow() {
    const row = maxRowUsed() + 1;
    const col = 1;
    boxes = [
      ...boxes,
      {
        id: nextId,
        row,
        col,
        colSpan: DEFAULT_COL_SPAN,
        rowSpan: DEFAULT_ROW_SPAN,
        title: `Analysis ${nextId}`,
      },
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
    boxId: number,
    kind: "width" | "height",
  ) {
    if (event.button !== 0) return;
    const metrics = getGridMetrics();
    if (!metrics) return;
    const box = boxes.find((item) => item.id === boxId);
    if (!box) return;

    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture(
      event.pointerId,
    );

    const startX = event.clientX;
    const startY = event.clientY;
    const startColSpan = box.colSpan;
    const startRowSpan = box.rowSpan;
    const maxColSpan = GRID_COLS - box.col + 1;

    dragPreview = {
      boxId,
      row: box.row,
      col: box.col,
      colSpan: box.colSpan,
      rowSpan: box.rowSpan,
      kind,
    };

    const handleMove = (moveEvent: PointerEvent) => {
      if (kind === "width") {
        const delta = moveEvent.clientX - startX;
        const step = Math.round(delta / metrics.pitch);
        const nextColSpan = Math.max(
          1,
          Math.min(maxColSpan, startColSpan + step),
        );
        if (canPlace(box.row, box.col, nextColSpan, startRowSpan, boxId)) {
          dragPreview = {
            boxId,
            row: box.row,
            col: box.col,
            colSpan: nextColSpan,
            rowSpan: startRowSpan,
            kind,
          };
        }
        return;
      }

      const delta = moveEvent.clientY - startY;
      const step = Math.round(delta / metrics.pitch);
      const nextRowSpan = Math.max(
        1,
        Math.min(MAX_ROW_SPAN, startRowSpan + step),
      );
      if (canPlace(box.row, box.col, startColSpan, nextRowSpan, boxId)) {
        dragPreview = {
          boxId,
          row: box.row,
          col: box.col,
          colSpan: startColSpan,
          rowSpan: nextRowSpan,
          kind,
        };
      }
    };

    const handleUp = () => {
      if (dragPreview?.boxId === boxId) {
        tryResize(boxId, dragPreview.colSpan, dragPreview.rowSpan);
      }
      dragPreview = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  function startMove(event: PointerEvent, boxId: number) {
    if (event.button !== 0) return;
    const metrics = getGridMetrics();
    if (!metrics) return;
    const box = boxes.find((item) => item.id === boxId);
    if (!box) return;

    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture(
      event.pointerId,
    );

    const startX = event.clientX;
    const startY = event.clientY;
    const startRow = box.row;
    const startCol = box.col;
    const maxCol = GRID_COLS - box.colSpan + 1;

    dragPreview = {
      boxId,
      row: box.row,
      col: box.col,
      colSpan: box.colSpan,
      rowSpan: box.rowSpan,
      kind: "move",
    };

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const stepX = Math.round(deltaX / metrics.pitch);
      const stepY = Math.round(deltaY / metrics.pitch);
      const nextCol = Math.max(1, Math.min(maxCol, startCol + stepX));
      const nextRow = Math.max(1, startRow + stepY);
      if (canPlace(nextRow, nextCol, box.colSpan, box.rowSpan, boxId)) {
        dragPreview = {
          boxId,
          row: nextRow,
          col: nextCol,
          colSpan: box.colSpan,
          rowSpan: box.rowSpan,
          kind: "move",
        };
      }
    };

    const handleUp = () => {
      if (dragPreview?.boxId === boxId) {
        tryMove(boxId, dragPreview.row, dragPreview.col);
      }
      dragPreview = null;
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  const rowAddButtons = $derived.by(() => {
    const rowCount = maxRowUsed();
    const items: Array<{ row: number; col: number }> = [];
    for (let row = 1; row <= rowCount; row += 1) {
      const col = findSpotInRow(row, DEFAULT_COL_SPAN, DEFAULT_ROW_SPAN);
      if (col !== null) items.push({ row, col });
    }
    return items;
  });

  const addBelowRow = $derived.by(() => maxRowUsed() + 1);
</script>

<div class="page">
  <div
    class="grid"
    bind:this={gridEl}
  >
    {#each boxes as box (box.id)}
      <div
        class="box"
        style={`grid-column: ${box.col} / span ${box.colSpan}; grid-row: ${box.row} / span ${box.rowSpan};`}
      >
        <button
          class="box-header"
          onpointerdown={(event) => startMove(event, box.id)}
          aria-label="Drag to move"
        >
          <div class="title">{box.title}</div>
          <div class="subtitle">Placeholder</div>
        </button>
        <button
          class="resize-handle resize-handle--right"
          onpointerdown={(event) => startResize(event, box.id, "width")}
          aria-label="Resize width"
        ></button>
        <button
          class="resize-handle resize-handle--bottom"
          onpointerdown={(event) => startResize(event, box.id, "height")}
          aria-label="Resize height"
        ></button>
      </div>
    {/each}

    {#if dragPreview}
      <div
        class="preview-box"
        style={`grid-column: ${dragPreview.col} / span ${dragPreview.colSpan}; grid-row: ${dragPreview.row} / span ${dragPreview.rowSpan};`}
      ></div>
    {/if}

    {#each rowAddButtons as item (item.row)}
      <button
        class="ghost add-button"
        style={`grid-column: ${item.col} / span ${1}; grid-row: ${item.row} / span ${1};`}
        onclick={() => addRightAtRow(item.row)}
      >
        Add analysis to the right
      </button>
    {/each}

    <button
      class="ghost add-button add-button--below"
      style={`grid-column: 1 / span ${GRID_COLS}; grid-row: ${addBelowRow};`}
      onclick={addBelow}
    >
      Add analysis below
    </button>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
  }

  .page {
    padding: 24px;
  }

  .ghost {
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--border-radius);
    background: rgba(120, 120, 120, 0.3);
    padding: 10px 16px;
    color: #1f1f1f;
  }

  .ghost:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .ghost:not(:disabled):hover {
    background: rgba(120, 120, 120, 0.45);
  }

  .grid {
    --cell: 160px;
    --gap: 12px;
    display: grid;
    grid-template-columns: repeat(6, var(--cell));
    grid-auto-rows: var(--cell);
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
    border-radius: var(--border-radius);
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

  .resize-handle {
    position: absolute;
    opacity: 0;
    transition: opacity 0.2s ease;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--border-radius);
    background: rgba(120, 120, 120, 0.35);
    width: 18px;
    height: 18px;
  }

  .box:hover .resize-handle {
    opacity: 1;
  }

  .resize-handle--right {
    top: 50%;
    right: -8px;
    transform: translateY(-50%);
    cursor: ew-resize;
  }

  .resize-handle--bottom {
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }

  .preview-box {
    z-index: 3;
    border: var(--border-dashed);
    border-radius: var(--border-radius);
    background: rgba(160, 160, 160, 0.15);
    pointer-events: none;
  }

  .add-button {
    display: grid;
    place-items: center;
    z-index: 1;
    text-align: center;
  }

  .add-button--below {
    height: 100%;
  }
</style>
