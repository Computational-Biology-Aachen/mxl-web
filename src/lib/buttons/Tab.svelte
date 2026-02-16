<script lang="ts">
  import type { Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  let {
    selected,
    onclick,
    children,
  }: {
    selected: boolean;
    children: Snippet;
    onclick: MouseEventHandler<HTMLButtonElement>;
  } = $props();
</script>

<button
  class:selected={selected}
  onclick={onclick}
>
  {@render children()}
</button>

<style>
  button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin: 0 1rem;
    border: none;
    background-color: transparent;
    padding: 0.3rem 0.2rem;
    color: var(--slate-500);
    font-weight: 700;
    font-size: 0.84rem;
  }
  button:hover {
    color: var(--slate);
  }
  .selected {
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
  }
</style>
