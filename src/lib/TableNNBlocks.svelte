<script lang="ts">
  import {
    Button,
    ButtonIcon as IconButton,
    Math,
    Popover,
  } from "@computational-biology-aachen/design";
  import {
    additiveMechanism,
    multiplyMechanism,
    relativeMultiplyMechanism,
    softplusActivation,
  } from "@computational-biology-aachen/mxlweb-core";
  import type { Base } from "@computational-biology-aachen/mxlweb-core/mathml";
  import { MediaQuery } from "svelte/reactivity";
  import EqEditor from "./EqEditor.svelte";
  import {
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import TableSearch from "./TableSearch.svelte";
  import { fuzzyMatch } from "./utils";

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

  const md = new MediaQuery("max-width: 768px");

  // The four other model views are received for the same uniform table API
  // every other table component gets (see ModelEditor.svelte). `variables`
  // is a block's fixed input *and* target set (it reads every state
  // variable and corrects every state variable, no per-block picker);
  // `parameters`/`assignments`/`reactions` feed the mechanism EqEditor's
  // argNames exclusion (a hand-authored mechanism can't reference an
  // NN-block-owned scale/weight, same restriction reactions already get).
  // This table only ever edits `nnBlocks` itself.
  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
    nnBlocks = $bindable(),
  }: {
    variables: VarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
  } = $props();

  // A block always reads every state variable as input and corrects every
  // state variable as output — no per-block picker (not even for the inputs/
  // targets themselves, which used to be free-text fields; those are gone
  // too, not just hidden). Letting a user hand-select a subset, or parameters
  // into the input set, produced confusing, easy-to-break configurations (a
  // block silently going stale against the model it's meant to track).
  let allVariableNames = $derived(variables.map((v) => v.id));

  function sameNames(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((name, i) => name === b[i]);
  }

  // Keeps every block's inputs/targets equal to "every state variable" even
  // when the model's variable set changes on some other tab without this
  // one being touched at all. The output layer's width must track
  // targets.length too (mxl-schemas: "the final layer's width is the
  // number of outputs, must match the length of targets") — otherwise
  // adding/removing a state variable elsewhere would silently leave a
  // block's `layers` array schema-invalid.
  $effect(() => {
    const next = nnBlocks.map((b) => {
      if (
        sameNames(b.inputs, allVariableNames) &&
        sameNames(b.targets, allVariableNames)
      ) {
        return b;
      }
      const layers = [...b.layers];
      layers[layers.length - 1] = {
        ...layers[layers.length - 1],
        width: allVariableNames.length,
      };
      return {
        ...b,
        inputs: [...allVariableNames],
        targets: [...allVariableNames],
        layers,
      };
    });
    if (next.some((b, i) => b !== nnBlocks[i])) nnBlocks = next;
  });

  let query = $state("");
  let filtered = $derived(
    nnBlocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => fuzzyMatch(block.id, query)),
  );

  let nextSeed = 0;
  function addBlock() {
    nextSeed += 1;
    nnBlocks = [
      ...nnBlocks,
      {
        id: `block${nnBlocks.length}`,
        inputs: [...allVariableNames],
        // One hidden layer of width 4, plus the implicit linear output
        // layer (setLayers below always appends one sized to targets.length)
        // — the same "depth × width" shape the UI still authors, now
        // expressed as mxl-schemas' explicit per-layer `layers` array.
        layers: [
          { type: "dense", width: 4 },
          { type: "dense", width: allVariableNames.length },
        ],
        seed: Date.now() + nextSeed,
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
        activation: softplusActivation(),
      },
    ];
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

  function onSaveMechanism(idx: number, mechanism: Base) {
    nnBlocks[idx].mechanism = mechanism;
    nnBlocks = nnBlocks.slice();
  }
</script>

{#snippet depthWidthField(idx: number)}
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
{/snippet}

{#snippet scaleField(idx: number)}
  <input
    type="number"
    step="any"
    aria-label="Output scale"
    bind:value={() => currentScale(idx), (value) => setScale(idx, value)}
  />
{/snippet}

{#snippet mechanismField(idx: number)}
  <div class="row">
    <Math
      tex={nnBlocks[idx].mechanism.toTex(mechanismTexNames)}
      display={true}
      fontSize="0.75rem"
    />
    <IconButton
      icon="edit"
      popovertarget="mechanism-editor-{idx}"
    />
  </div>
{/snippet}

{#snippet trainedField(idx: number)}
  <input
    type="checkbox"
    bind:checked={
      () => nnBlocks[idx].trained,
      (value) => {
        nnBlocks[idx].trained = value;
        nnBlocks = nnBlocks.slice();
      }
    }
  />
{/snippet}

{#snippet actions(_idx: number, id: string)}
  <IconButton
    icon="close"
    onclick={() => {
      nnBlocks = nnBlocks.filter((b) => b.id !== id);
    }}
  />
{/snippet}

<div class="padding">
  <TableSearch bind:value={query} />
</div>

{#if md.current}
  <!-- Card layout for mobile -->
  <div class="card-container">
    {#each filtered as { block, idx } (block.id)}
      <div class="card">
        <div class="card-row">
          <span class="card-label">Name</span>
          {block.id}
        </div>
        <div class="card-row">
          <span class="card-label">Architecture</span>
          <div class="card-input">{@render depthWidthField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Output scale</span>
          <div class="card-input">{@render scaleField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Mechanism</span>
          <div class="card-input">{@render mechanismField(idx)}</div>
        </div>
        <div class="card-row">
          <span class="card-label">Train when fitting</span>
          {@render trainedField(idx)}
        </div>
        <div class="card-row card-actions">
          {@render actions(idx, block.id)}
        </div>
      </div>
    {/each}
  </div>
{:else}
  <!-- Table layout for desktop -->
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Layers</th>
        <th>Output scale</th>
        <th>Mechanism</th>
        <th>Train</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as { block, idx } (block.id)}
        <tr>
          <td>{block.id}</td>
          <td>{@render depthWidthField(idx)}</td>
          <td>{@render scaleField(idx)}</td>
          <td>{@render mechanismField(idx)}</td>
          <td>{@render trainedField(idx)}</td>
          <td class="actions">{@render actions(idx, block.id)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
{#if query !== "" && filtered.length === 0}
  <p class="empty">No items match “{query}”.</p>
{/if}
<div class="padding">
  <Button onclick={addBlock}>add NN block</Button>
</div>

{#each nnBlocks as block, idx (block.id)}
  <Popover
    size="md"
    popovertarget={`mechanism-editor-${idx}`}
  >
    <EqEditor
      root={block.mechanism}
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      nnBlocks={nnBlocks}
      restrictArgNames={mechanismArgNames}
      presetTemplates={mechanismTemplates}
      onSave={(root) => onSaveMechanism(idx, root)}
      popovertarget={`mechanism-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  .padding {
    padding: 1rem;
  }
  .empty {
    padding: 0 1rem;
    color: var(--color-text-muted);
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
  }
  .pair {
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }
  .pair input {
    width: 4rem;
  }

  input {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }
  input:hover {
    border: var(--border-primary);
  }

  .card-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    box-shadow: var(--shadow);
    border: var(--border);
    border-radius: 0.5rem;
    background-color: var(--color-surface);
    padding: 1rem;
  }
  .card-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .card-label {
    color: #6b7280;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }
  .card-input {
    width: 100%;
  }
  .card-actions {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 0.5rem;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    text-align: left;
    text-indent: 0;
  }
  thead th:first-of-type {
    border-top-left-radius: 0.5rem;
  }
  thead th:last-of-type {
    border-top-right-radius: 0.5rem;
  }
  tbody tr:last-of-type td:first-of-type {
    border-bottom-left-radius: 0.5rem;
  }
  tbody tr:last-of-type td:last-of-type {
    border-bottom-right-radius: 0.5rem;
  }
  th:last-child,
  td:last-child {
    width: 3rem;
    text-align: center;
  }
  th {
    background-color: #e5e7eb;
    padding: 1rem 1.5rem;
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    line-height: 1rem;
    text-transform: uppercase;
  }
  td {
    padding: 1rem 1.5rem;
  }
  tr {
    background-color: var(--color-surface);
  }
  tr:hover {
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    background-color: lch(from var(--color-surface) calc(l - 5) c h);
  }
  td.actions {
    display: flex;
    gap: 0 10px;
    width: 7rem;
  }
</style>
