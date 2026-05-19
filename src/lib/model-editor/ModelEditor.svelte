<script lang="ts">
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import TableAssignments from "$lib/model-editor/TableAssignment.svelte";
  import TableParameters from "$lib/model-editor/TableParameters.svelte";
  import TableReactions from "$lib/model-editor/TableReactions.svelte";
  import TableVariables from "$lib/model-editor/TableVariables.svelte";
  import {
    Button,
    ButtonTab,
    Icon,
    Row,
  } from "@computational-biology-aachen/design";
  import { defaultTexName, defaultValue } from "./modelUtils";
  import { ModelView } from "./modelView";

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
  let reactions = $derived(
    parent.reactions
      .entries()
      .map(([name, rxn]) => {
        return {
          ...rxn,
          id: name,
          texName: rxn.texName || defaultTexName(rxn.displayName || name),
        };
      })
      .toArray(),
  );

  let modelView = $derived(
    new ModelView(parameters, variables, assignments, reactions),
  );
  let builder = $derived(modelView.toBuilder());
  let pycode = $derived(builder.buildPython(userParameters));
  let latex = $derived(builder.buildTex());
  let tabs = [
    {
      name: "Variables",
      comp: TableVariables,
      icon: "variable_add", //
    },
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

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <hgroup>
    <h2>Model Details</h2>
    <p>
      Review and edit model structure, biological variables, and kinetic
      parameters.
    </p>
  </hgroup>

  <Button
    onclick={() => onSave(modelView.toBuilder())}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<ul>
  {#each tabs as tab}
    <ButtonTab
      selected={cur.name === tab.name}
      onclick={() => (cur = tab)}
    >
      <Icon>{tab.icon}</Icon>
      {tab.name}
    </ButtonTab>
  {/each}
</ul>

<div class="card">
  <cur.comp
    bind:variables={variables}
    bind:parameters={parameters}
    bind:assignments={assignments}
    bind:reactions={reactions}
  />
</div>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Generated LaTeX Code</h3>
</div>

<div class="card padding">
  <pre>{latex}</pre>
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
      flex-direction: row;
      justify-content: space-between;
      padding: 0;
    }
  }
  pre {
    font-size: 0.825rem;
  }
</style>
