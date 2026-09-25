<script lang="ts">
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Base } from "@computational-biology-aachen/mxlweb-core/mathml";
  import DataTable from "./DataTable.svelte";
  import EqEditor from "./EqEditor.svelte";
  import ExprCell from "./ExprCell.svelte";
  import { nextFreeId } from "./modelDiagnostics";
  import {
    idToTex,
    type AssView,
    type NNBlockView,
    type OdeVariable,
    type OdeVarView,
    type ParView,
    type RxnView,
  } from "./modelView";
  import NameCell from "./NameCell.svelte";
  import NumberCell from "./NumberCell.svelte";
  import SliderFields from "./SliderFields.svelte";
  import { Num } from "@computational-biology-aachen/mxlweb-core/mathml";

  let {
    variables = $bindable(),
    parameters = $bindable(),
    assignments = $bindable(),
    reactions = $bindable(),
    nnBlocks = $bindable(),
    readouts = $bindable(),
  }: {
    variables: OdeVarView;
    parameters: ParView;
    assignments: AssView;
    reactions: RxnView;
    nnBlocks: NNBlockView;
    readouts?: AssView;
  } = $props();

  const columns = [
    { key: "name", label: "Name", width: "30%" },
    {
      key: "value",
      label: "Initial value",
      align: "right" as const,
      width: "12rem",
    },
    { key: "diff", label: "dx/dt" },
  ];

  let texNames = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  function add(): string {
    const id = nextFreeId("x", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    variables = [
      ...variables,
      { id, value: 1.0, texName: id, differential: new Num(0) },
    ];
    return id;
  }
</script>

<DataTable
  kind="variable"
  rows={variables}
  idOf={(v) => v.id}
  labelOf={(v) => defaultValue(v.displayName, v.id)}
  columns={columns}
  onAdd={add}
  onRemove={(v) => (variables = variables.filter((i) => i.id !== v.id))}
>
  {#snippet cell(key: string, vari: OdeVariable, idx: number)}
    {#if key === "name"}
      <NameCell
        name={defaultValue(vari.displayName, vari.id)}
        texName={vari.texName}
        onName={(value) => {
          variables[idx].displayName = value;
          variables[idx].texName = defaultTexName(value);
          variables = variables.slice();
        }}
        onTex={(value) => {
          variables[idx].texName = value;
          variables = variables.slice();
        }}
      />
    {:else if key === "value"}
      {#if vari.value instanceof Base}
        <ExprCell tex={vari.value.toTex(texNames)} />
      {:else}
        <NumberCell
          id="diff-{idx}"
          label="Initial value"
          bind:value={
            () => variables[idx].value as number,
            (value) => {
              variables[idx].value = value;
              variables = variables.slice();
            }
          }
        />
      {/if}
    {:else}
      <ExprCell tex={vari.differential.toTex(texNames)} />
    {/if}
  {/snippet}

  {#snippet expansion(vari: OdeVariable, idx: number)}
    <h4>dx/dt</h4>
    <EqEditor
      bind:root={
        () => variables[idx].differential,
        (fn) => {
          variables[idx].differential = fn;
          variables = variables.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      nnBlocks={nnBlocks}
    />
    {#if vari.value instanceof Base}
      <h4>Initial value</h4>
      <EqEditor
        bind:root={
          () => variables[idx].value as Base,
          (fn) => {
            variables[idx].value = fn;
            variables = variables.slice();
          }
        }
        variables={variables}
        parameters={parameters}
        assignments={assignments}
        reactions={reactions}
        nnBlocks={nnBlocks}
      />
    {/if}
    <SliderFields
      slider={vari.slider}
      onChange={(slider) => {
        variables[idx].slider = slider;
        variables = variables.slice();
      }}
    />
  {/snippet}
</DataTable>

<style>
  h4 {
    margin: 0;
  }
</style>
