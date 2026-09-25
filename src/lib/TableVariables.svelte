<script lang="ts">
  import {
    ButtonIcon as IconButton,
    Math,
    Popover,
  } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Base } from "@computational-biology-aachen/mxlweb-core/mathml";
  import DataTable from "./DataTable.svelte";
  import EqEditor from "./EqEditor.svelte";
  import { nextFreeId } from "./modelDiagnostics";
  import NameCell from "./NameCell.svelte";
  import NumberCell from "./NumberCell.svelte";
  import {
    idToTex,
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type Variable,
    type VarView,
  } from "./modelView";
  import SliderFields from "./SliderFields.svelte";

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

  function onSaveInitialAssignment(idx: number, fn: Base) {
    variables[idx] = { ...variables[idx], value: fn };
    variables = variables.slice();
  }

  let texNames = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  const columns = [
    { key: "name", label: "Name", width: "50%" },
    {
      key: "value",
      label: "Initial value",
      align: "right" as const,
      width: "12rem",
    },
  ];

  function add(): string {
    const id = nextFreeId("x", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    variables = [...variables, { id, value: 1.0, texName: id }];
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
  {#snippet cell(key: string, vari: Variable, idx: number)}
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
    {:else}
      {#if vari.value instanceof Base}
        <div class="row">
          <Math
            tex={vari.value.toTex(texNames)}
            display={true}
            fontSize="0.75rem"
          />
          <IconButton
            icon="edit"
            popovertarget="var-ia-editor-{idx}"
          />
        </div>
      {:else}
        <NumberCell
          id="var-{idx}"
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
    {/if}
  {/snippet}

  {#snippet expansion(vari: Variable, idx: number)}
    <SliderFields
      slider={vari.slider}
      onChange={(slider) => {
        variables[idx].slider = slider;
        variables = variables.slice();
      }}
    />
  {/snippet}
</DataTable>

{#each variables as vari, idx (vari.id)}
  {#if vari.value instanceof Base}
    <Popover
      size="md"
      popovertarget={`var-ia-editor-${idx}`}
    >
      <EqEditor
        root={vari.value}
        variables={variables}
        parameters={parameters}
        assignments={assignments}
        reactions={reactions}
        nnBlocks={nnBlocks}
        onSave={(fn) => onSaveInitialAssignment(idx, fn)}
        popovertarget={`var-ia-editor-${idx}`}
      />
    </Popover>
  {/if}
{/each}

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
  }
</style>
