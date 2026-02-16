<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import {
    ModelBuilder,
    ModelView,
    type AssView,
    type ParView,
    type RxnView,
    type VarView,
  } from "$lib/model-editor/model";
  import TableAssignments from "$lib/model-editor/TableAssignment.svelte";
  import TableParameters from "$lib/model-editor/TableParameters.svelte";
  import TableReactions from "$lib/model-editor/TableReactions.svelte";
  import TableVariables from "$lib/model-editor/TableVariables.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../PopoverSaveButton.svelte";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: ModelBuilder;
    onSave: (fn: ModelBuilder) => void;
    popovertarget: string;
  } = $props();

  let userParameters: string[] = [];

  let variables = $derived(
    parent.variables
      .entries()
      .map(([name, value]) => [name, value])
      .toArray(),
  ) as VarView;
  let parameters = $derived(
    parent.parameters
      .entries()
      .map(([name, value]) => [name, value])
      .toArray(),
  ) as ParView;
  let assignments = $derived(
    parent.assignments
      .entries()
      .map(([name, assign]) => [name, assign])
      .toArray(),
  ) as AssView;
  let reactions = $derived(
    parent.reactions
      .entries()
      .map(([name, assign]) => [name, assign])
      .toArray(),
  ) as RxnView;

  let modelView = $derived.by(() => {
    let lcl = new ModelView();
    lcl.variables = variables;
    lcl.parameters = parameters;
    lcl.assignments = assignments;
    lcl.reactions = reactions;
    return lcl;
  });
  let builder = $derived(modelView.toBuilder());
  let pycode = $derived.by(() => builder.buildPython(userParameters));

  let tabs = [
    { name: "Variables", comp: TableVariables, icon: "variable_add" },
    {
      name: "Parameters",
      comp: TableParameters,
      icon: "tune",
    },
    {
      name: "Assignments",
      comp: TableAssignments,
      icon: "expand",
    },
    {
      name: "Reactions",
      comp: TableReactions,
      icon: "rebase_edit",
    },
  ];

  let cur = $state(tabs[0]);
</script>

<RowApart>
  <hgroup>
    <h2>Model Details</h2>
    <p>
      Review and edit model structure, biological variables, and kinetic
      parameters.
    </p>
  </hgroup>

  <PopoverSaveButton
    onclick={() => onSave(modelView.toBuilder())}
    {popovertarget}
  />
</RowApart>

<ul>
  {#each tabs as tab}
    <button
      class:selected={cur.name === tab.name}
      class="tab"
      onclick={() => (cur = tab)}
    >
      <Icon>{tab.icon}</Icon>
      {tab.name}
    </button>
  {/each}
</ul>

<div class="card">
  <cur.comp bind:variables bind:parameters bind:assignments bind:reactions />
</div>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Generated Python Code</h3>
</div>

<div class="card padding">
  <pre>{pycode}</pre>
</div>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    border-radius: 0.5rem;
    background-color: var(--bg-l1);
  }
  .padding {
    padding: 1rem;
  }

  /* Tabs */
  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
    list-style: none;
  }
  button.tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    margin: 0 1rem;
    border: none;
    background-color: transparent;
    padding: 0.3rem 0.2rem;
    color: var(--slate-500);
    font-weight: 700;
    font-size: 0.84rem;
  }
  button.tab:hover {
    color: var(--slate);
  }
  button.selected {
    border-bottom: 2px solid var(--primary);
    color: var(--primary);
  }
  pre {
    font-size: 0.825rem;
  }
</style>
