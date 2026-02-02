<script lang="ts">
  import TableDerived from "$lib/model-editor/TableDerived.svelte";
  import TableParameters from "$lib/model-editor/TableParameters.svelte";
  import TableReactions from "$lib/model-editor/TableReactions.svelte";
  import TableVariables from "$lib/model-editor/TableVariables.svelte";

  let tabs = [
    { name: "Variables", comp: TableVariables },
    {
      name: "Parameters",
      comp: TableParameters,
    },
    {
      name: "Derived",
      comp: TableDerived,
    },
    {
      name: "Reactions",
      comp: TableReactions,
    },
  ];

  let cur = tabs[0];
</script>

<ul>
  {#each tabs as tab}
    <button
      class:selected={cur === tab}
      class="tab"
      onclick={() => (cur = tab)}
    >
      {tab.name}
    </button>
  {/each}
</ul>
<svelte:component this={cur.comp} />
<br />

<style>
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button.tab {
    width: 100%;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.95rem;
    font-weight: 700;
  }
  button.selected {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-top-width: 8px;
    border-color: #333;
  }
</style>
