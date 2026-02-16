<script lang="ts">
  import PopoverSaveButton from "./PopoverSaveButton.svelte";
  import StoichEditor from "./StoichEditor.svelte";
  import {
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
  } from "./model";

  let {
    stoichiometry,
    variables,
    parameters,
    assignments,
    reactions,
    onSave,
    popovertarget,
  }: {
    stoichiometry: Stoichiometry;
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    onSave: (fn: Stoichiometry) => void;
    popovertarget: string;
  } = $props();
</script>

<section class="page">
  <StoichEditor
    bind:stoichiometry
    {variables}
    {parameters}
    {assignments}
    {reactions}
  />

  <PopoverSaveButton {popovertarget} onclick={() => onSave(stoichiometry)} />
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
</style>
