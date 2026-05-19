<script lang="ts">
  import { Icon } from "@computational-biology-aachen/design";
  import type { MouseEventHandler } from "svelte/elements";

  let {
    icon,
    onclick,
    popovertarget,
  }: {
    icon: string;
    onclick?: MouseEventHandler<HTMLButtonElement>;
    popovertarget?: string;
  } = $props();
</script>

<button {onclick} {popovertarget}>
  <Icon color="inherit" fontSize="inherit">{icon}</Icon>
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: var(--radius-full);
    background-color: var(--color-surface);
    width: 1.5rem;
    height: 1.5rem;
    color: var(--color-primary);
    font-size: 0.75rem;
  }
  button:hover {
    background-color: lch(from var(--color-primary) calc(l - 10) c h);
    color: white;
  }
</style>
