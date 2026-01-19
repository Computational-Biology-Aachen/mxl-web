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
    <button class:selected={cur === tab} onclick={() => (cur = tab)}>
      {tab.name}
    </button>
  {/each}
</ul>
<svelte:component this={cur.comp} />
<br />
<button>Save</button>

<style>
  ul {
    list-style: none;
    padding: 0;
  }
  button {
    width: 8rem;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.75rem;
  }

  button.selected {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-top-width: 8px;
    border-color: #333;
  }
</style>
