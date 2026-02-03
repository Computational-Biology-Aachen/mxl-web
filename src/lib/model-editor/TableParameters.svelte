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
    {#each parameters as [], idx}
      <tr>
        <td>
          <input type="text" bind:value={parameters[idx][0]} />
        </td>
        <td>
          <input type="number" bind:value={parameters[idx][1]} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
<div class="row">
  <button>+ add new item</button>
  <button class="save">Save</button>
</div>

<style>
  table {
    font-size: 0.75rem;
  }
  table thead {
    font-size: 0.9rem;
    font-weight: 500;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
  button.save {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }
</style>
