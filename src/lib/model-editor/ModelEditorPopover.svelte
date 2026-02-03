<script lang="ts">
  import type { ModelBuilder } from "./model";
  import ModelEditor from "./ModelEditor.svelte";

  let {
    parent,
    onSave,
  }: {
    parent: ModelBuilder;
    onSave: (fn: ModelBuilder) => void;
  } = $props();
</script>

<div popover id="model-editor">
  <ModelEditor {parent} {onSave} popovertarget={`model-editor`} />
</div>

<style>
  [popover] {
    inset: unset;
    position: absolute;
    top: 2rem;
    left: 2rem;
    width: calc(100% - 4rem);
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
