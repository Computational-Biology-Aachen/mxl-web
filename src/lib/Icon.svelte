<script lang="ts">
  import "katex/dist/katex.min.css";
  import type { Snippet } from "svelte";

  let {
    children,
    color = "primary",
    fontSize = "inherit",
  }: {
    children: Snippet;
    color?: "primary" | "inherit";
    fontSize?: "inherit" | "sm" | "md" | "lg";
  } = $props();
</script>

<span class="material-symbols-outlined col-${color} ft-{fontSize}">
  {@render children()}
</span>

<style>
  .col-inherit {
    color: inherit;
  }
  .col-primary {
    color: var(--primary);
  }

  .ft-inherit {
    font-size: inherit;
  }
  .ft-sm {
    font-size: 0.875rem;
  }
  .ft-md {
    font-size: 0.925rem;
  }
  .ft-lg {
    font-size: 1rem;
  }
</style>
