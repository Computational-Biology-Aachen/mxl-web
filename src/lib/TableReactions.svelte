<script lang="ts">
  import {
    defaultTexName,
    defaultValue,
    stoichToTex,
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
  import StoichEditor from "./StoichEditor.svelte";

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
    { key: "name", label: "Name", width: "30%" },
    { key: "fn", label: "Rate law", width: "35%" },
    { key: "stoich", label: "Stoichiometry" },
  ];

  let texNames: Map<string, string> = $derived(
    idToTex(variables, parameters, assignments, reactions),
  );

  // NN blocks no longer create a reaction at all (ADR 0005's mechanism
  // selector — a multiplicative block can't be expressed as one more
  // stoichiometric term, so composition moved to a shared step in
  // mxlweb-core's ModelBuilderBase.lower() instead) — every row here is
  // always a genuine hand-authored reaction, no exclusion needed.
  function add(): string {
    const id = nextFreeId("v", {
      variables,
      parameters,
      assignments,
      reactions,
      readouts,
      nnBlocks,
    });
    reactions = [
      ...reactions,
      {
        id,
        fn: new Num(1.0),
        texName: id,
        stoichiometry: variables[0]
          ? [{ name: variables[0].id, value: new Num(1.0) }]
          : [],
      },
    ];
    return id;
  }
</script>

<DataTable
  kind="reaction"
  rows={reactions}
  idOf={(r) => r.id}
  labelOf={(r) => defaultValue(r.displayName, r.id)}
  columns={columns}
  onAdd={add}
  onRemove={(r) => (reactions = reactions.filter((i) => i.id !== r.id))}
>
  {#snippet cell(key: string, rxn: RxnView[number], idx: number)}
    {#if key === "name"}
      <NameCell
        name={defaultValue(rxn.displayName, rxn.id)}
        texName={rxn.texName || ""}
        onName={(value) => {
          reactions[idx].displayName = value;
          reactions[idx].texName = defaultTexName(value);
          reactions = reactions.slice();
        }}
        onTex={(value) => {
          reactions[idx].texName = value;
          reactions = reactions.slice();
        }}
      />
    {:else if key === "fn"}
      <ExprCell tex={rxn.fn.toTex(texNames)} />
    {:else}
      <ExprCell tex={stoichToTex(rxn.stoichiometry, texNames)} />
    {/if}
  {/snippet}

  {#snippet expansion(_rxn: RxnView[number], idx: number)}
    <h4>Rate law</h4>
    <EqEditor
      bind:root={
        () => reactions[idx].fn,
        (fn) => {
          reactions[idx].fn = fn;
          reactions = reactions.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
      nnBlocks={nnBlocks}
    />
    <h4>Stoichiometry</h4>
    <StoichEditor
      bind:stoichiometry={
        () => reactions[idx].stoichiometry,
        (stoichiometry) => {
          reactions[idx].stoichiometry = stoichiometry;
          reactions = reactions.slice();
        }
      }
      variables={variables}
      parameters={parameters}
      assignments={assignments}
      reactions={reactions}
    />
  {/snippet}
</DataTable>

<style>
  h4 {
    margin: 0;
  }
</style>
