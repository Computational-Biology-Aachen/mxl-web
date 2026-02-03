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
    </tr>
  </thead>
  <tbody>
    {#each assignments as [], idx}
      <tr>
        <td>
          <input type="text" bind:value={assignments[idx][0]} />
        </td>
        <td>
          <div class="row">
            <Math
              tex={assignments[idx][1].fn.toTex()}
              display={true}
              fontSize={"0.75rem"}
            />

            <button class="btn-inline" popovertarget="eq-editor-{idx}"
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
    assignments = [
      ...assignments,
      [`a${assignments.length}`, { fn: new Num(1.0), args: [] }],
    ];
  }}
  >+ add new item
</button>

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
