<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import {
    idToTex,
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
  } from "./modelView";

  const md = new MediaQuery("max-width: 768px");

  import { defaultTexName, defaultValue } from "./modelUtils";

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
  import { Base, Name, Num } from "$lib/mathml";
  import TableAddButton from "../buttons/TableAddButton.svelte";
  import TableButtonClose from "../buttons/TableButtonClose.svelte";
  import TableButtonEdit from "../buttons/TableButtonEdit.svelte";
  import Popover from "../Popover.svelte";
  import EqEditor from "./EqEditor.svelte";
  import { stoichToTex } from "./modelUtils";
  import StoichEditor from "./StoichEditor.svelte";

  function onSaveEq(idx: number, fn: Base) {
    reactions[idx].fn = fn;
    reactions = reactions.slice();
  }
  function onSaveStoichs(idx: number, stoichiometry: Stoichiometry) {
    reactions[idx].stoichiometry = stoichiometry;
    reactions = reactions.slice();
  }

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );
</script>

{#snippet nameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => defaultValue(reactions[idx].displayName, reactions[idx].id),
      (value) => {
        reactions[idx].displayName = value;
        reactions[idx].texName = defaultTexName(value);
        reactions = reactions.slice();
      }
    }
  />
{/snippet}

{#snippet texNameInput(idx: number)}
  <input
    type="text"
    bind:value={
      () => reactions[idx].texName || "",
      (value) => {
        reactions[idx].texName = value;
        reactions = reactions.slice();
      }
    }
  />
{/snippet}

{#snippet rateLawDisplay(idx: number)}
  <div class="row">
    <Math
      tex={reactions[idx].fn.toTex(texNames)}
      display={true}
      fontSize={"0.75rem"}
    />
    <TableButtonEdit popovertarget="eq-editor-{idx}" />
  </div>
{/snippet}

{#snippet stoichiometryDisplay(idx: number)}
  <div class="row">
    <Math
      tex={stoichToTex(reactions[idx].stoichiometry, texNames)}
      display={true}
      fontSize={"0.75rem"}
    />
    <TableButtonEdit popovertarget="stoich-editor-{idx}" />
  </div>
{/snippet}

{#snippet actions(idx: number, rxn: any)}
  <TableButtonClose
    onclick={() => {
      reactions = reactions.filter((i) => {
        return i.id !== rxn.id;
      });
    }}
  />
{/snippet}

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each reactions as rxn, idx}
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
          <span class="card-label">Rate law</span>
          <div class="card-value">
            {@render rateLawDisplay(idx)}
          </div>
        </div>
        <div class="card-row">
          <span class="card-label">Stoichiometry</span>
          <div class="card-value">
            {@render stoichiometryDisplay(idx)}
          </div>
        </div>
        <div class="card-row card-actions">
          {@render actions(idx, rxn)}
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
        <th>Rate law</th>
        <th>Stoichiometry</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each reactions as rxn, idx}
        <tr>
          <td>
            {@render nameInput(idx)}
          </td>
          <td>
            {@render texNameInput(idx)}
          </td>
          <td>
            {@render rateLawDisplay(idx)}
          </td>
          <td>
            {@render stoichiometryDisplay(idx)}
          </td>
          <td>
            {@render actions(idx, rxn)}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<div class="padding">
  <TableAddButton
    onclick={() => {
      reactions = [
        ...reactions,
        {
          id: `v${reactions.length}`,
          texName: `v_${reactions.length}`,
          fn: new Name("Default"),
          stoichiometry: [{ name: "Default", value: new Num(1.0) }],
        },
      ];
    }}
  />
</div>

{#each reactions as rxn, idx}
  <Popover
    size="md"
    popovertarget={`eq-editor-${idx}`}
  >
    <EqEditor
      root={rxn.fn}
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      onSave={(root) => onSaveEq(idx, root)}
      popovertarget={`eq-editor-${idx}`}
    />
  </Popover>

  <Popover
    size="md"
    popovertarget={`stoich-editor-${idx}`}
  >
    <StoichEditor
      stoichiometry={rxn.stoichiometry}
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      onSave={(stoichs) => onSaveStoichs(idx, stoichs)}
      popovertarget={`stoich-editor-${idx}`}
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

  .card-input,
  .card-value {
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
</style>
