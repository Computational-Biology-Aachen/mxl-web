<script lang="ts">
  import type { AssView, ParView, RxnView, VarView } from "./model";

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

  function onSaveEq(idx: number, fn: Base) {
    assignments[idx][1].fn = fn;
    assignments = assignments.slice();
  }

  let variableNames = $derived.by(() => variables.map((el) => el[0]));
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Function</th>
      <th>Edit</th>
    </tr>
  </thead>
  <tbody>
    {#each assignments as [], idx}
      <tr>
        <td>
          <input type="text" bind:value={assignments[idx][0]} />
        </td>
        <td>
          <Math tex={assignments[idx][1].fn.toTex()} display={true} />
        </td>
        <td>
          <button popovertarget="eq-editor-{idx}">Edit</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button
    onclick={() => {
      assignments = [
        ...assignments,
        [`x${variables.length}`, { fn: new Num(1.0), args: [] }],
      ];
    }}>+ add new item</button
  >
  <button class="save">Save</button>
</div>

{#each assignments as [name, { fn }], idx}
  <div popover id="eq-editor-{idx}">
    <EqEditorPopover
      root={fn}
      {variableNames}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
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
    margin-bottom: 2rem;
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
  td:nth-last-child(1) {
    text-align: right;
  }
</style>
