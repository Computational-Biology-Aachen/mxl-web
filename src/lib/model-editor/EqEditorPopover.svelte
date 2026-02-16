<script lang="ts">
  import { Base } from "$lib/mathml";
  import EqEditor from "$lib/model-editor/EqEditor.svelte";
  import type { AssView, ParView, RxnView, VarView } from "./model";
  import PopoverSaveButton from "./PopoverSaveButton.svelte";

  let {
    root,
    variables,
    parameters,
    assignments,
    reactions,
    onSave,
    popovertarget,
  }: {
    root: Base;
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    onSave: (fn: Base) => void;
    popovertarget: string;
  } = $props();
</script>

<section class="page">
  <EqEditor bind:root {variables} {parameters} {assignments} {reactions} />
  <PopoverSaveButton onclick={() => onSave(root)} {popovertarget} />
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
</style>
