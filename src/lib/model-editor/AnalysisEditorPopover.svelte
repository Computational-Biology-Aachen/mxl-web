<script lang="ts">
  import AnalysisEditor from "./AnalysisEditor.svelte";

  type Analysis = {
    tEnd: number;
    yMax: number | undefined;
  };

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: Analysis;
    onSave: (options: Analysis) => void;
    popovertarget: string;
  } = $props();
</script>

<div popover id={popovertarget}>
  <AnalysisEditor {parent} {onSave} {popovertarget} />
</div>

<style>
  [popover] {
    --width: 60rem;
    --dist: max(0px, (100vw - var(--width)) / 2);
    position: fixed;
    inset: unset;
    top: clamp(1rem, var(--dist), 10rem);
    left: var(--dist);
    width: calc(100% - 2 * var(--dist));
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
