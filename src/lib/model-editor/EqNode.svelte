<script lang="ts">
  import type { Base } from "$lib/mathml";
  import { Add, Divide, Minus, Mul, Name, Num } from "$lib/mathml";
  import EquationNode from "$lib/model-editor/EqNode.svelte";

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

  function getNodeClassName(node: Base): string {
    if (node instanceof Divide) return "Divide";
    if (node instanceof Mul) return "Mul";
    if (node instanceof Add) return "Add";
    if (node instanceof Minus) return "Minus";
    if (node instanceof Name) return "Name";
    if (node instanceof Num) return "Num";
    return "";
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={`node node-${getNodeClassName(node)}`}
  data-selected={selectedId === node.id}
  onclick={(e) => {
    e.stopPropagation();
    selectSelf();
  }}
>
  {#if node instanceof Divide}
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
  {:else if node instanceof Mul}
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
  {:else if node instanceof Add}
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
  {:else if node instanceof Minus}
    <div class="mul">
      <div class="child">
        <EquationNode
          node={(node as Minus).children[0]}
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
        -
      </button>
      <div class="child">
        <EquationNode
          node={(node as Minus).children[1]}
          {selectedId}
          {onSelect}
        />
      </div>
    </div>
  {:else if node instanceof Name}
    <div class="leaf">
      <span class="value">{(node as Name).name}</span>
    </div>
  {:else if node instanceof Num}
    <div class="leaf">
      <span class="value">{(node as Num).value}</span>
    </div>
  {/if}
</div>

<style>
  .node {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: var(--shadow);
    border: 1px solid #d7d7d7;
    border-radius: 10px;
    background: #fafafa;
    padding: 0.75rem;
  }

  .node[data-selected="true"] {
    box-shadow: var(--shadow);
    border-color: var(--primary);
    background: rgb(from var(--primary) r g b / 5%);
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
    display: grid;
    place-items: center;
    cursor: pointer;
    border: 1px solid var(--primary);
    border-radius: 50%;
    background: var(--primary);
    padding: 0;
    width: 2.5rem;
    height: 2.5rem;
    color: #fff;
    font-weight: 700;
    line-height: 1;
  }

  .leaf {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.35rem;
    border-radius: 999px;
    background: #e2e8f0;
    padding: 0.35rem 0.55rem;
    color: #1f2937;
    font-weight: 600;
  }

  .badge {
    color: #4b5563;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .value {
    font-size: 1rem;
  }
</style>
