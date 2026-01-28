<script lang="ts">
  import { Add, Divide, Mul, Name, type Base } from "$lib/mathml";
  import EqEditor from "$lib/model-editor/EqEditor.svelte";

  function initEq(): Base {
    return new Mul([
      new Mul([new Name("k_{cat}"), new Name("e_{0}")]),
      new Divide([new Name("S"), new Add([new Name("K_m"), new Name("S")])]),
    ]);
  }

  const variables = ["S", "k_{cat}", "k_{M}", "e_{0}", "V_{max}"];
  let root = $state(initEq());
  $inspect(root);
</script>

<EqEditor {variables} bind:root></EqEditor>
