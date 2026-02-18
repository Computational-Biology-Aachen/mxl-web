<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    justify = "start",
  }: { children: Snippet; justify?: "start" | "end" } = $props();
</script>

<div class="justify-{justify}">
  {@render children()}
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
  .justify-start {
    justify-content: start;
  }
  .justify-end {
    justify-content: start;
  }

  @media (min-width: 768px) {
    .justify-end {
      justify-content: end;
    }
  }
</style>
