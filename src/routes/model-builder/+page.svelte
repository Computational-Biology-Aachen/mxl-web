<script lang="ts">
  import { Add, Divide, Minus, Mul, Symbol } from "$lib/MathMl";
  import type { Derived, Reaction } from "$lib/ModelBuilder";
  import { ModelBuilder } from "$lib/ModelBuilder";
  import Simulator from "$lib/Simulator.svelte";

  function initialModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("x1", 1.0)
      .addVariable("x2", 2.0)
      .addParameter("kf", 1.0)
      .addParameter("keq", 2.0)
      .addDerived("kr", {
        fn: new Divide([new Symbol("kf"), new Symbol("keq")]),
        args: ["kf", "keq"],
      })
      .addReaction("r1", {
        fn: new Mul([new Symbol("kf"), new Symbol("x1")]),
        args: ["kf", "x1"],
        stoichiometry: { x1: -1.0, x2: 1.0 },
      })
      .addReaction("r2", {
        fn: new Mul([new Symbol("kr"), new Symbol("x2")]),
        args: ["kr", "x2"],
        stoichiometry: { x1: 1.0, x2: -1.0 },
      });
  }

  let builder = $state(initialModel());
  let userParameters: string[] = [];
  let pycode = $derived.by(() => builder.buildPython(userParameters));

  // Variables state
  let newVarName = $state("");
  let newVarValue = $state(0);
  let editingVariable = $state<string | null>(null);
  let editVarValue = $state(0);

  // Parameters state
  let newParamName = $state("");
  let newParamValue = $state(0);
  let editingParameter = $state<string | null>(null);
  let editParamValue = $state(0);

  // Derived state
  let newDerivedName = $state("");
  let newDerivedArgs = $state("");
  let newDerivedTemplate = $state("multiply");

  // Reactions state
  let newReactionName = $state("");
  let newReactionArgs = $state("");
  let newReactionTemplate = $state("multiply");
  let newReactionStoich = $state("");

  function addVariable() {
    if (newVarName && !builder.variables[newVarName]) {
      builder.addVariable(newVarName, newVarValue);
      newVarName = "";
      newVarValue = 0;
      builder = builder;
    }
  }

  function removeVariable(key: string) {
    builder.removeVariable(key);
    builder = builder;
  }

  function startEditVariable(key: string) {
    editingVariable = key;
    editVarValue = builder.variables[key];
  }

  function saveEditVariable() {
    if (editingVariable) {
      builder.updateVariable(editingVariable, editVarValue);
      editingVariable = null;
      builder = builder;
    }
  }

  function addParameter() {
    if (newParamName && !builder.parameters[newParamName]) {
      builder.addParameter(newParamName, newParamValue);
      newParamName = "";
      newParamValue = 0;
      builder = builder;
    }
  }

  function removeParameter(key: string) {
    builder.removeParameter(key);
    builder = builder;
  }

  function startEditParameter(key: string) {
    editingParameter = key;
    editParamValue = builder.parameters[key];
  }

  function saveEditParameter() {
    if (editingParameter) {
      builder.updateParameter(editingParameter, editParamValue);
      editingParameter = null;
      builder = builder;
    }
  }

  function createDerivedFn(template: string, args: string[]) {
    const symbols = args.map((a) => new Symbol(a));
    switch (template) {
      case "multiply":
        return new Mul(symbols);
      case "add":
        return new Add(symbols);
      case "divide":
        return new Divide(symbols);
      case "subtract":
        return new Minus(symbols);
      default:
        return new Mul(symbols);
    }
  }

  function addDerived() {
    if (newDerivedName && newDerivedArgs && !builder.derived[newDerivedName]) {
      const args = newDerivedArgs.split(",").map((s) => s.trim());
      const derived: Derived = {
        fn: createDerivedFn(newDerivedTemplate, args),
        args: args,
      };
      builder.addDerived(newDerivedName, derived);
      newDerivedName = "";
      newDerivedArgs = "";
      builder = builder;
    }
  }

  function removeDerived(key: string) {
    builder.removeDerived(key);
    builder = builder;
  }

  function parseStoich(stoichStr: string): Record<string, number> {
    // Format: "x1:-1, x2:1"
    const result: Record<string, number> = {};
    const pairs = stoichStr.split(",").map((s) => s.trim());
    for (const pair of pairs) {
      const [varName, numStr] = pair.split(":").map((s) => s.trim());
      if (varName && numStr) {
        result[varName] = parseFloat(numStr);
      }
    }
    return result;
  }

  function addReaction() {
    if (
      newReactionName &&
      newReactionArgs &&
      newReactionStoich &&
      !builder.reactions[newReactionName]
    ) {
      const args = newReactionArgs.split(",").map((s) => s.trim());
      const reaction: Reaction = {
        fn: createDerivedFn(newReactionTemplate, args),
        args: args,
        stoichiometry: parseStoich(newReactionStoich),
      };
      builder.addReaction(newReactionName, reaction);
      newReactionName = "";
      newReactionArgs = "";
      newReactionStoich = "";
      builder = builder;
    }
  }

  function removeReaction(key: string) {
    builder.removeReaction(key);
    builder = builder;
  }

  let tEnd = $state(100);
  let pars = [];
  let variables = [
    {
      name: "x1",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "1",
    },
    {
      name: "x2",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "1",
    },
  ];
</script>

<div class="container">
  <h1>Model Builder</h1>

  <div class="section">
    <h2>Variables</h2>
    <div class="list">
      <div class="item">
        <span>Name</span>
        <span>Initial value</span>
      </div>
      {#each Object.entries(builder.variables) as [name, value]}
        <div class="item">
          {#if editingVariable === name}
            <input type="text" value={name} disabled />
            <input type="number" bind:value={editVarValue} step="0.1" />
            <button onclick={saveEditVariable}>Save</button>
            <button onclick={() => (editingVariable = null)}>Cancel</button>
          {:else}
            <span class="name">{name}</span>
            <span class="value">{value}</span>
            <button onclick={() => startEditVariable(name)}>⚙️</button>
            <button onclick={() => removeVariable(name)}>-</button>
          {/if}
        </div>
      {/each}
    </div>
    <div class="add-form">
      <input type="text" bind:value={newVarName} placeholder="Variable name" />
      <input
        type="number"
        bind:value={newVarValue}
        placeholder="Initial value"
        step="0.1"
      />
      <button onclick={addVariable}>+</button>
    </div>
  </div>

  <div class="section">
    <h2>Parameters</h2>
    <div class="list">
      {#each Object.entries(builder.parameters) as [name, value]}
        <div class="item">
          {#if editingParameter === name}
            <input type="text" value={name} disabled />
            <input type="number" bind:value={editParamValue} step="0.1" />
            <button onclick={saveEditParameter}>Save</button>
            <button onclick={() => (editingParameter = null)}>Cancel</button>
          {:else}
            <span class="name">{name}</span>
            <span class="value">{value}</span>
            <button onclick={() => startEditParameter(name)}>⚙️</button>
            <button onclick={() => removeParameter(name)}>-</button>
          {/if}
        </div>
      {/each}
    </div>
    <div class="add-form">
      <input
        type="text"
        bind:value={newParamName}
        placeholder="Parameter name"
      />
      <input
        type="number"
        bind:value={newParamValue}
        placeholder="Value"
        step="0.1"
      />
      <button onclick={addParameter}>+</button>
    </div>
  </div>

  <div class="section">
    <h2>Derived Values</h2>
    <div class="list">
      {#each Object.entries(builder.derived) as [name, derived]}
        <div class="item">
          <span class="name">{name}</span>
          <span class="value">{derived.fn.toPy()}</span>
          <span class="args">args: [{derived.args.join(", ")}]</span>
          <button onclick={() => removeDerived(name)}>-</button>
        </div>
      {/each}
    </div>
    <div class="add-form">
      <input type="text" bind:value={newDerivedName} placeholder="Name" />
      <input
        type="text"
        bind:value={newDerivedArgs}
        placeholder="Args (comma-separated)"
      />
      <select bind:value={newDerivedTemplate}>
        <option value="multiply">Multiply</option>
        <option value="add">Add</option>
        <option value="divide">Divide</option>
        <option value="subtract">Subtract</option>
      </select>
      <button onclick={addDerived}>+</button>
    </div>
  </div>

  <div class="section">
    <h2>Reactions</h2>
    <div class="list">
      {#each Object.entries(builder.reactions) as [name, reaction]}
        <div class="item">
          <span class="name">{name}</span>
          <span class="value">{reaction.fn.toPy()}</span>
          <span class="args">args: [{reaction.args.join(", ")}]</span>
          <span class="stoich"
            >stoich: {JSON.stringify(reaction.stoichiometry)}</span
          >
          <button onclick={() => removeReaction(name)}>-</button>
        </div>
      {/each}
    </div>
    <div class="add-form">
      <input type="text" bind:value={newReactionName} placeholder="Name" />
      <input
        type="text"
        bind:value={newReactionArgs}
        placeholder="Args (comma-separated)"
      />
      <select bind:value={newReactionTemplate}>
        <option value="multiply">Multiply</option>
        <option value="add">Add</option>
        <option value="divide">Divide</option>
        <option value="subtract">Subtract</option>
      </select>
      <input
        type="text"
        bind:value={newReactionStoich}
        placeholder="Stoichiometry (x1:-1, x2:1)"
      />
      <button onclick={addReaction}>+</button>
    </div>
  </div>

  <div class="section">
    <h2>Generated Python Code</h2>
    <pre>{pycode}</pre>
  </div>

  <div id="simulation">
    <h2>Simulation</h2>

    <Simulator
      modelJs={""}
      modelPy={`${pycode}\nmodel`}
      {pars}
      tEnd={10}
      {variables}
      yLim={5}
    />
  </div>
</div>

<style>
  .container {
    max-width: 100%;
    margin: 0 auto;
    padding: 2rem;
  }

  .section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
  }

  h1 {
    margin-bottom: 2rem;
  }

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    background: #f5f5f5;
    border-radius: 4px;
  }

  .name {
    font-weight: bold;
    min-width: 100px;
  }

  .value {
    min-width: 100px;
  }

  .args,
  .stoich {
    font-size: 0.9rem;
    color: #666;
  }

  .add-form {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  input[type="text"],
  input[type="number"] {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem 1rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #0056b3;
  }

  pre {
    background: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
  }
</style>
