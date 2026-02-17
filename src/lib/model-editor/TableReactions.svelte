<script lang="ts">
  import {
    idToTex,
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
  } from "./modelView";

  import { defaultValue } from "./modelUtils";

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

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Rate law</th>
      <th>Stoichiometry</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each reactions as rxn, idx}
      <tr>
        <td>
          <input
            type="text"
            bind:value={
              () => defaultValue(reactions[idx].displayName, reactions[idx].id),
              (value) => {
                reactions[idx].displayName = value;
                reactions = reactions.slice();
              }
            }
          />
        </td>
        <td>
          <div class="row">
            <Math
              tex={reactions[idx].fn.toTex(texNames)}
              display={true}
              fontSize={"0.75rem"}
            />

            <TableButtonEdit popovertarget="eq-editor-{idx}" />
          </div>
        </td>
        <td>
          <div class="row">
            <Math
              tex={stoichToTex(reactions[idx].stoichiometry, texNames)}
              display={true}
              fontSize={"0.75rem"}
            />
            <TableButtonEdit popovertarget="stoich-editor-{idx}" />
          </div>
        </td>
        <td>
          <TableButtonClose
            onclick={() => {
              reactions = reactions.filter((i) => {
                return i.id !== rxn.id;
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
      reactions = [
        ...reactions,
        {
          id: `v${reactions.length}`,
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
</style>
