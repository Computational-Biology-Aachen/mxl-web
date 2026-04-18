<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    size,
    children,
    popovertarget,
    el = $bindable<HTMLDivElement | null | undefined>(),
  }: {
    size: "xs" | "sm" | "md" | "lg";
    popovertarget: string;
    children: Snippet;
    el?: HTMLDivElement | null;
  } = $props();
</script>

<div
  popover
  bind:this={el}
  id={popovertarget}
  class={size}
>
  <section>
    {@render children()}
  </section>
</div>

<style>
  [popover] {
    position: fixed;
    inset: unset;
    box-shadow: var(--shadow);
    border: var(--border-heavy);
    border-radius: var(--border-radius);
    overflow-y: scroll;
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  .xs {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(22rem, calc(100vw - 2rem));
  }
  .sm {
    --width: 60rem;
    --dist: max(0px, (100vw - var(--width)) / 2);
    top: clamp(1rem, var(--dist), 10rem);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
    max-height: calc(100vh - 2 * clamp(1rem, var(--dist), 10rem));
  }
  .md {
    --dist: 4rem;
    top: var(--dist);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
  }
  .lg {
    --dist: 0;
    top: var(--dist);
    left: var(--dist);
    width: 100%;

    @media (min-width: 768px) {
      --dist: 2rem;
      width: calc(100vw - 2 * var(--dist));
      height: calc(100vh - 2 * var(--dist));
    }
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
  }
</style>
