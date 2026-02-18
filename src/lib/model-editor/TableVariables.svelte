<script lang="ts">
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import TableAddButton from "../buttons/TableAddButton.svelte";
  import TableButtonClose from "../buttons/TableButtonClose.svelte";
  import TableButtonEdit from "../buttons/TableButtonEdit.svelte";
  import Popover from "../Popover.svelte";
  import { defaultTexName, defaultValue } from "./modelUtils";
  import {
    type AssView,
    type ParView,
    type RxnView,
    type Variable,
    type VarView,
  } from "./modelView";
  import SliderEditor from "./SliderEditor.svelte";

  const md = new MediaQuery("max-width: 768px");

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
    variables[idx] = update;
    variables = variables.slice();
  }
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => defaultValue(variables[idx].displayName, variables[idx].id),
      (value) => {
        variables[idx].displayName = value;
        variables[idx].texName = defaultTexName(value);
        variables = variables.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => variables[idx].texName,
      (value) => {
        variables[idx].texName = value;
        variables = variables.slice();
      }
    }
  />
{/snippet}

{#snippet valueInput(idx: number)}
  <InputNumber
    id="var-{idx}"
    border="transparent"
    bind:value={
      () => variables[idx].value,
      (value) => {
        variables[idx].value = value;
        variables = variables.slice();
      }
    }
  />
{/snippet}

{#snippet actions(idx: number, vari: Variable)}
  <TableButtonEdit popovertarget="var-editor-{idx}" />
  <TableButtonClose
    onclick={() => {
      variables = variables.filter((i) => {
        return i.id !== vari.id;
      });
    }}
  />
{/snippet}

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each variables as vari, idx}
      <div class="card">
        <div class="card-row">
          <span class="card-label">Name</span>
          <div class="card-input">
            {@render nameInput(idx)}
          </div>
        </div>
        <div class="card-row">
          <span class="card-label">Tex name</span>
          <div class="card-input">
            {@render texNameInput(idx)}
          </div>
        </div>
        <div class="card-row">
          <span class="card-label">Initial value</span>
          <div class="card-input">
            {@render valueInput(idx)}
          </div>
        </div>
        <div class="card-row card-actions">
          {@render actions(idx, vari)}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <!-- Table layout for desktop -->
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Tex name</th>
        <th>Initial value</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each variables as vari, idx}
        <tr>
          <td>
            {@render nameInput(idx)}
          </td>
          <td>
            {@render texNameInput(idx)}
          </td>
          <td>
            {@render valueInput(idx)}
          </td>
          <td class="actions">
            {@render actions(idx, vari)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<div class="padding">
  <TableAddButton
    onclick={() => {
      variables = [
        ...variables,
        {
          id: `x${variables.length}`,
          value: 1.0,
          texName: `x${variables.length}`,
        },
      ];
    }}
  />
</div>

{#each variables as vari, idx}
  <Popover
    size="sm"
    popovertarget={`var-editor-${idx}`}
  >
    <SliderEditor
      target={vari}
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

  /* Input styles shared between table and cards */
  input {
    border: var(--border-transparent);
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  input:hover {
    border: var(--border-primary);
  }

  /* Card layout */
  .card-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: var(--shadow);
    border: var(--border);
    border-radius: 0.5rem;
    background-color: var(--bg-l1);
    padding: 1rem;
  }

  .card-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .card-label {
    color: #6b7280;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }

  .card-input {
    width: 100%;
  }

  .card-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  /* Table layout */
  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    text-align: left;
    text-indent: 0;
  }

  tr {
    display: table-row;
    background-color: var(--bg-l1);
  }

  th {
    display: table-cell;
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }

  td {
    display: table-cell;
    padding: 1rem 1.5rem;
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

  tr:hover {
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: lch(from var(--bg-l1) calc(l - 5) c h);
  }

  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }
</style>
