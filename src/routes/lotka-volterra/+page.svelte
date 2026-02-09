<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Mul, Name, Num } from "$lib/mathml";
  import { ModelBuilder } from "$lib/model-editor/model";
  import ModelEditorPopover from "$lib/model-editor/ModelEditorPopover.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addParameter("Alpha", {
        value: 0.1,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\alpha`,
        },
      })
      .addParameter("Beta", {
        value: 0.02,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\beta`,
        },
      })
      .addParameter("Gamma", {
        value: 0.4,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.05",
          texName: String.raw`\gamma`,
        },
      })
      .addParameter("Delta", {
        value: 0.02,
        slider: {
          min: "0.01",
          max: "1.0",
          step: "0.001",
          texName: String.raw`\delta`,
        },
      })
      .addVariable("Prey", {
        value: 10.0,
        slider: {
          min: "1.0",
          max: "20.0",
          step: "1.0",
        },
      })
      .addVariable("Predator", {
        value: 10.0,
        slider: {
          min: "1.0",
          max: "20.0",
          step: "1.0",
        },
      })
      .addReaction("v0", {
        fn: new Mul([new Name("Alpha"), new Name("Prey")]),
        stoichiometry: [{ name: "Prey", value: new Num(1.0) }],
      })
      .addReaction("v1", {
        fn: new Mul([new Name("Beta"), new Name("Prey"), new Name("Predator")]),
        stoichiometry: [{ name: "Prey", value: new Num(-1.0) }],
      })
      .addReaction("v2", {
        fn: new Mul([
          new Name("Delta"),
          new Name("Prey"),
          new Name("Predator"),
        ]),
        stoichiometry: [{ name: "Predator", value: new Num(1.0) }],
      })
      .addReaction("v3", {
        fn: new Mul([new Name("Gamma"), new Name("Predator")]),
        stoichiometry: [{ name: "Predator", value: new Num(-1.0) }],
      });
  }

  // Simulation state
  const tEnd = 100;
  let simulatorComponent: Simulator;
  let model = $state(initModel());

  let parSliders = $derived.by(() => {
    return model.parameters
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([name, par]) => {
        return {
          name: name,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });

  let varSliders = $derived.by(() => {
    return model.variables
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([name, par]) => {
        return {
          name: name,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });
</script>

<div class="topbar">
  <div class="breadcrumbs">
    <a class="light" href="{base}/">Models</a>
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

<Math tex={model.buildTex()} display />

{#if parSliders.length > 0}
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
            return model.parameters.get(par.name)!.value;
          },
          (val) => {
            let old = model.parameters.get(par.name)!;

            model.parameters = model.parameters.set(par.name, {
              ...old,
              value: val,
            });
          }
        }
        min={par.min}
        max={par.max}
        step={par.step}
      />
    {/each}
  </div>
{/if}

{#if varSliders.length > 0}
  <div class="heading">
    <Icon>tune</Icon>
    <h3>Initial conditions</h3>
  </div>
  <div class="grid-row">
    {#each varSliders as { name, min, max, step }, idx}
      <Slider
        {name}
        callback={() => simulatorComponent.runSimulation(model)}
        bind:val={
          () => {
            return model.variables.get(name)!.value;
          },
          (val) => {
            let old = model.variables.get(name)!;
            model.variables = model.variables.set(name, { ...old, value: val });
          }
        }
        {min}
        {max}
        {step}
      />
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
