<script lang="ts">
  import Icon from "$lib/Icon.svelte";
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
          <input type="text" bind:value={variables[idx][0]} />
        </td>
        <td>
          <input type="number" bind:value={variables[idx][1]} />
        </td>
        <td>
          <button
            class="close"
            onclick={() => {
              variables = variables.filter((i) => {
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
      variables = [...variables, [`x${variables.length}`, 1.0]];
    }}
    >+ add new item
  </button>
</div>

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
