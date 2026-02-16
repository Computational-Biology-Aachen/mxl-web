<script lang="ts">
  import {
    getTexNames,
    type AssView,
    type ParView,
    type RxnView,
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

  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Base, Num } from "$lib/mathml";
  import Popover from "../Popover.svelte";
  import EqEditor from "./EqEditor.svelte";

  function onSaveEq(idx: number, fn: Base) {
    assignments[idx][1].fn = fn;
    assignments = assignments.slice();
  }

  let texNames: Map<string, string> = $derived(
    getTexNames(variables, parameters, assignments, reactions),
  );
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Function</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each assignments as [name], idx}
      <tr>
        <td>
          <input
            type="text"
            bind:value={
              () => assignments[idx][0],
              (value) => {
                assignments[idx][0] = value;
                assignments = assignments.slice();
              }
            }
          />
        </td>
        <td>
          <div class="row">
            <Math
              tex={assignments[idx][1].fn.toTex(texNames)}
              display={true}
              fontSize={"0.75rem"}
            />

            <button class="edit" popovertarget="eq-editor-{idx}"
              ><Icon>edit</Icon></button
            >
          </div>
        </td>
        <td>
          <button
            class="close"
            onclick={() => {
              assignments = assignments.filter((i) => {
                return i[0] !== name;
              });
            }}><Icon>close</Icon></button
          >
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="padding">
  <button
    class="add"
    onclick={() => {
      assignments = [
        ...assignments,
        [`a${assignments.length}`, { fn: new Num(1.0) }],
      ];
    }}
    >+ add new item
  </button>
</div>

{#each assignments as [name, { fn }], idx}
  <Popover size="md" popovertarget={`eq-editor-${idx}`}>
    <EqEditor
      root={fn}
      {variables}
      {parameters}
      {assignments}
      {reactions}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  /* General */
  .padding {
    padding: 1rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }

  /* Table */
  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    text-align: left;
    text-indent: 0;
  }

  thead th:first-of-type {
    border-top-left-radius: 0.5rem;
  }
  thead th:last-of-type {
    border-top-right-radius: 0.5rem;
  }
  tbody tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 0.5rem;
  }
  tbody tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 0.5rem;
  }
  th:last-child,
  td:last-child {
    width: 3rem;
    text-align: center;
  }
  th {
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
  }
  tr {
    background-color: var(--bg-l1);
  }
  tr:hover {
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: lch(from var(--bg-l1) calc(l - 5) c h);
  }
  table input {
    border: 1px solid transparent;
    border-radius: 0.5rem;
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  table input:hover {
    border: 1px solid var(--primary);
  }

  /* Close button */
  button.close {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 5rem;
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    font-size: 0.75rem;
  }
  button.close:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
  }

  /* Add button */
  button.add {
    cursor: pointer;
    margin: 0rem;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    padding: 0 1rem;
    width: 10rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.add:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
  }

  /* Edit button */
  button.edit {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: 5rem;
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: black;
    font-size: 0.75rem;
  }
  button.edit:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
  }
</style>
