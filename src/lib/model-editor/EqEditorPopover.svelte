<script lang="ts">
  import { Base } from "$lib/mathml";
  import EqEditor from "$lib/model-editor/EqEditor.svelte";

  let {
    root,
    variableNames,
    onSave,
    popovertarget,
  }: {
    root: Base;
    variableNames: string[];
    onSave: (fn: Base) => void;
    popovertarget: string;
  } = $props();
</script>

<section class="page">
  <EqEditor bind:root {variableNames} />

  <button
    onclick={() => onSave(root)}
    popovertargetaction="hide"
    {popovertarget}>Save</button
  >
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
</style>
