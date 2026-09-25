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
    readouts: AssView;
  } = $props();

  const columns = [
    { key: "name", label: "Name", width: "40%" },
    { key: "fn", label: "Expression" },
  ];

  // A readout may reference a variable/parameter/reaction directly, or an
  // existing assignment (derived quantity), or another readout — but never
  // the reverse (mxlweb-core issue #6: nothing that feeds dxdt may ever
  // reference a readout). This picker/rendering set reflects that: it's
  // strictly broader than TableAssignment.svelte's own (assignments-only).
  let referenceable: AssView = $derived([...assignments, ...readouts]);

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, referenceable, reactions),
  );

  function add(): string {
    const id = nextFreeId("ro", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    readouts = [...readouts, { id, fn: new Num(1.0), texName: id }];
    return id;
  }
</script>

<DataTable
  kind="readout"
  rows={readouts}
  idOf={(r) => r.id}
  labelOf={(r) => defaultValue(r.displayName, r.id)}
  columns={columns}
  onAdd={add}
  onRemove={(r) => (readouts = readouts.filter((i) => i.id !== r.id))}
>
  {#snippet cell(key: string, ro: AssView[number], idx: number)}
    {#if key === "name"}
      <NameCell
        name={defaultValue(ro.displayName, ro.id)}
        texName={ro.texName || ""}
        onName={(value) => {
          readouts[idx].displayName = value;
          readouts[idx].texName = defaultTexName(value);
          readouts = readouts.slice();
        }}
        onTex={(value) => {
          readouts[idx].texName = value;
          readouts = readouts.slice();
        }}
      />
    {:else}
      <ExprCell tex={ro.fn.toTex(texNames)} />
    {/if}
  {/snippet}

  {#snippet expansion(ro: AssView[number], idx: number)}
    <Math
      tex={ro.fn.toTex(texNames)}
      display={true}
    />
    <EqEditor
      bind:root={
        () => readouts[idx].fn,
        (fn) => {
          readouts[idx].fn = fn;
          readouts = readouts.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={referenceable}
      reactions={reactions}
      nnBlocks={nnBlocks}
    />
  {/snippet}
</DataTable>
