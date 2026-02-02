<script lang="ts">
  import StoichEditor from "./StoichEditor.svelte";
  import { type Stoichiometry } from "./model";

  let {
    stoichiometry,
    variableNames,
    onSave,
    popovertarget,
  }: {
    stoichiometry: Stoichiometry;
    variableNames: string[];
    onSave: (fn: Stoichiometry) => void;
    popovertarget: string;
  } = $props();
</script>

<section class="page">
  <StoichEditor bind:stoichiometry {variableNames} />

  <button
    onclick={() => onSave(stoichiometry)}
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
