<script lang="ts">
  import { Button, ButtonIcon as IconButton } from "@computational-biology-aachen/design";
  import { MediaQuery } from "svelte/reactivity";
  import {
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import TableSearch from "./TableSearch.svelte";
  import { fuzzyMatch } from "./utils";

  const md = new MediaQuery("max-width: 768px");

  // The four other model views are received for the same uniform table API
  // every other table component gets (see ModelEditor.svelte) — this one
  // reads `variables`/`parameters`/`assignments` (valid NN-block inputs) and
  // `variables` again (valid targets — a block corrects a variable's
  // dynamics, so it can't target a parameter or assignment), but only edits
  // `nnBlocks`.
  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    // eslint-disable-next-line no-useless-assignment
    reactions = $bindable(),
    nnBlocks = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
  } = $props();

  // Every name a block could legitimately reference as an input.
  let availableInputs = $derived([
    ...variables.map((v) => v.id),
    ...parameters.map((p) => p.id),
    ...assignments.map((a) => a.id),
  ]);
  let availableTargets = $derived(variables.map((v) => v.id));

  /** Parses a comma-separated name list, dropping blanks — used for the
   * inputs/targets fields below, which are plain text rather than a
   * validated multi-select (no such picker component exists yet in this
   * app; typed names are checked against `availableInputs`/
   * `availableTargets` and flagged, not silently accepted either way). */
  function parseNames(text: string): string[] {
    return text
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function unknownNames(names: string[], available: string[]): string[] {
    const known = new Set(available);
    return names.filter((n) => !known.has(n));
  }

  let query = $state("");
  let filtered = $derived(
    nnBlocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => fuzzyMatch(block.id, query)),
  );

  let nextSeed = 0;
  function addBlock() {
    nextSeed += 1;
    nnBlocks = [
      ...nnBlocks,
      {
        id: `block${nnBlocks.length}`,
        inputs: [],
        depth: 1,
        width: 4,
        seed: Date.now() + nextSeed,
        targets: [],
        trained: true,
      },
    ];
  }
</script>

{#snippet inputsField(idx: number)}
  <input
    type="text"
    placeholder="e.g. x, y"
    bind:value={
      () => nnBlocks[idx].inputs.join(", "),
      (value) => {
        nnBlocks[idx].inputs = parseNames(value);
        nnBlocks = nnBlocks.slice();
      }
    }
  />
  {#if unknownNames(nnBlocks[idx].inputs, availableInputs).length > 0}
    <p class="warning">
      Not in this model: {unknownNames(nnBlocks[idx].inputs, availableInputs).join(", ")}
    </p>
  {/if}
{/snippet}

{#snippet targetsField(idx: number)}
  <input
    type="text"
    placeholder="e.g. x"
    bind:value={
      () => nnBlocks[idx].targets.join(", "),
      (value) => {
        nnBlocks[idx].targets = parseNames(value);
        nnBlocks = nnBlocks.slice();
      }
    }
  />
  {#if unknownNames(nnBlocks[idx].targets, availableTargets).length > 0}
    <p class="warning">
      Not a variable in this model: {unknownNames(
        nnBlocks[idx].targets,
        availableTargets,
      ).join(", ")}
    </p>
  {/if}
{/snippet}

{#snippet depthWidthField(idx: number)}
  <div class="pair">
    <input
      type="number"
      min="1"
      step="1"
      aria-label="Hidden layers"
      bind:value={
        () => nnBlocks[idx].depth,
        (value) => {
          nnBlocks[idx].depth = Math.max(1, Math.round(value));
          nnBlocks = nnBlocks.slice();
        }
      }
    />
    <span>×</span>
    <input
      type="number"
      min="1"
      step="1"
      aria-label="Layer width"
      bind:value={
        () => nnBlocks[idx].width,
        (value) => {
          nnBlocks[idx].width = Math.max(1, Math.round(value));
          nnBlocks = nnBlocks.slice();
        }
      }
    />
  </div>
{/snippet}

{#snippet trainedField(idx: number)}
  <input
    type="checkbox"
    bind:checked={
      () => nnBlocks[idx].trained,
      (value) => {
        nnBlocks[idx].trained = value;
        nnBlocks = nnBlocks.slice();
      }
    }
  />
{/snippet}

{#snippet actions(_idx: number, id: string)}
  <IconButton
    icon="close"
    onclick={() => {
      nnBlocks = nnBlocks.filter((b) => b.id !== id);
    }}
  />
{/snippet}

<div class="padding">
  <TableSearch bind:value={query} />
</div>

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each filtered as { block, idx } (block.id)}
      <div class="card">
        <div class="card-row">
          <span class="card-label">Name</span>
          {block.id}
        </div>
        <div class="card-row">
          <span class="card-label">Inputs</span>
          <div class="card-input">{@render inputsField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Architecture</span>
          <div class="card-input">{@render depthWidthField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Targets</span>
          <div class="card-input">{@render targetsField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Train when fitting</span>
          {@render trainedField(idx)}
        </div>
        <div class="card-row card-actions">
          {@render actions(idx, block.id)}
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
        <th>Inputs</th>
        <th>Layers</th>
        <th>Targets</th>
        <th>Train</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as { block, idx } (block.id)}
        <tr>
          <td>{block.id}</td>
          <td>{@render inputsField(idx)}</td>
          <td>{@render depthWidthField(idx)}</td>
          <td>{@render targetsField(idx)}</td>
          <td>{@render trainedField(idx)}</td>
          <td class="actions">{@render actions(idx, block.id)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
{#if query !== "" && filtered.length === 0}
  <p class="empty">No items match “{query}”.</p>
{/if}
<div class="padding">
  <Button onclick={addBlock}>add NN block</Button>
</div>

<style>
  .padding {
    padding: 1rem;
  }
  .empty {
    padding: 0 1rem;
    color: var(--color-text-muted);
  }
  .warning {
    margin: 0.25rem 0 0;
    color: var(--color-warning, #b45309);
    font-size: 0.75rem;
  }
  .pair {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .pair input {
    width: 4rem;
  }

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
  .card-input {
    width: 100%;
  }
  .card-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
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
  th:last-child,
  td:last-child {
    width: 3rem;
    text-align: center;
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
  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }
</style>
