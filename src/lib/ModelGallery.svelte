<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    children,
  }: {
    title: string;
    children: Snippet;
  } = $props();
</script>

<section>
  <h3>{title}</h3>
  <div class="grid">
    {@render children()}
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
</style>
