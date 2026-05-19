<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, cols = 2 }: { children: Snippet; cols?: 2 | 3 | 4 } =
    $props();
</script>

<div class="grid cols-{cols}">
  {@render children()}
</div>

<style>
  .grid {
    display: inline-grid;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .cols-2 {
    grid-template-columns: 1fr 1fr;
  }

  .cols-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cols-4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
</style>
