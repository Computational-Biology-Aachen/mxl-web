<!--
  @component

  Collapsed view of an expression in a table row: rendered inline on a
  single line, clipped with a fade so rows keep a fixed height. The full
  expression is shown when the row is expanded.

  ### Props

  - `tex: string`
    The LaTeX source to render.
-->
<script lang="ts">
  import { Math } from "@computational-biology-aachen/design";

  let { tex }: { tex: string } = $props();
</script>

<div class="expr">
  <Math
    tex={tex}
    display={false}
    fontSize="0.85rem"
  />
</div>

<style>
  .expr {
    mask-image: linear-gradient(to right, black calc(100% - 2rem), transparent);
    overflow: hidden;
    white-space: nowrap;
  }
</style>
