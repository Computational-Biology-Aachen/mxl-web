<script lang="ts">
  import TableAddButton from "$lib/buttons/TableAddButton.svelte";
  import TableButtonClose from "$lib/buttons/TableButtonClose.svelte";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Num } from "$lib/mathml";
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import { defaultValue, stoichToTex } from "./modelUtils";
  import {
    idToDisplay,
    idToTex,
    type AssView,
    type ParView,
    type RxnView,
    type Stoichiometry,
    type VarView,
  } from "./modelView";

  let {
    stoichiometry = $bindable(),
    variables,
    parameters,
    assignments,
    reactions,
    onSave,
    popovertarget,
  }: {
    stoichiometry: Stoichiometry;
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    onSave: (fn: Stoichiometry) => void;
    popovertarget: string;
  } = $props();

  let argNames = $derived.by(() => {
    return variables.map((el) => [el.id, defaultValue(el.displayName, el.id)]);
  });

  let displayNames = $derived(
    idToDisplay(variables, parameters, assignments, reactions),
  );

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );
  let latex = $derived.by(() => {
    return stoichToTex(stoichiometry, texNames);
  });

  function firstVarNotInUse(): string {
    const inUse = new Set(stoichiometry.map(({ name }) => name));

    for (const [id, name] of argNames) {
      if (!inUse.has(id)) {
        return id;
      }
    }

    return "default";
  }
</script>

<RowApart>
  <h2>Stoichiometry Editor</h2>
  <PopoverSaveButton
    popovertarget={popovertarget}
    onclick={() => onSave(stoichiometry)}
  />
</RowApart>

<div class="card">
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Stoichiometry</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each stoichiometry as { name }, idx}
        <tr>
          <td>
            <select
              bind:value={
                () => {
                  return stoichiometry[idx].name;
                },
                (v: string) => {
                  stoichiometry[idx].name = v;
                  stoichiometry = stoichiometry.slice();
                }
              }
            >
              {#each argNames as [id, name]}
                <option
                  value={id}
                  selected={id === name}>{name}</option
                >
              {/each}
            </select>
          </td>
          <td>
            <input
              type="number"
              bind:value={
                () => {
                  return stoichiometry[idx].value.value;
                },
                (v: number) => {
                  stoichiometry[idx].value.value = v;
                  stoichiometry = stoichiometry.slice();
                }
              }
              step="1.0"
            />
          </td>
          <td>
            <TableButtonClose
              onclick={() => {
                stoichiometry = stoichiometry.filter((i) => {
                  return i.name !== name;
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
        stoichiometry = [
          ...stoichiometry,
          { name: firstVarNotInUse(), value: new Num(1.0) },
        ];
      }}
    />
  </div>
</div>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Preview</h3>
</div>

<div class="card padding">
  <Math
    tex={latex}
    display={true}
  />
</div>

<style>
  /* General */
  .padding {
    padding: 1rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    border-radius: var(--border-radius);
    background-color: var(--bg-l1);
  }
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
  table input,
  select {
    border: none;
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }
</style>
