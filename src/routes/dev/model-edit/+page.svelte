<script lang="ts">
  import { Divide, Mul, Name, Num } from "$lib/mathml";
  import {
    ModelView,
    type AssView,
    type ParView,
    type RxnView,
    type VarView,
  } from "$lib/model-editor/model";
  import TableAssignments from "$lib/model-editor/TableAssignment.svelte";
  import TableParameters from "$lib/model-editor/TableParameters.svelte";
  import TableReactions from "$lib/model-editor/TableReactions.svelte";
  import TableVariables from "$lib/model-editor/TableVariables.svelte";

  let userParameters: string[] = [];

  let variables: VarView = $state([
    ["x0", 1.0],
    ["x1", 1.0],
  ]);
  let parameters: ParView = $state([
    ["kf", 1.0],
    ["keq", 1.0],
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
  let pycode = $derived.by(() => builder.buildPython(userParameters));

  let tabs = [
    { name: "Variables", comp: TableVariables },
    {
      name: "Parameters",
      comp: TableParameters,
    },
    {
      name: "Assignments",
      comp: TableAssignments,
    },
    {
      name: "Reactions",
      comp: TableReactions,
    },
  ];

  let cur = $state(tabs[0]);
</script>

<ul>
  {#each tabs as tab}
    <button
      class:selected={cur.name === tab.name}
      class="tab"
      onclick={() => (cur = tab)}
    >
      {tab.name}
    </button>
  {/each}
</ul>

<cur.comp bind:variables bind:parameters bind:assignments bind:reactions />

<div class="section">
  <h2>Generated Python Code</h2>
  <pre>{pycode}</pre>
</div>

<style>
  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button.tab {
    width: 100%;
    margin: 0rem;
    padding: 0.3rem;
    font-size: 0.95rem;
    font-weight: 700;
  }
  button.selected {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
    border-top-width: 8px;
    border-color: #333;
  }
  pre {
    padding: var(--pico-spacing);
  }
</style>
