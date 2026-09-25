<script lang="ts">
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import DataTable from "./DataTable.svelte";
  import { nextFreeId } from "./modelDiagnostics";
  import {
    type AssView,
    type NNBlockView,
    type Parameter,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import NameCell from "./NameCell.svelte";
  import NumberCell from "./NumberCell.svelte";
  import SliderFields from "./SliderFields.svelte";

  // All six model views are received for a uniform table API (see
  // OdeModelEditor), but this table only reads/edits `parameters`.
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

  const columns = [
    { key: "name", label: "Name", width: "50%" },
    { key: "value", label: "Value", align: "right" as const, width: "12rem" },
  ];

  // An NN block's own `scale` must never surface as an individual row here
  // (ADR 0005 §2.1.3) — weights/biases don't need this exclusion at all
  // any more, since they live in `nnWeights`, structurally separate from
  // `parameters`, not here to begin with (mxl-schemas nn_blocks v2).
  // `parameters` itself stays the full, unfiltered array (ModelEditor.svelte
  // round-trips it through toBuilder() on Save, which needs every entry's
  // live value, fitted or not), so the exclusion happens only in what this
  // table renders/edits.
  let ownedIds = $derived(new Set(nnBlocks.map((b) => `${b.id}_scale`)));

  function add(): string {
    const id = nextFreeId("p", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    parameters = [...parameters, { id, value: 1.0, texName: id }];
    return id;
  }
</script>

<DataTable
  kind="parameter"
  rows={parameters}
  idOf={(p) => p.id}
  labelOf={(p) => defaultValue(p.displayName, p.id)}
  hidden={(p) => ownedIds.has(p.id)}
  columns={columns}
  onAdd={add}
  onRemove={(p) => (parameters = parameters.filter((i) => i.id !== p.id))}
>
  {#snippet cell(key: string, par: Parameter, idx: number)}
    {#if key === "name"}
      <NameCell
        name={defaultValue(par.displayName, par.id)}
        texName={par.texName}
        onName={(value) => {
          parameters[idx].displayName = value;
          parameters[idx].texName = defaultTexName(value);
          parameters = parameters.slice();
        }}
        onTex={(value) => {
          parameters[idx].texName = value;
          parameters = parameters.slice();
        }}
      />
    {:else}
      <NumberCell
        id="par-{idx}"
        label="Value"
        bind:value={
          () => parameters[idx].value,
          (value) => {
            parameters[idx].value = value;
            parameters = parameters.slice();
          }
        }
      />
    {/if}
  {/snippet}

  {#snippet expansion(par: Parameter, idx: number)}
    <SliderFields
      slider={par.slider}
      onChange={(slider) => {
        parameters[idx].slider = slider;
        parameters = parameters.slice();
      }}
    />
  {/snippet}
</DataTable>
