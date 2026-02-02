<script lang="ts">
  import { Num } from "$lib/mathml";
  import StoichEditor from "$lib/model-editor/StoichEditor.svelte";

  const variables = ["x", "y", "z"];

  let stoichs = $state([
    { name: "x", value: new Num(-1.0) },
    { name: "y", value: new Num(1.0) },
  ]);
</script>

<StoichEditor stoichiometry={stoichs} variableNames={variables} />
