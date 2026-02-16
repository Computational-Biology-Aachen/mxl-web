<script lang="ts">
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

  <button
    class="save"
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

  /* Save button */
  button.save {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    width: 8rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.save:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
