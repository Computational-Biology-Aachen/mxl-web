<script lang="ts">
  import { Add, Divide, Mul, Name, type Base } from "$lib/mathml";
  import EqEditor from "$lib/model-editor/EqEditor.svelte";
  import type {
    AssView,
    ParView,
    RxnView,
    VarView,
  } from "$lib/model-editor/model";

  function initEq(): Base {
    return new Mul([
      new Mul([new Name("kcat"), new Name("e0")]),
      new Divide([new Name("S"), new Add([new Name("km"), new Name("S")])]),
    ]);
  }

  const variables: VarView = [
    ["S", { value: 1.0 }],
    [
      "kcat",
      {
        value: 1.0,
        slider: { min: "0", max: "1.0", step: "0.1", texName: "k_{cat}" },
      },
    ],
    [
      "km",
      {
        value: 1.0,
        slider: { min: "0", max: "1.0", step: "0.1", texName: "k_{M}" },
      },
    ],
    [
      "e0",
      {
        value: 1.0,
        slider: { min: "0", max: "1.0", step: "0.1", texName: "e_{0}" },
      },
    ],
    [
      "vmax",
      {
        value: 1.0,
        slider: { min: "0", max: "1.0", step: "0.1", texName: "V_{max}" },
      },
    ],
  ];
  const parameters: ParView = [];
  const assignments: AssView = [];
  const reactions: RxnView = [];
  let root = $state(initEq());
  $inspect(root);
</script>

<EqEditor
  variables={variables}
  parameters={parameters}
  assignments={assignments}
  reactions={reactions}
  bind:root={root}
  popovertarget="/"
  onSave={() => null}
></EqEditor>
