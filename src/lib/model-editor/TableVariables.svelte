<script lang="ts">
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
    </tr>
  </thead>
  <tbody>
    {#each variables as [], idx}
      <tr>
        <td>
          <input type="text" bind:value={variables[idx][0]} />
        </td>
        <td>
          <input type="number" bind:value={variables[idx][1]} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button
    onclick={() => {
      variables = [...variables, [`x${variables.length}`, 1.0]];
    }}
    >+ add new item
  </button>
</div>

<style>
  table {
    font-size: 0.75rem;
    padding: 0;
    margin: 0;
  }
  table thead {
    font-size: 1rem;
    font-weight: 500;
  }
  table td {
    margin: 0;
    padding: 2px;
  }
  table input {
    font-size: 0.75rem;
    height: 1.5rem;
    padding: 0 16px;
    margin: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  button {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
</style>
