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
  import TexNameInput from "./TexNameInput.svelte";

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
    { key: "name", label: "Name" },
    { key: "value", label: "Initial value", align: "right" as const },
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
      <div class="name-cell">
        <input
          type="text"
          aria-label="Name"
          bind:value={
            () => defaultValue(variables[idx].displayName, variables[idx].id),
            (value) => {
              variables[idx].displayName = value;
              variables[idx].texName = defaultTexName(value);
              variables = variables.slice();
            }
          }
        />
        <div class="tex">
          <TexNameInput
            bind:value={
              () => variables[idx].texName,
              (value) => {
                variables[idx].texName = value;
                variables = variables.slice();
              }
            }
          />
        </div>
      </div>
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
    <div class="slider">
      <label>
        <input
          type="checkbox"
          bind:checked={
            () => variables[idx].slider !== undefined,
            (on) => {
              variables[idx].slider = on
                ? { min: "0.0", max: "1.0", step: "0.1" }
                : undefined;
              variables = variables.slice();
            }
          }
        />
        Display slider
      </label>
      {#if vari.slider}
        {#each ["min", "max", "step"] as const as field (field)}
          <label>
            {field}
            <input
              type="text"
              inputmode="decimal"
              class="slider-field"
              bind:value={
                () => variables[idx].slider![field],
                (value) => {
                  variables[idx].slider![field] = value;
                  variables = variables.slice();
                }
              }
            />
          </label>
        {/each}
      {/if}
    </div>
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
  .name-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .name-cell input,
  .tex {
    flex: 1 1 50%;
    min-width: 0;
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
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
  .slider label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
  }
  .slider input[type="checkbox"] {
    width: auto;
  }
  .slider-field {
    border: var(--border-primary);
    width: 5rem;
    text-align: right;
  }
  .slider {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1.5rem;
  }
</style>
