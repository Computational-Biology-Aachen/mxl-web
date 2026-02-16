<script lang="ts">
  import Popover from "../Popover.svelte";
  import type { AssView, ParView, RxnView, Variable, VarView } from "./model";
  import SliderEditor from "./SliderEditor.svelte";
  import TableAddButton from "./TableAddButton.svelte";
  import TableButtonClose from "./TableButtonClose.svelte";
  import TableButtonEdit from "./TableButtonEdit.svelte";

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

  function onSaveSlider(idx: number, update: Variable) {
    variables[idx][1] = update;
    variables = variables.slice();
  }
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Initial value</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each variables as [name], idx}
      <tr>
        <td>
          <input
            type="text"
            bind:value={
              () => variables[idx][0],
              (value) => {
                variables[idx][0] = value;
                variables = variables.slice();
              }
            }
          />
        </td>
        <td>
          <input
            type="number"
            bind:value={
              () => variables[idx][1].value,
              (value) => {
                variables[idx][1].value = value;
                variables = variables.slice();
              }
            }
          />
        </td>
        <td class="actions">
          <TableButtonEdit popovertarget="var-editor-{idx}" />
          <TableButtonClose
            onclick={() => {
              variables = variables.filter((i) => {
                return i[0] !== name;
              });
            }}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="padding">
  <TableAddButton
    onclick={() => {
      variables = [...variables, [`x${variables.length}`, { value: 1.0 }]];
    }}
  />
</div>

{#each variables as [name, variable], idx}
  <Popover size="sm" popovertarget={`var-editor-${idx}`}>
    <SliderEditor
      target={variable}
      onSave={(root) => onSaveSlider(idx, root)}
      popovertarget={`var-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  /* General */
  .padding {
    padding: 1rem;
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
    border: var(--border-transparent);
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  table input:hover {
    border: var(--border-primary);
  }

  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }
</style>
