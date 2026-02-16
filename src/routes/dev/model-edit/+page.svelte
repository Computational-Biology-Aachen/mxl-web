<script lang="ts">
  import { Divide, Mul, Name, Num } from "$lib/mathml";
  import {
    ModelView,
    type AssView,
    type ParView,
    type RxnView,
    type VarView,
  } from "$lib/model-editor/model";
  import ModelEditor from "$lib/model-editor/ModelEditor.svelte";

  let userParameters: string[] = [];

  let variables: VarView = $state([
    ["x0", { value: 1.0 }],
    ["x1", { value: 1.0 }],
  ]);
  let parameters: ParView = $state([
    ["kf", { value: 1.0 }],
    ["keq", { value: 1.0 }],
  ]);
  let assignments: AssView = $state([
    [
      "kr",
      {
        fn: new Divide([new Name("kf"), new Name("keq")]),
        args: ["kf", "keq"],
      },
    ],
  ]);
  let reactions: RxnView = $state([
    [
      "r1",
      {
        fn: new Mul([new Name("kf"), new Name("x1")]),
        args: ["kf", "x1"],
        stoichiometry: [
          { name: "x0", value: new Num(-1.0) },
          { name: "x1", value: new Num(1.0) },
        ],
      },
    ],
    [
      "r2",
      {
        fn: new Mul([new Name("kr"), new Name("x2")]),
        args: ["kr", "x2"],
        stoichiometry: [
          { name: "x0", value: new Num(1.0) },
          { name: "x1", value: new Num(-1.0) },
        ],
      },
    ],
  ]);

  let modelView = $derived.by(() => {
    let lcl = new ModelView();
    lcl.variables = variables;
    lcl.parameters = parameters;
    lcl.assignments = assignments;
    lcl.reactions = reactions;
    return lcl;
  });
  let builder = $derived(modelView.toBuilder());
</script>

<ModelEditor
  parent={builder}
  onSave={() => {}}
  popovertarget=""
/>
