<script lang="ts">
  import {
    additiveMechanism,
    multiplyMechanism,
    relativeMultiplyMechanism,
    softplusActivation,
  } from "@computational-biology-aachen/mxlweb-core";
  import DataTable from "./DataTable.svelte";
  import EqEditor from "./EqEditor.svelte";
  import ExprCell from "./ExprCell.svelte";
  import { nextFreeId } from "./modelDiagnostics";
  import {
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import NumberCell from "./NumberCell.svelte";

  // The mechanism EqEditor is scoped to exactly the two placeholders
  // mxl-schemas' `mechanismNode` restricts a `mechanism` expression's `Name`
  // leaves to — every other symbol (model variables/parameters/the block's
  // own scale) is deliberately unreachable there, the same way a reaction's
  // rate law is restricted to real model symbols (EqEditor.svelte's
  // `restrictArgNames`/`argNames`).
  const mechanismArgNames: string[][] = [
    ["ode", "ode"],
    ["nde", "nde"],
  ];
  // "f"/"NN" — short, literature-style labels (Rackauckas et al.:
  // f(x,p,t) + NN(x,θ)) purely for the live preview's rendered LaTeX; the
  // editor itself always works with the real "ode"/"nde" placeholder names.
  const mechanismTexNames = new Map([
    ["ode", "f"],
    ["nde", "NN"],
  ]);
  const mechanismTemplates = [
    { name: "Additive: f + NN(x)", code: additiveMechanism },
    {
      name: "Relative multiply: f · (1 + NN(x))",
      code: relativeMultiplyMechanism,
    },
    { name: "Multiply: f · NN(x)", code: multiplyMechanism },
  ];

  // The five other model views are received for the same uniform table API
  // every other table component gets (see ModelEditor.svelte). `variables`
  // is always a block's fixed input set (it reads every state variable, no
  // per-block picker); it's also the fixed target set for a
  // targetKind: "variable" block (the default), while `reactions` is the
  // fixed target set for a targetKind: "reaction" block instead — either
  // way, no per-block picker on which subset. `parameters`/`assignments`/
  // `reactions` also feed the mechanism EqEditor's argNames exclusion (a
  // hand-authored mechanism can't reference an NN-block-owned scale/weight,
  // same restriction reactions already get). This table only ever edits
  // `nnBlocks` itself.
  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
    nnBlocks = $bindable(),
    readouts = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
    readouts?: AssView;
  } = $props();

  // A block always reads every state variable as input — no per-block
  // picker (not even for the inputs themselves, which used to be a
  // free-text field; that's gone too, not just hidden). Letting a user
  // hand-select a subset, or parameters into the input set, produced
  // confusing, easy-to-break configurations (a block silently going stale
  // against the model it's meant to track).
  let allVariableNames = $derived(variables.map((v) => v.id));
  // A reaction-mode block corrects every reaction the same way — same "no
  // picker" rationale as inputs/variable-mode targets above, applied to
  // NNBlockConfig.targetKind === "reaction" instead.
  let allReactionNames = $derived(reactions.map((r) => r.id));
  // The "Reactions" target-kind option only makes sense once the model has
  // reactions to target at all (OdeModelEditor always passes an empty
  // `reactions` array — see its own comment — so this naturally never shows
  // there). Kept visible for a block already in reaction mode even if every
  // reaction was since deleted, so its selector remains reachable to switch
  // back rather than stranding the block.
  let showTargetKind = $derived(
    allReactionNames.length > 0 ||
      nnBlocks.some((b) => b.targetKind === "reaction"),
  );

  function sameNames(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((name, i) => name === b[i]);
  }

  function targetNamesFor(block: NNBlockView[number]): string[] {
    return block.targetKind === "reaction"
      ? allReactionNames
      : allVariableNames;
  }

  // Keeps every block's inputs equal to "every state variable" and its
  // targets equal to "every state variable" (targetKind "variable") or
  // "every reaction" (targetKind "reaction") even when the model's
  // variable/reaction set changes on some other tab without this one being
  // touched at all. The output layer's width must track targets.length too
  // (mxl-schemas: "the final layer's width is the number of outputs, must
  // match the length of targets") — otherwise adding/removing a variable or
  // reaction elsewhere would silently leave a block's `layers` array
  // schema-invalid.
  $effect(() => {
    const next = nnBlocks.map((b) => {
      const targetNames = targetNamesFor(b);
      if (
        sameNames(b.inputs, allVariableNames) &&
        sameNames(b.targets, targetNames)
      ) {
        return b;
      }
      const layers = [...b.layers];
      layers[layers.length - 1] = {
        ...layers[layers.length - 1],
        width: targetNames.length,
      };
      return {
        ...b,
        inputs: [...allVariableNames],
        targets: [...targetNames],
        layers,
      };
    });
    if (next.some((b, i) => b !== nnBlocks[i])) nnBlocks = next;
  });

  let nextSeed = 0;
  function addBlock(): string {
    nextSeed += 1;
    const id = nextFreeId("block", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    nnBlocks = [
      ...nnBlocks,
      {
        id,
        inputs: [...allVariableNames],
        // One hidden layer of width 4 (softplus-activated), plus the
        // implicit linear (no activation) output layer (setLayers below
        // always appends one sized to targets.length) — the same "depth ×
        // width" shape the UI still authors, now expressed as mxl-schemas'
        // explicit per-layer `layers` array (activation moved from a single
        // block-level field to each layer's own optional `activation`).
        layers: [
          { type: "dense", width: 4, activation: softplusActivation() },
          { type: "dense", width: allVariableNames.length },
        ],
        seed: Date.now() + nextSeed,
        targetKind: "variable",
        targets: [...allVariableNames],
        trained: true,
        // dx/dt = f(x,p,t) * (1 + scale * NN(x,θ)) — starts small so a
        // bigger freshly-initialized network doesn't blow up the first fit
        // iteration; the scale itself is trainable too, same as any weight.
        scale: 0.01,
        // relative_multiply: dx/dt = f*(1 + scale*NN) — default, since an
        // untrained network then leaves f unchanged regardless of scale.
        // Only a starting point, freely re-editable via the mechanism
        // EqEditor (mechanismTemplates above) like any other expression.
        mechanism: relativeMultiplyMechanism(),
      },
    ];
    return id;
  }

  // Depth/width is still the only architecture the UI authors (a full
  // per-layer editor is future scope the schema's `layers` array makes
  // possible, not something this pass builds) — derived from/written back
  // into the block's real `layers` array, whose last entry is always the
  // implicit linear output layer sized to the block's own target count.
  function currentDepth(idx: number): number {
    return globalThis.Math.max(1, nnBlocks[idx].layers.length - 1);
  }
  function currentWidth(idx: number): number {
    const layers = nnBlocks[idx].layers;
    return layers.length > 1 ? layers[0].width : 1;
  }
  function setDepthWidth(idx: number, depth: number, width: number) {
    const outputWidth = nnBlocks[idx].targets.length;
    nnBlocks[idx].layers = [
      ...Array.from({ length: depth }, () => ({
        type: "dense" as const,
        width,
        activation: softplusActivation(),
      })),
      { type: "dense" as const, width: outputWidth },
    ];
    nnBlocks = nnBlocks.slice();
  }

  // The block's scale is `${blockId}_scale` in `this.parameters` — an
  // ordinary, trainable Parameter, per nnBlock.ts — but only once the block
  // has actually been through a Save (`ModelView.toBuilder()` is what first
  // calls `addNNBlock`, materializing it there). Before that first Save,
  // `parameters` (unfiltered but sourced from `parent.parameters`, per
  // ModelEditor.svelte's comment on why it stays that way) doesn't have an
  // entry for a block added in *this* session yet, so editing falls back to
  // `nnBlocks[idx].scale` — exactly the value that first Save will use to
  // seed the real parameter.
  function scaleParamName(blockId: string): string {
    return `${blockId}_scale`;
  }
  function currentScale(idx: number): number {
    const existing = parameters.find(
      (p) => p.id === scaleParamName(nnBlocks[idx].id),
    );
    return existing?.value ?? nnBlocks[idx].scale;
  }
  function setScale(idx: number, value: number) {
    const paramIdx = parameters.findIndex(
      (p) => p.id === scaleParamName(nnBlocks[idx].id),
    );
    if (paramIdx >= 0) {
      parameters[paramIdx] = { ...parameters[paramIdx], value };
      parameters = parameters.slice();
    } else {
      nnBlocks[idx].scale = value;
      nnBlocks = nnBlocks.slice();
    }
  }

  // Switching kind just flips the tag; the $effect above resyncs
  // inputs/targets/layer-width to match on the very next run (allVariableNames
  // for "variable", allReactionNames for "reaction") rather than duplicating
  // that logic here.
  function setTargetKind(idx: number, kind: "variable" | "reaction") {
    nnBlocks[idx].targetKind = kind;
    nnBlocks = nnBlocks.slice();
  }

  let columns = $derived([
    { key: "name", label: "Name", width: "18%" },
    ...(showTargetKind
      ? [{ key: "kind", label: "Corrects", width: "12rem" }]
      : []),
    { key: "layers", label: "Layers", width: "9rem" },
    {
      key: "scale",
      label: "Output scale",
      align: "right" as const,
      width: "9rem",
    },
    { key: "trained", label: "Train", width: "5rem" },
    { key: "mechanism", label: "Mechanism" },
  ]);
</script>

<DataTable
  kind="nnBlock"
  rows={nnBlocks}
  idOf={(b) => b.id}
  labelOf={(b) => b.id}
  columns={columns}
  onAdd={addBlock}
  onRemove={(b) => (nnBlocks = nnBlocks.filter((i) => i.id !== b.id))}
>
  {#snippet cell(key: string, block: NNBlockView[number], idx: number)}
    {#if key === "name"}
      <span class="id">{block.id}</span>
    {:else if key === "kind"}
      <select
        aria-label="Corrects"
        bind:value={
          () => nnBlocks[idx].targetKind,
          (value) => setTargetKind(idx, value as "variable" | "reaction")
        }
      >
        <option value="variable">Equations</option>
        <option
          value="reaction"
          disabled={allReactionNames.length === 0}
        >
          Reactions
        </option>
      </select>
    {:else if key === "layers"}
      <div class="pair">
        <input
          type="number"
          min="1"
          step="1"
          aria-label="Hidden layers"
          bind:value={
            () => currentDepth(idx),
            (value) =>
              setDepthWidth(
                idx,
                globalThis.Math.max(1, globalThis.Math.round(value)),
                currentWidth(idx),
              )
          }
        />
        <span>×</span>
        <input
          type="number"
          min="1"
          step="1"
          aria-label="Layer width"
          bind:value={
            () => currentWidth(idx),
            (value) =>
              setDepthWidth(
                idx,
                currentDepth(idx),
                globalThis.Math.max(1, globalThis.Math.round(value)),
              )
          }
        />
      </div>
    {:else if key === "scale"}
      <NumberCell
        id="nn-scale-{idx}"
        label="Output scale"
        bind:value={() => currentScale(idx), (value) => setScale(idx, value)}
      />
    {:else if key === "trained"}
      <input
        type="checkbox"
        aria-label="Train when fitting"
        bind:checked={
          () => nnBlocks[idx].trained,
          (value) => {
            nnBlocks[idx].trained = value;
            nnBlocks = nnBlocks.slice();
          }
        }
      />
    {:else}
      <ExprCell tex={block.mechanism.toTex(mechanismTexNames)} />
    {/if}
  {/snippet}

  {#snippet expansion(_block: NNBlockView[number], idx: number)}
    <h4>Mechanism</h4>
    <EqEditor
      bind:root={
        () => nnBlocks[idx].mechanism,
        (mechanism) => {
          nnBlocks[idx].mechanism = mechanism;
          nnBlocks = nnBlocks.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      nnBlocks={nnBlocks}
      restrictArgNames={mechanismArgNames}
      presetTemplates={mechanismTemplates}
    />
  {/snippet}
</DataTable>

<style>
  h4 {
    margin: 0;
  }
  .id {
    padding: 0.35rem 0.5rem;
    font-size: 0.875rem;
  }
  .pair {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .pair input {
    width: 3.5rem;
  }
  input[type="number"],
  select {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    font-size: 0.875rem;
  }
  input[type="number"]:hover,
  select:hover {
    border: var(--border-primary);
  }
</style>
