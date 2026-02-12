<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Num } from "$lib/mathml";
  import {
    getTexNames,
    stoichToTex,
    type AssView,
    type ParView,
    type Stoichiometry,
    type VarView,
  } from "./model";

  let {
    stoichiometry = $bindable(),
    variables,
    parameters,
    assignments,
  }: {
    stoichiometry: Stoichiometry;
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
  } = $props();

  // We don't want these to react
  // svelte-ignore state_referenced_locally
  let texNames = getTexNames(variables, parameters);

  let variableNames = $derived.by(() => {
    return [...variables.map((el) => el[0])];
  });

  let latex = $derived.by(() => {
    return stoichToTex(stoichiometry, texNames);
  });

  function firstVarNotInUse(): string {
    const inUse = new Set(stoichiometry.map(({ name }) => name));

    for (const val of variableNames) {
      if (!inUse.has(val)) {
        return val;
      }
    }

    return "default";
  }
</script>

<hgroup class="header">
  <h1>Stoich Editor</h1>
  <p>
    Build an expression by selecting a node and replacing it with a MathML
    element, then adjust symbols to the allowed variable names.
  </p>
</hgroup>

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
              {#each variableNames as variable}
                <option selected={variable === name}>{variable}</option>
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
            <button
              class="close"
              onclick={() => {
                stoichiometry = stoichiometry.filter((i) => {
                  return i.name !== name;
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
        stoichiometry = [
          ...stoichiometry,
          { name: firstVarNotInUse(), value: new Num(1.0) },
        ];
      }}>+ add new item</button
    >
  </div>
</div>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Preview</h3>
</div>

<div class="card padding">
  <Math tex={latex} display={true} />
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
    border-radius: 0.5rem;
    background-color: var(--bg-l1);
  }
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  hgroup p {
    margin: 0;
    color: #4b5563;
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
    border-radius: 0.5rem;
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
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
    margin: 0rem;
    padding: 0.3rem;
    width: 8rem;
    font-size: 0.75rem;
  }
  button.add {
    cursor: pointer;
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
</style>
