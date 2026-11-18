<script lang="ts">
  import { closeContainer } from "#lib/closeContainer.js";
  import TableAssignments from "#lib/TableAssignment.svelte";
  import TableParameters from "#lib/TableParameters.svelte";
  import {
    Button,
    Icon,
    Row,
    Tabs,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
    SteadyStateModelBuilder,
  } from "@computational-biology-aachen/mxlweb-core";
  import EditorTutorial from "./EditorTutorial.svelte";
  import {
    SteadyStateModelView,
    type NNBlockView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import { buildEditorTutorial } from "./tutorial";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: SteadyStateModelBuilder;
    onSave: (fn: SteadyStateModelBuilder) => void;
    popovertarget: string;
  } = $props();

  // Steady-state models have neither state variables nor reactions, and
  // can't have NN blocks either (no dx/dt for a correction term to feed
  // into — ModelBuilderBase.wireNNBlockOutputs throws for this builder);
  // the reused tables still expect the props.
  let variables: VarView = $state([]);
  let reactions: RxnView = $state([]);
  let nnBlocks: NNBlockView = $state([]);

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

  let activeTab = $state(tabs[0].name);
  let cur = $derived(tabs.find((t) => t.name === activeTab) ?? tabs[0]);

  let tour = $state<EditorTutorial>();
  const tutorial = buildEditorTutorial({
    hasVariables: false,
    hasReactions: false,
    selectTab: (name) => {
      const tab = tabs.find((t) => t.name === name);
      if (tab) activeTab = tab.name;
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
      Review and edit the model parameters and the algebraic assignments that
      define its outputs.
    </p>
  </hgroup>

  <div class="actions">
    <Button
      variant="secondary"
      onclick={() => tour?.start()}>Tutorial</Button
    >
    <Button
      variant="secondary"
      onclick={() => closeContainer(popovertarget)}>Close</Button
    >
    <span data-tour="save">
      <Button
        onclick={() => {
          onSave(modelView.toBuilder());
          closeContainer(popovertarget);
        }}>Save</Button
      >
    </span>
  </div>
</Row>

<Tabs
  tabs={tabs.map((t) => ({ key: t.name, label: t.name, icon: t.icon }))}
  label="Model components"
  bind:activeKey={activeTab}
  data-tour="tabs"
>
  {#snippet children(_key: string)}
    <div
      class="card"
      data-tour="table"
    >
      {#if cur.name === "Parameters"}
        <TableParameters
          variables={variables}
          bind:parameters={parameters}
          assignments={assignments}
          reactions={reactions}
          nnBlocks={nnBlocks}
        />
      {:else}
        <TableAssignments
          variables={variables}
          parameters={parameters}
          bind:assignments={assignments}
          reactions={reactions}
          nnBlocks={nnBlocks}
        />
      {/if}
    </div>
  {/snippet}
</Tabs>

<div class="heading">
  <Icon>preview</Icon>
  <h3>Generated LaTeX Code</h3>
</div>

<div class="card padding">
  <!-- Focusable so keyboard users can scroll long lines. -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <pre
    tabindex="0"
    aria-label="Generated LaTeX code">{latex}</pre>
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
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
  }
  .padding {
    padding: 1rem;
  }

  pre {
    width: 100%;
    overflow-x: auto;
    font-size: 0.825rem;
  }
</style>
