<script lang="ts">
  import TableAssignments from "$lib/TableAssignment.svelte";
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
    SteadyStateModelBuilder,
  } from "@computational-biology-aachen/mxlweb-core";
  import {
    SteadyStateModelView,
    type RxnView,
    type VarView,
  } from "./modelView";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: SteadyStateModelBuilder;
    onSave: (fn: SteadyStateModelBuilder) => void;
    popovertarget: string;
  } = $props();

  // Steady-state models have neither state variables nor reactions; the reused
  // tables still expect the props.
  let variables: VarView = $state([]);
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

  let modelView = $derived(new SteadyStateModelView(parameters, assignments));
  let latex = $derived(modelView.toBuilder().buildTex());

  let tabs = [
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
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <hgroup>
    <h2>Model Details</h2>
    <p>
      Review and edit the model parameters and the algebraic assignments that
      define its outputs.
    </p>
  </hgroup>

  <Button
    onclick={() => onSave(modelView.toBuilder())}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<ul>
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

<div class="card">
  {#if cur.name === "Parameters"}
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 0;
    }
  }
  pre {
    width: 100%;
    overflow-x: scroll;
    font-size: 0.825rem;
  }
</style>
