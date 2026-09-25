<!--
  @component

  Shared shell for the model-editor tables: toolbar (search, problems-only
  filter, add), sticky header, one row per item with a status dot, an
  expandable detail area, and a delete button that asks for confirmation when
  other items still use the row. Below 768px the same column definitions
  render as cards.

  Findings and dependencies come from the surrounding editor's context.

  ### Props

  - `kind` — which {@link ItemKind} the rows are.
  - `rows`, `idOf`, `labelOf` — the items, their id, and the text searched.
  - `columns` — `{ key, label, align? }`
  - `cell` — snippet `(key, row, index)` rendering one cell, where `index` is the row's position in the *unfiltered*
    `rows`, for writing back into the source array.
  - `expansion?` — snippet `(row, index)` for table-specific detail; the
    findings and dependency chips are added around it automatically.
  - `onAdd` — appends a new item and returns its id.
  - `onRemove(row, index)` — removes an item.
-->
<script
  lang="ts"
  generics="T"
>
  import { Button, ButtonIcon } from "@computational-biology-aachen/design";
  import { MediaQuery } from "svelte/reactivity";
  import { tick, type Snippet } from "svelte";
  import { useEditorContext } from "./editorContext.svelte";
  import {
    findingsFor,
    refKey,
    type ItemKind,
    type ItemRef,
  } from "./modelDiagnostics";
  import TableSearch from "./TableSearch.svelte";
  import { fuzzyMatch } from "./utils";

  type Column = {
    key: string;
    label: string;
    align?: "left" | "right";
  };

  let {
    kind,
    rows,
    idOf,
    labelOf,
    columns,
    cell,
    expansion,
    onAdd,
    onRemove,
  }: {
    kind: ItemKind;
    rows: T[];
    idOf: (row: T) => string;
    labelOf: (row: T) => string;
    columns: Column[];
    cell: Snippet<[string, T, number]>;
    expansion?: Snippet<[T, number]>;
    onAdd: () => string;
    onRemove: (row: T, index: number) => void;
  } = $props();

  const ctx = useEditorContext();
  const md = new MediaQuery("max-width: 768px");

  let root = $state<HTMLElement>();
  let query = $state("");
  let problemsOnly = $state(false);
  let confirming = $state<string | null>(null);

  let kindFindings = $derived(
    ctx.diagnostics.findings.filter((f) => f.ref.kind === kind),
  );
  let visible = $derived(
    rows
      .map((row, index) => ({ row, index, id: idOf(row) }))
      .filter(
        ({ row, id }) =>
          fuzzyMatch(labelOf(row), query) &&
          (!problemsOnly || findingsFor(kindFindings, kind, id).length > 0),
      ),
  );

  function statusOf(id: string) {
    const own = findingsFor(kindFindings, kind, id);
    const severity = own.some((f) => f.severity === "error")
      ? "error"
      : own.length > 0
        ? "warning"
        : null;
    return { own, severity };
  }

  function depsOf(id: string, index: "dependsOn" | "usedBy"): ItemRef[] {
    return ctx.diagnostics[index].get(refKey({ kind, id })) ?? [];
  }

  function onRowClick(e: MouseEvent, ref: ItemRef) {
    if ((e.target as HTMLElement).closest("input, button, a, textarea")) return;
    ctx.toggle(ref);
  }

  function requestRemove(row: T, index: number, id: string) {
    if (depsOf(id, "usedBy").length > 0) {
      confirming = id;
    } else {
      onRemove(row, index);
    }
  }

  async function add() {
    const id = onAdd();
    query = "";
    problemsOnly = false;
    ctx.expanded = { kind, id };
    await tick();
    const el = [
      ...(root?.querySelectorAll<HTMLElement>("[data-row-id]") ?? []),
    ].find((r) => r.dataset.rowId === id);
    el?.scrollIntoView({ block: "nearest" });
    el?.querySelector<HTMLInputElement>("input")?.select();
  }
</script>

{#snippet detail(row: T, index: number, id: string)}
  {@const own = statusOf(id).own}
  {@const dependsOn = depsOf(id, "dependsOn")}
  {@const usedBy = depsOf(id, "usedBy")}
  <div class="detail">
    {#if own.length > 0}
      <ul class="findings">
        {#each own as f (f.code + f.message)}
          <li class={f.severity}>{f.message}</li>
        {/each}
      </ul>
    {/if}
    {@render expansion?.(row, index)}
    {#if dependsOn.length > 0 || usedBy.length > 0}
      <div class="deps">
        {#each [["Depends on", dependsOn], ["Used by", usedBy]] as const as [title, refs] (title)}
          {#if refs.length > 0}
            <div class="dep-group">
              <span class="dep-title">{title}</span>
              {#each refs as ref (refKey(ref))}
                <button
                  class="chip"
                  onclick={() => ctx.navigate(ref)}
                >
                  {ref.id}
                  <small>{ref.kind}</small>
                </button>
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

{#snippet confirm(row: T, index: number, id: string)}
  <div class="confirm">
    <span>
      “{id}” is used by
      {#each depsOf(id, "usedBy") as ref, i (refKey(ref))}
        {i > 0 ? ", " : ""}<button
          class="link"
          onclick={() => ctx.navigate(ref)}>{ref.id}</button
        >
      {/each}. Delete anyway?
    </span>
    <Button
      onclick={() => {
        confirming = null;
        onRemove(row, index);
      }}>Delete</Button
    >
    <Button
      variant="secondary"
      onclick={() => (confirming = null)}>Cancel</Button
    >
  </div>
{/snippet}

{#snippet controls(row: T, index: number, id: string)}
  {@const { own, severity } = statusOf(id)}
  {@const open = ctx.isExpanded({ kind, id })}
  <span class="controls">
    {#if severity}
      <span
        class="dot {severity}"
        role="img"
        aria-label={own.map((f) => f.message).join(" ")}
        title={own.map((f) => f.message).join("\n")}
      ></span>
    {/if}
    <button
      class="toggle"
      class:open={open}
      aria-expanded={open}
      aria-label={open ? "Collapse" : "Expand"}
      onclick={() => ctx.toggle({ kind, id })}
    >
      <span class="material-symbols-outlined">expand_more</span>
    </button>
    <ButtonIcon
      icon="close"
      onclick={() => requestRemove(row, index, id)}
    />
  </span>
{/snippet}

<div bind:this={root}>
  <div class="toolbar">
    <div class="search">
      <TableSearch bind:value={query} />
    </div>
    {#if kindFindings.length > 0}
      <label class="problems">
        <input
          type="checkbox"
          bind:checked={problemsOnly}
        />
        Problems only
      </label>
    {/if}
    <Button onclick={add}>Add</Button>
  </div>

  {#if md.current}
    <div class="cards">
      {#each visible as { row, index, id } (id)}
        <div
          class="card"
          data-row-id={id}
        >
          {#each columns as col (col.key)}
            <div class="card-row">
              <span class="card-label">{col.label}</span>
              {@render cell(col.key, row, index)}
            </div>
          {/each}
          <div class="card-row card-actions">
            {@render controls(row, index, id)}
          </div>
          {#if confirming === id}
            {@render confirm(row, index, id)}
          {/if}
          {#if ctx.isExpanded({ kind, id })}
            {@render detail(row, index, id)}
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <table>
      <thead>
        <tr>
          {#each columns as col (col.key)}
            <th class={col.align}>{col.label}</th>
          {/each}
          <th class="controls-col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>
        {#each visible as { row, index, id } (id)}
          {@const open = ctx.isExpanded({ kind, id })}
          <tr
            data-row-id={id}
            class:open={open}
            onclick={(e) => onRowClick(e, { kind, id })}
          >
            {#each columns as col (col.key)}
              <td class={col.align}>{@render cell(col.key, row, index)}</td>
            {/each}
            <td class="controls-col">{@render controls(row, index, id)}</td>
          </tr>
          {#if confirming === id}
            <tr class="extra">
              <td colspan={columns.length + 1}>
                {@render confirm(row, index, id)}
              </td>
            </tr>
          {/if}
          {#if open}
            <tr class="extra">
              <td colspan={columns.length + 1}>
                {@render detail(row, index, id)}
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  {/if}

  {#if visible.length === 0}
    <p class="empty">
      {rows.length === 0 ? "Nothing here yet." : "No items match."}
    </p>
  {/if}
</div>

<style>
  .toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
  }
  .search {
    flex: 1;
  }
  .problems {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
    white-space: nowrap;
  }
  .empty {
    padding: 0 1rem 1rem;
    color: var(--color-text-muted);
  }
  .sr-only {
    position: absolute;
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  /* Table */
  table {
    border-collapse: collapse;
    width: 100%;
    text-align: left;
  }
  th {
    position: sticky;
    top: 0;
    z-index: 1;
    box-shadow: inset 0 -1px 0 var(--color-border);
    background-color: var(--color-surface);
    padding: 0.5rem 0.75rem;
    color: var(--color-text-muted);
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  td {
    vertical-align: middle;
    box-shadow: inset 0 -1px 0 var(--color-border);
    padding: 0.25rem 0.75rem;
  }
  tbody tr:not(.extra) {
    cursor: pointer;
  }
  tbody tr:not(.extra):hover,
  tr.open {
    background-color: lch(from var(--color-surface) calc(l - 3) c h);
  }
  .right {
    text-align: right;
  }
  .controls-col {
    width: 1%;
    white-space: nowrap;
  }
  tr.extra td {
    cursor: default;
    padding: 0;
  }

  /* Controls: dim until the row is hovered or focused */
  .controls {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    opacity: 0.6;
  }
  tr:hover .controls,
  tr:focus-within .controls,
  tr.open .controls,
  .card .controls {
    opacity: 1;
  }
  .toggle {
    display: inline-flex;
    transition: transform var(--transition, 150ms);
    cursor: pointer;
    border: none;
    background: none;
    padding: 0.15rem;
    color: inherit;
  }
  .toggle.open {
    transform: rotate(180deg);
  }
  .dot {
    border-radius: var(--radius-full);
    width: 0.6rem;
    height: 0.6rem;
  }
  .dot.error {
    background-color: var(--rwth-red);
  }
  .dot.warning {
    background-color: var(--rwth-orange);
  }

  /* Detail */
  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background-color: lch(from var(--color-surface) calc(l - 2) c h);
    padding: 0.75rem 1rem 1rem;
  }
  .findings {
    margin: 0;
    padding: 0;
    font-size: 0.875rem;
    list-style: none;
  }
  .findings .error {
    color: var(--rwth-red);
  }
  .findings .warning {
    color: color-mix(in srgb, var(--rwth-orange) 70%, black);
  }
  .deps {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    font-size: 0.8rem;
  }
  .dep-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
  }
  .dep-title {
    color: var(--color-text-muted);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
  }
  .chip {
    cursor: pointer;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    padding: 0.1rem 0.6rem;
    font: inherit;
  }
  .chip small {
    color: var(--color-text-muted);
  }
  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    background-color: color-mix(in srgb, var(--rwth-red) 10%, transparent);
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
  .confirm span {
    flex: 1;
  }
  .link {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    color: var(--color-primary);
    font: inherit;
    text-decoration: underline;
  }

  /* Cards */
  .cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem 1rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: var(--shadow-sm);
    border: var(--border);
    border-radius: 0.5rem;
    background-color: var(--color-surface);
    padding: 1rem;
  }
  .card-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .card-label {
    color: var(--color-text-muted);
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    text-transform: uppercase;
  }
  .card-actions {
    border-top: 1px solid var(--color-border);
    padding-top: 0.5rem;
  }
</style>
