<script lang="ts">
  import type { EditorNode } from "$lib/editorTypes";

  export let node: EditorNode;
  export let selectedId: string;
  export let variables: string[];
  export let onSelect: (id: string) => void;
  export let onUpdateSymbol: (id: string, name: string) => void;
  export let onUpdateNumber: (id: string, value: number) => void;

  const selectSelf = () => onSelect(node.id);

  function handleSymbolChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    onUpdateSymbol(node.id, target.value);
  }

  function handleNumberChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    if (!Number.isNaN(value)) {
      onUpdateNumber(node.id, value);
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={`node node-${node.type}`}
  data-selected={selectedId === node.id}
  on:click|stopPropagation={selectSelf}
>
  {#if node.type === "divide"}
    <div class="divide">
      <div class="child">
        <svelte:self
          node={node.children[0]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
      <button
        class="op"
        aria-label="Select divide"
        on:click|stopPropagation={selectSelf}
      >
        /
      </button>
      <div class="child">
        <svelte:self
          node={node.children[1]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
    </div>
  {:else if node.type === "mul"}
    <div class="mul">
      <div class="child">
        <svelte:self
          node={node.children[0]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
      <button
        class="op"
        aria-label="Select mul"
        on:click|stopPropagation={selectSelf}
      >
        *
      </button>
      <div class="child">
        <svelte:self
          node={node.children[1]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
    </div>
  {:else if node.type === "add"}
    <div class="mul">
      <div class="child">
        <svelte:self
          node={node.children[0]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
      <button
        class="op"
        aria-label="Select mul"
        on:click|stopPropagation={selectSelf}
      >
        +
      </button>
      <div class="child">
        <svelte:self
          node={node.children[1]}
          {selectedId}
          {variables}
          {onSelect}
          {onUpdateSymbol}
          {onUpdateNumber}
        />
      </div>
    </div>
  {:else if node.type === "symbol"}
    <div class="leaf">
      <!-- <span class="badge">var</span> -->
      <span class="value">{node.name}</span>
    </div>
    {#if selectedId === node.id}
      <div class="edit-row" on:click|stopPropagation>
        <label for={`symbol-${node.id}`}>Variable</label>
        <select
          id={`symbol-${node.id}`}
          value={node.name}
          on:change={handleSymbolChange}
        >
          {#each variables as variable}
            <option value={variable} selected={variable === node.name}
              >{variable}</option
            >
          {/each}
        </select>
      </div>
    {/if}
  {:else if node.type === "number"}
    <div class="leaf">
      <span class="badge">num</span>
      <span class="value">{node.value}</span>
    </div>
    {#if selectedId === node.id}
      <div class="edit-row" on:click|stopPropagation>
        <label for={`number-${node.id}`}>Value</label>
        <input
          id={`number-${node.id}`}
          type="number"
          step="0.1"
          value={node.value}
          on:input={handleNumberChange}
        />
      </div>
    {/if}
  {/if}
</div>

<style>
  .node {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    padding: 0.75rem;
    background: #fafafa;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .node[data-selected="true"] {
    border-color: #0f766e;
    box-shadow: 0 0 0 2px rgba(15, 118, 110, 0.2);
    background: #f0fdfa;
  }

  .divide {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .mul {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .child {
    flex: 1;
  }

  .op {
    border: 1px solid #0f766e;
    background: #0f766e;
    color: #fff;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: grid;
    place-items: center;
    font-weight: 700;
    cursor: pointer;
  }

  .leaf {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.35rem 0.55rem;
    background: #e2e8f0;
    border-radius: 999px;
    font-weight: 600;
    color: #1f2937;
  }

  .badge {
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    color: #4b5563;
  }

  .value {
    font-size: 1rem;
  }

  .edit-row {
    margin-top: 0.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.35rem 0.6rem;
    align-items: center;
  }

  label {
    font-size: 0.9rem;
    color: #374151;
  }

  select,
  input[type="number"] {
    width: 100%;
    padding: 0.35rem 0.5rem;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 0.95rem;
  }
</style>
