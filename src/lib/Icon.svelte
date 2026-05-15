<script lang="ts">
  import "katex/dist/katex.min.css";
  import type { Snippet } from "svelte";

  let {
    children,
    color = "primary",
    fontSize = "inherit",
    style = "",
    klass = "",
  }: {
    children: Snippet;
    color?: "primary" | "inherit" | "c1" | "c2" | "c3" | "c4";
    fontSize?: "inherit" | "sm" | "md" | "lg";
    style?: string;
    klass?: string;
  } = $props();
</script>

<span
  class="material-symbols-outlined col-{color} ft-{fontSize} {klass}"
  style={style}
>
  {@render children()}
</span>

<style>
  .col-inherit {
    color: inherit;
  }
  .col-primary {
    color: var(--primary);
  }

  .col-c1 {
    color: #135bec;
  }
  .col-c2 {
    color: #006466;
  }
  .col-c3 {
    color: #570066;
  }
  .col-c4 {
    color: #ed1379;
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
