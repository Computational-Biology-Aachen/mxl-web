<script lang="ts">
  import TableAddButton from "../buttons/TableAddButton.svelte";
  import TableButtonClose from "../buttons/TableButtonClose.svelte";
  import TableButtonEdit from "../buttons/TableButtonEdit.svelte";
  import Popover from "../Popover.svelte";
  import { defaultValue } from "./modelUtils";
  import {
    type AssView,
    type Parameter,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import SliderEditor from "./SliderEditor.svelte";

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

  function onSaveSlider(idx: number, update: Parameter) {
    parameters[idx] = update;
    parameters = parameters.slice();
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
    {#each parameters as par, idx}
      <tr>
        <td>
          <input
            type="text"
            bind:value={
              () =>
                defaultValue(parameters[idx].displayName, parameters[idx].id),
              (value) => {
                parameters[idx].displayName = value;
                parameters = parameters.slice();
              }
            }
          />
        </td>
        <td>
          <input
            type="number"
            bind:value={
              () => parameters[idx].value,
              (value) => (parameters[idx].value = value)
            }
          />
        </td>
        <td class="actions">
          <TableButtonEdit popovertarget="var-editor-{idx}" />
          <TableButtonClose
            onclick={() => {
              parameters = parameters.filter((i) => {
                return i.id !== par.id;
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
      parameters = [...parameters, { id: `p${parameters.length}`, value: 1.0 }];
    }}
  />
</div>

{#each parameters as par, idx}
  <Popover
    size="sm"
    popovertarget={`var-editor-${idx}`}
  >
    <SliderEditor
      target={par}
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
