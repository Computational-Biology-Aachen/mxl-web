<script lang="ts">
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

  // @ts-ignore
  let variables: VarView = $state(
    parent.variables
      .entries()
      .map(([name, value]) => [name, value])
      .toArray(),
  );
  // @ts-ignore
  let parameters: ParView = $state(
    parent.parameters
      .entries()
      .map(([name, value]) => [name, value])
      .toArray(),
  );
  // @ts-ignore
  let assignments: AssView = $state(
    parent.assignments
      .entries()
      .map(([name, assign]) => [name, assign])
      .toArray(),
  );
  // @ts-ignore
  let reactions: RxnView = $state(
    parent.reactions
      .entries()
      .map(([name, assign]) => [name, assign])
      .toArray(),
  );

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
    { name: "Variables", comp: TableVariables },
    {
      name: "Parameters",
      comp: TableParameters,
    },
    {
      name: "Assignments",
      comp: TableAssignments,
    },
    {
      name: "Reactions",
      comp: TableReactions,
    },
  ];

  let cur = $state(tabs[0]);
</script>

<section class="page">
  <ul>
    {#each tabs as tab}
      <button
        class:selected={cur.name === tab.name}
        class="tab"
        onclick={() => (cur = tab)}
      >
        {tab.name}
      </button>
    {/each}
  </ul>

  <cur.comp bind:variables bind:parameters bind:assignments bind:reactions />

  <div class="section">
    <h2>Generated Python Code</h2>
    <pre>{pycode}</pre>
  </div>

  <button
    onclick={() => onSave(modelView.toBuilder())}
    popovertargetaction="hide"
    {popovertarget}>Save</button
  >
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
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
  pre {
    padding: var(--pico-spacing);
  }
</style>
