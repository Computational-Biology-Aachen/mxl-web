<script lang="ts">
  import Icon from "$lib/Icon.svelte";
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

<div class="topbar">
  <div class="breadcrumbs">
    <a class="light" href="/">Models</a>
    <span class="light">/</span>
    <span class="bold">Lotka-Volterra</span>
  </div>
  <div class="row">
    <button
      onclick={() => {
        model = initModel();
        simulatorComponent.runSimulation(model);
      }}>Reset</button
    >
    <button popovertarget="model-editor">Edit model</button>
  </div>
</div>

{#if parSliders.some((i) => i.fixed === undefined || !i.fixed)}
  <div class="heading">
    <Icon>tune</Icon>
    <h3>Simulation parameters</h3>
  </div>
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
  <div class="heading">
    <Icon>tune</Icon>
    <h3>Initial conditions</h3>
  </div>
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
  .topbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .breadcrumbs {
    display: flex;
    gap: 0.5rem;
    font-size: var(--text-sm);
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  .heading {
    display: flex;
    gap: 0.5rem;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    box-shadow: var(--shadow);
    border-radius: 0.75rem;
    background-color: var(--bg-l1);
    padding: 1.5rem;
  }
  .bold {
    font-weight: 600;
  }
  .light {
    color: var(--slate-400);
    font-weight: 400;
  }
  a.light:hover {
    color: var(--primary);
  }
  button {
    cursor: pointer;
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    padding: 0 1rem;
    min-width: 1rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
