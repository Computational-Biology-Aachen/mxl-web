<script lang="ts">
  import StoichEditor from "./StoichEditor.svelte";
  import { type Stoichs } from "./utils";

  let {
    stoichs,
    variables,
    onSave,
    popovertarget,
  }: {
    stoichs: Stoichs;
    variables: string[];
    onSave: (fn: Stoichs) => void;
    popovertarget: string;
  } = $props();
</script>

<section class="page">
  <StoichEditor bind:stoichs {variables} />

  <button
    onclick={() => onSave(stoichs)}
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
