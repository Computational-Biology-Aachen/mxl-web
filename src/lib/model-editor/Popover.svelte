<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    popovertarget,
  }: {
    popovertarget: string;
    children: Snippet;
  } = $props();
</script>

<div popover id={popovertarget}>
  {@render children()}
</div>

<style>
  [popover] {
    position: fixed;
    inset: unset;
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .sm {
    --width: 60rem;
    --dist: max(0px, (100vw - var(--width)) / 2);
    top: clamp(1rem, var(--dist), 10rem);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
  }
  .md {
    --dist: 4rem;
    top: var(--dist);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
  }
  .lg {
    --dist: 2rem;
    top: var(--dist);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
  }
</style>
