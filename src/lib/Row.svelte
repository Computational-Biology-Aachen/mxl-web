<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, klass = "" }: { children: Snippet; klass?: string } =
    $props();
</script>

<div class={klass}>
  {@render children()}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
