<script lang="ts">
  import type { MouseEventHandler } from "svelte/elements";

  let {
    onclick,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>;
  } = $props();
</script>

<button onclick={onclick}> Reset </button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--primary);
    padding: 0 1rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
