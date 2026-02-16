<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import type { MouseEventHandler } from "svelte/elements";

  let {
    onclick,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>;
  } = $props();
</script>

<button onclick={onclick}>
  <Icon
    color="inherit"
    fontSize="lg">add</Icon
  >
  add new item
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--primary);
    width: 10rem;
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
