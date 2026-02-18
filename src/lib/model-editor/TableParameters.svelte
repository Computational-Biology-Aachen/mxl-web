<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import TableAddButton from "../buttons/TableAddButton.svelte";
  import TableButtonClose from "../buttons/TableButtonClose.svelte";
  import TableButtonEdit from "../buttons/TableButtonEdit.svelte";
  import Popover from "../Popover.svelte";
  import { defaultTexName, defaultValue } from "./modelUtils";
  import {
    type AssView,
    type Parameter,
    type ParView,
    type RxnView,
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

  function onSaveSlider(idx: number, update: Parameter) {
    parameters[idx] = update;
    parameters = parameters.slice();
  }
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => defaultValue(parameters[idx].displayName, parameters[idx].id),
      (value) => {
        parameters[idx].displayName = value;
        parameters[idx].texName = defaultTexName(value);
        parameters = parameters.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => parameters[idx].texName,
      (value) => {
        parameters[idx].texName = value;
        parameters = parameters.slice();
      }
    }
  />
{/snippet}

{#snippet valueInput(idx: number)}
  <input
    type="number"
    bind:value={
      () => parameters[idx].value, (value) => (parameters[idx].value = value)
    }
  />
{/snippet}

{#snippet actions(idx: number, par: Parameter)}
  <TableButtonEdit popovertarget="var-editor-{idx}" />
  <TableButtonClose
    onclick={() => {
      parameters = parameters.filter((i) => {
        return i.id !== par.id;
      });
    }}
  />
{/snippet}

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each parameters as par, idx}
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
          {@render actions(idx, par)}
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
      {#each parameters as par, idx}
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
            {@render actions(idx, par)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
<div class="padding">
  <TableAddButton
    onclick={() => {
      parameters = [
        ...parameters,
        {
          id: `p${parameters.length}`,
          value: 1.0,
          texName: `p_${parameters.length}`,
        },
      ];
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
  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }
</style>
