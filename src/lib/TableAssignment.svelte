<script lang="ts">
  import { Math } from "@computational-biology-aachen/design";
  import {
    defaultTexName,
    defaultValue,
  } from "@computational-biology-aachen/mxlweb-core";
  import { Num } from "@computational-biology-aachen/mxlweb-core/mathml";
  import DataTable from "./DataTable.svelte";
  import EqEditor from "./EqEditor.svelte";
  import ExprCell from "./ExprCell.svelte";
  import { nextFreeId } from "./modelDiagnostics";
  import {
    idToTex,
    type AssView,
    type NNBlockView,
    type ParView,
    type RxnView,
    type VarView,
  } from "./modelView";
  import NameCell from "./NameCell.svelte";

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
    { key: "name", label: "Name", width: "40%" },
    { key: "fn", label: "Expression" },
  ];

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  function add(): string {
    const id = nextFreeId("a", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    assignments = [...assignments, { id, fn: new Num(1.0), texName: id }];
    return id;
  }
</script>

<DataTable
  kind="assignment"
  rows={assignments}
  idOf={(a) => a.id}
  labelOf={(a) => defaultValue(a.displayName, a.id)}
  columns={columns}
  onAdd={add}
  onRemove={(a) => (assignments = assignments.filter((i) => i.id !== a.id))}
>
  {#snippet cell(key: string, ass: AssView[number], idx: number)}
    {#if key === "name"}
      <NameCell
        name={defaultValue(ass.displayName, ass.id)}
        texName={ass.texName || ""}
        onName={(value) => {
          assignments[idx].displayName = value;
          assignments[idx].texName = defaultTexName(value);
          assignments = assignments.slice();
        }}
        onTex={(value) => {
          assignments[idx].texName = value;
          assignments = assignments.slice();
        }}
      />
    {:else}
      <ExprCell tex={ass.fn.toTex(texNames)} />
    {/if}
  {/snippet}

  {#snippet expansion(ass: AssView[number], idx: number)}
    <Math
      tex={ass.fn.toTex(texNames)}
      display={true}
    />
    <EqEditor
      bind:root={
        () => assignments[idx].fn,
        (fn) => {
          assignments[idx].fn = fn;
          assignments = assignments.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      nnBlocks={nnBlocks}
    />
  {/snippet}
</DataTable>
