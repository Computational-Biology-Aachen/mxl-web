<script lang="ts">
  import type {
    AssView,
    ParView,
    RxnView,
    Stoichiometry,
    VarView,
  } from "./model";

  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
  } = $props();

  import Math from "$lib/Math.svelte";
  import { Base } from "$lib/mathml";
  import EqEditorPopover from "$lib/model-editor/EqEditorPopover.svelte";
  import StoichEditorPopover from "./StoichEditorPopover.svelte";

  function onSaveEq(idx: number, fn: Base) {
    reactions[idx][1].fn = fn;
    reactions = reactions.slice();
  }
  function onSaveStoichs(idx: number, stoichiometry: Stoichiometry) {
    reactions[idx][1].stoichiometry = stoichiometry;
    reactions = reactions.slice();
  }

  let variableNames = $derived.by(() => variables.map((el) => el[0]));
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Rate law</th>
      <th>Stoichiometry</th>
    </tr>
  </thead>
  <tbody>
    {#each reactions as [name], idx}
      <tr>
        <td> <input type="text" bind:value={reactions[idx][0]} /> </td>
        <td>
          <div class="row">
            <Math tex={reactions[idx][1].fn.toTex()} display={true} />
            <button popovertarget="eq-editor-{idx}">Edit</button>
          </div>
        </td>
        <td>
          <div class="row">
            <!-- <Math tex={stoichsToTex(stoichs)} display={true} /> -->
            <button popovertarget="stoich-editor-{idx}">Edit</button>
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button>+ add new item</button>
  <button class="save">Save</button>
</div>

{#each reactions as [name, { fn, stoichiometry }], idx}
  <div popover id="eq-editor-{idx}">
    <EqEditorPopover
      root={fn}
      {variableNames}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
    />
  </div>
  <div popover id="stoich-editor-{idx}">
    <StoichEditorPopover
      {stoichiometry}
      {variableNames}
      onSave={(stoichs) => onSaveStoichs(idx, stoichs)}
      popovertarget={`stoich-editor-${idx}`}
    />
  </div>
{/each}

<style>
  table {
    font-size: 0.75rem;
  }
  table thead {
    font-size: 0.9rem;
    font-weight: 500;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
  button.save {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
</style>
