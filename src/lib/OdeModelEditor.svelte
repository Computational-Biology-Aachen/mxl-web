<script lang="ts">
  import TableAssignments from "$lib/TableAssignment.svelte";
  import TableDifferentials from "$lib/TableDifferentials.svelte";
  import TableParameters from "$lib/TableParameters.svelte";
  import {
    Button,
    ButtonTab,
    Icon,
    Row,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
    OdeModelBuilder,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Num } from "@computational-biology-aachen/mxlweb-core/mathml";
  import EditorTutorial from "./EditorTutorial.svelte";
  import { OdeModelView, type RxnView } from "./modelView";
  import { buildEditorTutorial } from "./tutorial";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: OdeModelBuilder;
    onSave: (fn: OdeModelBuilder) => void;
    popovertarget: string;
  } = $props();

  // ODE models have no reactions; the reused tables still expect the prop.
  let reactions: RxnView = $state([]);

  let parameters = $derived(
    parent.parameters
      .entries()
      .map(([name, par]) => {
        return {
          ...par,
          id: name,
          texName: defaultValue(
            par.texName,
            defaultTexName(par.displayName || name),
          ),
        };
      })
      .toArray(),
  );
  let variables = $derived(
    parent.variables
      .entries()
      .map(([name, vari]) => {
        return {
          ...vari,
          id: name,
          texName: vari.texName || defaultTexName(vari.displayName || name),
          differential: parent.differentials.get(name) ?? new Num(0),
        };
      })
      .toArray(),
  );
  let assignments = $derived(
    parent.assignments
      .entries()
      .map(([name, assign]) => {
        return {
          ...assign,
          id: name,
          texName: assign.texName || defaultTexName(assign.displayName || name),
        };
      })
      .toArray(),
  );

  let modelView = $derived(
    new OdeModelView(parameters, variables, assignments),
  );
  let latex = $derived(modelView.toBuilder().buildTex());

  let tabs = [
    {
      name: "Variables",
      icon: "variable_add",
    },
    {
      name: "Parameters",
      icon: "tune",
    },
    {
      name: "Assignments",
      icon: "expand",
    },
  ];

  let cur = $state(tabs[0]);

  let tour = $state<EditorTutorial>();
  const tutorial = buildEditorTutorial({
    hasVariables: true,
    hasReactions: false,
    selectTab: (name) => {
      const tab = tabs.find((t) => t.name === name);
      if (tab) cur = tab;
    },
    getAssignments: () => assignments,
    setAssignments: (next) => (assignments = next as typeof assignments),
  });
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <hgroup>
    <h2>Model Details</h2>
    <p>
      Review and edit the model structure, variables and their differential
      equations, parameters, and assignments.
    </p>
  </hgroup>

  <div class="actions">
    <Button
      variant="secondary"
      onclick={() => tour?.start()}>Tutorial</Button
    >
    <span data-tour="save">
      <Button
        onclick={() => onSave(modelView.toBuilder())}
        popovertarget={popovertarget}
        popovertargetaction="hide">Save</Button
      >
    </span>
  </div>
</Row>

<ul data-tour="tabs">
  {#each tabs as tab (tab.name)}
    <ButtonTab
      selected={cur.name === tab.name}
      onclick={() => (cur = tab)}
    >
      <Icon>{tab.icon}</Icon>
      {tab.name}
    </ButtonTab>
  {/each}
</ul>

<div
  class="card"
  data-tour="table"
>
  {#if cur.name === "Variables"}
    <TableDifferentials
      bind:variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
    />
  {:else if cur.name === "Parameters"}
    <TableParameters
      variables={variables}
      bind:parameters={parameters}
      assignments={assignments}
      reactions={reactions}
    />
  {:else}
    <TableAssignments
      variables={variables}
      parameters={parameters}
      bind:assignments={assignments}
      reactions={reactions}
    />
  {/if}
</div>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Generated LaTeX Code</h3>
</div>

<div class="card padding">
  <pre>{latex}</pre>
</div>

<EditorTutorial
  bind:this={tour}
  steps={tutorial.steps}
  openEqEditor={tutorial.openEqEditor}
  closeEqEditor={tutorial.closeEqEditor}
/>

<style>
  .actions {
    display: flex;
    gap: 0.5rem;
  }
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
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
  }
  .padding {
    padding: 1rem;
  }

  /* Tabs */
  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    list-style: none;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 0;
    }
  }
  pre {
    width: 100%;
    overflow-x: scroll;
    font-size: 0.825rem;
  }
</style>
