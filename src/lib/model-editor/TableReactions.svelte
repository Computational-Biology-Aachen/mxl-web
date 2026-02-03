<script lang="ts">
  import {
    stoichToTex,
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
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
  import { Base, Num } from "$lib/mathml";
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

  let varNames = $derived(variables.map((el) => el[0]));
  let argNames = $derived.by(() => {
    return [...variables.map((el) => el[0]), ...assignments.map((el) => el[0])];
  });
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
            <Math
              tex={reactions[idx][1].fn.toTex()}
              display={true}
              fontSize={"0.75rem"}
            />
            <button class="btn-inline" popovertarget="eq-editor-{idx}"
              >Edit</button
            >
          </div>
        </td>
        <td>
          <div class="row">
            <Math
              tex={stoichToTex(reactions[idx][1].stoichiometry)}
              display={true}
              fontSize={"0.75rem"}
            />
            <button class="btn-inline" popovertarget="stoich-editor-{idx}"
              >Edit</button
            >
          </div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<button
  class="btn-add"
  onclick={() => {
    reactions = [
      ...reactions,
      [
        `v${reactions.length}`,
        { fn: new Num(1.0), args: [], stoichiometry: [] },
      ],
    ];
  }}
  >+ add new item
</button>

{#each reactions as [name, { fn, stoichiometry }], idx}
  <div popover id="eq-editor-{idx}">
    <EqEditorPopover
      root={fn}
      variableNames={argNames}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
    />
  </div>
  <div popover id="stoich-editor-{idx}">
    <StoichEditorPopover
      {stoichiometry}
      variableNames={varNames}
      onSave={(stoichs) => onSaveStoichs(idx, stoichs)}
      popovertarget={`stoich-editor-${idx}`}
    />
  </div>
{/each}

<style>
  table {
    font-size: 0.75rem;
    padding: 0;
    margin: 0;
  }
  table thead {
    font-size: 1rem;
    font-weight: 500;
  }
  table td {
    margin: 0;
    padding: 2px;
  }
  table input {
    font-size: 0.75rem;
    height: 1.5rem;
    padding: 0 8px;
    margin: 0;
  }
  .btn-inline {
    font-size: 0.75rem;
    height: 1.5rem;
    padding: 0 4px;
    margin: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }
  .btn-add {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
  [popover] {
    inset: unset;
    position: absolute;
    top: 4rem;
    left: 4rem;
    width: calc(100% - 8rem);
  }
  [popover]::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
