<script lang="ts">
  import { Num } from "$lib/mathml";
  import type {
    AssView,
    ParView,
    RxnView,
    VarView,
  } from "$lib/model-editor/modelView";
  import StoichEditor from "$lib/model-editor/StoichEditor.svelte";

  const variables: VarView = [
    ["x", { value: 1.0 }],
    ["y", { value: 1.0 }],
    ["z", { value: 1.0 }],
  ];
  const parameters: ParView = [];
  const assignments: AssView = [];
  const reactions: RxnView = [];

  let stoichs = $state([
    { name: "x", value: new Num(-1.0) },
    { name: "y", value: new Num(1.0) },
  ]);
</script>

<StoichEditor
  stoichiometry={stoichs}
  variables={variables}
  parameters={parameters}
  assignments={assignments}
  reactions={reactions}
  popovertarget="/"
  onSave={() => null}
/>
