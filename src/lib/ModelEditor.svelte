<script lang="ts">
  import TableAssignments from "$lib/TableAssignment.svelte";
  import TableNNBlocks from "$lib/TableNNBlocks.svelte";
  import TableParameters from "$lib/TableParameters.svelte";
  import TableReactions from "$lib/TableReactions.svelte";
  import TableReadouts from "$lib/TableReadout.svelte";
  import TableVariables from "$lib/TableVariables.svelte";
  import {
    Button,
    ButtonTab,
    Div,
    Icon,
    Row,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
    KineticModelBuilder,
  } from "@computational-biology-aachen/mxlweb-core";
  import { EditorContext, provideEditorContext } from "./editorContext.svelte";
  import EditorTutorial from "./EditorTutorial.svelte";
  import { countBySeverity, type ItemKind } from "./modelDiagnostics";
  import TabBadge from "./TabBadge.svelte";
  import { ModelView } from "./modelView";
  import { buildEditorTutorial } from "./tutorial";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: KineticModelBuilder;
    onSave: (fn: KineticModelBuilder) => void;
    popovertarget: string;
  } = $props();

  // NN block weights/biases/scale live in the same `parent.parameters` map
  // as ordinary entries (no other marker distinguishes them) — but this
  // array feeds `ModelView.toBuilder()` on Save, which must round-trip
  // every entry's *current* value (including a fitted weight) untouched.
  // Excluding block-owned entries here would silently drop those values
  // from the rebuilt model instead of just hiding their rows, so the
  // exclusion happens downstream, inside TableParameters itself (ADR 0005
  // §2.1.3 is a display/editability rule, not a data-flow one). Reactions
  // are unaffected by this — an NN block no longer generates one at all,
  // for any mechanism (NNBlockConfig.mechanism's doc comment), so
  // `parent.reactions` is always purely hand-authored.
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
  let nnBlocks = $derived(
    parent.nnBlocks
      .entries()
      .map(([name, block]) => {
        return { ...block, id: name };
      })
      .toArray(),
  );
  // Weights/biases live in `parent.nnWeights`, structurally separate from
  // `parent.parameters` (mxl-schemas nn_blocks v2) — carried through
  // unchanged so every reactive rebuild (`modelView.toBuilder()`, not just
  // explicit Save) preserves a block's actual, possibly fitted, values
  // instead of silently Glorot-reinitializing them on every render.
  let nnWeights = $derived(new Map(parent.nnWeights.entries()));
  let readouts = $derived(
    parent.readouts
      .entries()
      .map(([name, ro]) => {
        return {
          ...ro,
          id: name,
          texName: ro.texName || defaultTexName(ro.displayName || name),
        };
      })
      .toArray(),
  );

  let modelView = $derived(
    new ModelView(
      parameters,
      variables,
      assignments,
      reactions,
      nnBlocks,
      nnWeights,
      readouts,
    ),
  );
  let builder = $derived(modelView.toBuilder());
  let latex = $derived(builder.buildTex());
  let tabs = [
    {
      name: "Variables",
      kinds: ["variable"] as ItemKind[],
      comp: TableVariables,
      icon: "variable_add", //
    },
    {
      name: "Parameters",
      kinds: ["parameter"] as ItemKind[],
      comp: TableParameters,
      icon: "tune",
    },
    {
      name: "Assignments",
      kinds: ["assignment"] as ItemKind[],
      comp: TableAssignments,
      icon: "expand",
    },
    {
      name: "Reactions",
      kinds: ["reaction"] as ItemKind[],
      comp: TableReactions,
      icon: "rebase_edit",
    },
    {
      name: "NN Blocks",
      kinds: ["nnBlock"] as ItemKind[],
      comp: TableNNBlocks,
      icon: "model_training",
    },
    {
      name: "Readouts",
      kinds: ["readout"] as ItemKind[],
      comp: TableReadouts,
      icon: "visibility",
    },
  ];

  let cur = $state(tabs[0]);

  const ctx = provideEditorContext(
    new EditorContext(
      () => ({
        variables,
        parameters,
        assignments,
        reactions,
        readouts,
        nnBlocks,
        nnWeights,
      }),
      (ref) => {
        const tab = tabs.find((t) => t.kinds.includes(ref.kind));
        if (tab) cur = tab;
      },
    ),
  );

  let tour = $state<EditorTutorial>();
  const tutorial = buildEditorTutorial({
    hasVariables: true,
    hasReactions: true,
    selectTab: (name) => {
      const tab = tabs.find((t) => t.name === name);
      if (tab) cur = tab;
    },
    getAssignments: () => assignments,
    setAssignments: (next) => (assignments = next as typeof assignments),
  });
</script>

<Div>
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

    <div class="actions">
      <Button
        variant="secondary"
        onclick={() => tour?.start()}>Tutorial</Button
      >
      <span
        data-tour="save"
        title={ctx.hasErrors
          ? `${ctx.errorCount} errors: fix before saving`
          : undefined}
      >
        <Button
          disabled={ctx.hasErrors}
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
        <TabBadge
          counts={countBySeverity(ctx.diagnostics.findings, tab.kinds)}
        />
      </ButtonTab>
    {/each}
  </ul>

  <div
    class="card"
    data-tour="table"
  >
    <cur.comp
      bind:variables={variables}
      bind:parameters={parameters}
      bind:assignments={assignments}
      bind:reactions={reactions}
      bind:nnBlocks={nnBlocks}
      bind:readouts={readouts}
    />
  </div>

  <div class="heading">
    <Icon>preview</Icon>
    <h3>Generated LaTeX Code</h3>
  </div>

  <div class="card padding">
    <pre>{latex}</pre>
  </div>
</Div>

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

  /* Tabs */
  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    width: 100%;
    list-style: none;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      padding: 0;
    }
  }
  pre {
    width: 100%;
    overflow-x: scroll;
    font-size: 0.825rem;
  }
</style>
