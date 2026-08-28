<script lang="ts">
  import {
    Button,
    ButtonIcon as IconButton,
    Math,
    Popover,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Base, Num } from "@computational-biology-aachen/mxlweb-core/mathml";
  import { MediaQuery } from "svelte/reactivity";
  import EqEditor from "./EqEditor.svelte";
  import {
    idToTex,
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import TableSearch from "./TableSearch.svelte";
  import { fuzzyMatch } from "./utils";

  const md = new MediaQuery("max-width: 768px");

  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
    nnBlocks = $bindable(),
    readouts = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
    readouts: AssView;
  } = $props();

  // A readout may reference a variable/parameter/reaction directly, or an
  // existing assignment (derived quantity), or another readout — but never
  // the reverse (mxlweb-core issue #6: nothing that feeds dxdt may ever
  // reference a readout). This picker/rendering set reflects that: it's
  // strictly broader than TableAssignment.svelte's own (assignments-only).
  let referenceable: AssView = $derived([...assignments, ...readouts]);

  function onSaveEq(idx: number, fn: Base) {
    readouts[idx].fn = fn;
    readouts = readouts.slice();
  }

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, referenceable, reactions),
  );

  let query = $state("");
  let filtered = $derived(
    readouts
      .map((ro, idx) => ({ ro, idx }))
      .filter(({ ro }) =>
        fuzzyMatch(defaultValue(ro.displayName, ro.id), query),
      ),
  );
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => defaultValue(readouts[idx].displayName, readouts[idx].id),
      (value) => {
        readouts[idx].displayName = value;
        readouts[idx].texName = defaultTexName(value);
        readouts = readouts.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => readouts[idx].texName || "",
      (value) => {
        readouts[idx].texName = value;
        readouts = readouts.slice();
      }
    }
  />
{/snippet}

{#snippet functionDisplay(idx: number)}
  <div class="row">
    <div class="eq-scroll">
      <Math
        tex={readouts[idx].fn.toTex(texNames)}
        display={true}
        fontSize="0.75rem"
      />
    </div>
    <IconButton
      icon="edit"
      popovertarget="readout-eq-editor-{idx}"
    />
  </div>
{/snippet}

{#snippet actions(_idx: number, ro: AssView[number])}
  <IconButton
    icon="close"
    onclick={() => {
      readouts = readouts.filter((i) => {
        return i.id !== ro.id;
      });
    }}
  />
{/snippet}

<div class="padding">
  <TableSearch bind:value={query} />
</div>

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each filtered as { ro, idx } (ro.id)}
      <div class="card">
        <div class="card-row">
          <span class="card-label">Name</span>
          <div class="card-input">
            {@render nameInput(idx)}
          </div>
        </div>
        <div class="card-row">
          <span class="card-label">Tex name</span>
          <div class="card-input">
            {@render texNameInput(idx)}
          </div>
        </div>
        <div class="card-row">
          <span class="card-label">Function</span>
          <div class="card-value">
            {@render functionDisplay(idx)}
          </div>
        </div>
        <div class="card-row card-actions">
          {@render actions(idx, ro)}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <!-- Table layout for desktop -->
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Tex name</th>
        <th>Function</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as { ro, idx } (ro.id)}
        <tr>
          <td>
            {@render nameInput(idx)}
          </td>
          <td>
            {@render texNameInput(idx)}
          </td>
          <td>
            {@render functionDisplay(idx)}
          </td>
          <td>
            {@render actions(idx, ro)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
{#if query !== "" && filtered.length === 0}
  <p class="empty">No items match “{query}”.</p>
{/if}
<div class="padding">
  <Button
    onclick={() => {
      readouts = [
        ...readouts,
        {
          id: `ro${readouts.length}`,
          fn: new Num(1.0),
          texName: `ro_${readouts.length}`,
        },
      ];
    }}>add new item</Button
  >
</div>

{#each readouts as ro, idx (ro.id)}
  <Popover
    size="md"
    popovertarget={`readout-eq-editor-${idx}`}
  >
    <EqEditor
      root={ro.fn}
      variables={variables}
      parameters={parameters}
      assignments={referenceable}
      reactions={reactions}
      nnBlocks={nnBlocks}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`readout-eq-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  /* General */
  .padding {
    padding: 1rem;
  }

  .empty {
    padding: 0 1rem;
    color: var(--color-text-muted);
  }

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
    min-width: 0;
  }

  /* Lets a wide equation scroll within its own cell instead of forcing the
     table (and everything around it, up to the popover) wider — see the
     `table-layout: fixed` rule below for why this only works together with
     that. `min-width: 0` overrides flexbox's default `min-width: auto`,
     which would otherwise refuse to shrink this below the equation's own
     content width. */
  .eq-scroll {
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
  }

  /* Input styles shared between table and cards */
  input {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  input:hover {
    border: var(--border-primary);
  }

  /* Card layout */
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: var(--shadow);
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
    color: #6b7280;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }

  .card-input,
  .card-value {
    width: 100%;
  }

  .card-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  /* Table layout */
  table {
    border-collapse: collapse;
    width: 100%;
    /* Fixed layout: column widths come from the rules below, not from cell
       content — otherwise a long equation in the Function column just makes
       the table (and its ancestors, up to the popover) grow instead of
       scrolling in place. */
    table-layout: fixed;
    text-align: left;
    text-indent: 0;
  }

  thead th:first-of-type {
    border-top-left-radius: 0.5rem;
  }
  thead th:last-of-type {
    border-top-right-radius: 0.5rem;
  }
  tbody tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 0.5rem;
  }
  tbody tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 0.5rem;
  }
  th:nth-child(1),
  td:nth-child(1) {
    width: 20%;
    min-width: 8rem;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 15%;
    min-width: 6rem;
  }
  /* Function (3rd column) gets no explicit width — it takes whatever's left
     of the fixed layout, bounded but still the largest share. */
  th:last-child,
  td:last-child {
    /* The general th/td padding below (1rem 1.5rem) alone is 3rem wide —
       more than this column's own width, leaving no room for the "Actions"
       header label once table-layout: fixed stops auto-widening the column
       to fit it. A tighter override here is enough for both the label and
       the single icon button the body cells hold. */
    padding: 0.75rem 0.5rem;
    width: 4rem;
    text-align: center;
  }
  /* text-align: center above only centers inline content (the "Actions"
     header text) — ButtonIcon's <button> is display: flex, a block-level
     box, so it ignores text-align entirely and needs its own centering. */
  td:last-child :global(button) {
    margin: 0 auto;
  }
  th {
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
  }
  tr {
    background-color: var(--color-surface);
  }
  tr:hover {
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: lch(from var(--color-surface) calc(l - 5) c h);
  }
</style>
