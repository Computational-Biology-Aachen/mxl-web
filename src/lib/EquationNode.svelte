<script lang="ts">
  import EquationNode from "./EquationNode.svelte";
  import type { Add, Base, Divide, Mul, Name, Num } from "./mathml";

  let {
    node,
    selectedId,
    onSelect,
  }: {
    node: Base;
    selectedId: number;
    onSelect: (node: Base) => void;
  } = $props();

  const selectSelf = () => onSelect(node);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={`node node-${node.constructor.name}`}
  data-selected={selectedId === node.id}
  onclick={(e) => {
    e.stopPropagation();
    selectSelf();
  }}
>
  {#if node.constructor.name === "Divide"}
    <div class="divide">
      <div class="child">
        <EquationNode
          node={(node as Divide).children[0]}
          {selectedId}
          {onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select divide"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        /
      </button>
      <div class="child">
        <EquationNode
          node={(node as Divide).children[1]}
          {selectedId}
          {onSelect}
        />
      </div>
    </div>
  {:else if node.constructor.name === "Mul"}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Mul).children[0]}
          {selectedId}
          {onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select mul"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        x
      </button>
      <div class="child">
        <EquationNode
          node={(node as Mul).children[1]}
          {selectedId}
          {onSelect}
        />
      </div>
    </div>
  {:else if node.constructor.name === "Add"}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Add).children[0]}
          {selectedId}
          {onSelect}
        />
      </div>
      <button
        class="op"
        aria-label="Select mul"
        onclick={(e) => {
          e.stopPropagation();
          selectSelf();
        }}
      >
        +
      </button>
      <div class="child">
        <EquationNode
          node={(node as Add).children[1]}
          {selectedId}
          {onSelect}
        />
      </div>
    </div>
  {:else if node.constructor.name === "Name"}
    <div class="leaf">
      <span class="value">{(node as Name).name}</span>
    </div>
  {:else if node.constructor.name === "Num"}
    <div class="leaf">
      <span class="value">{(node as Num).value}</span>
    </div>
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
    font-weight: 700;
    cursor: pointer;
    display: grid;
    place-items: center;
    line-height: 1;
    padding: 0;
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
</style>
