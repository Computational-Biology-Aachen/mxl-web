<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    display: inline-grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }
</style>
