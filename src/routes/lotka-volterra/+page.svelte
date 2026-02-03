<script lang="ts">
  import { Mul, Name, Num } from "$lib/mathml";
  import { ModelBuilder } from "$lib/model-editor/model";
  import ModelEditorPopover from "$lib/model-editor/ModelEditorPopover.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";

  // Simulation state
  const tEnd = 100;

  let simulatorComponent: Simulator;

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addParameter("Alpha", 0.1)
      .addParameter("Beta", 0.02)
      .addParameter("Gamma", 0.4)
      .addParameter("Delta", 0.02)
      .addVariable("Predator", 10.0)
      .addVariable("Prey", 10.0)
      .addReaction("v0", {
        fn: new Mul([new Name("Alpha"), new Name("Prey")]),
        args: ["Alpha", "Prey"],
        stoichiometry: [{ name: "Prey", value: new Num(1.0) }],
      })
      .addReaction("v1", {
        fn: new Mul([new Name("Beta"), new Name("Prey"), new Name("Predator")]),
        args: ["Beta", "Prey", "Predator"],
        stoichiometry: [{ name: "Prey", value: new Num(-1.0) }],
      })
      .addReaction("v2", {
        fn: new Mul([new Name("Gamma"), new Name("Predator")]),
        args: ["Gamma", "Predator"],
        stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
      })
      .addReaction("v3", {
        fn: new Mul([
          new Name("Delta"),
          new Name("Prey"),
          new Name("Predator"),
        ]),
        args: ["Delta", "Prey", "Predator"],
        stoichiometry: [{ name: "Predator", value: new Num(1.0) }],
      });
  }

  const parSliders = [
    {
      name: "Alpha",
      min: "0.01",
      max: "1.0",
      step: "0.05",
      fixed: false,
    },
    {
      name: "Beta",
      min: "0.01",
      max: "1.0",
      step: "0.05",
      fixed: false,
    },
    {
      name: "Gamma",
      min: "0.01",
      max: "1.0",
      step: "0.05",
      fixed: false,
    },
    {
      name: "Delta",
      min: "0.01",
      max: "1.0",
      step: "0.001",
      fixed: false,
    },
  ];

  const varSliders = [
    {
      name: "Prey",
      min: "1.0",
      max: "20.0",
      step: "1.0",
      fixed: false,
    },
    {
      name: "Predator",
      min: "1.0",
      max: "20.0",
      step: "1.0",
      fixed: false,
    },
  ];

  let model = $state(initModel());
</script>

<h1>Lotka-Volterra</h1>
<div class="row">
  <p>Quick and dirty demo to get ODE integration running on the client-side.</p>
  <button
    onclick={() => {
      model = initModel();
      simulatorComponent.runSimulation(model);
    }}>Reset</button
  >
  <button popovertarget="model-editor">Edit model</button>
</div>

{#if parSliders.some((i) => i.fixed === undefined || !i.fixed)}
  <h3>Parameters</h3>
  <div class="grid-row">
    {#each parSliders as par, idx (par.name)}
      <Slider
        name={par.name}
        callback={() => simulatorComponent.runSimulation(model)}
        bind:val={
          () => {
            return model.parameters.get(par.name) ?? 0;
          },
          (val) => {
            model.parameters = model.parameters.set(par.name, val!);
          }
        }
        min={par.min}
        max={par.max}
        step={par.step}
      />
    {/each}
  </div>
{/if}

{#if varSliders.some((i) => i.fixed === undefined || !i.fixed)}
  <h3>Variables</h3>
  <div class="grid-row">
    {#each varSliders as { name, min, max, step, fixed }, idx}
      {#if fixed === undefined || !fixed}
        <Slider
          {name}
          callback={() => simulatorComponent.runSimulation(model)}
          bind:val={
            () => {
              return model.variables.get(name) ?? 0;
            },
            (val) => {
              model.variables = model.variables.set(name, val!);
            }
          }
          {min}
          {max}
          {step}
        />
      {/if}
    {/each}
  </div>
{/if}

<Simulator bind:this={simulatorComponent} {model} {tEnd}></Simulator>

<ModelEditorPopover
  parent={model}
  onSave={(edited) => {
    model = edited;
    simulatorComponent.runSimulation(model);
  }}
/>

<style>
  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
  }
</style>
