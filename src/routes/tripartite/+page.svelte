<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Minus, Mul, Name, Num } from "$lib/mathml";
  import { ModelBuilder } from "$lib/model-editor/model";
  import ModelEditorPopover from "$lib/model-editor/ModelEditorPopover.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";

  // Simulation state
  let tEnd = $state(100);
  let simulatorComponent: Simulator;

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("Public", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
        },
      })
      .addVariable("Cheater", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
        },
      })
      .addVariable("Private", {
        value: 1.0,
        slider: {
          min: "0.0",
          max: "10000.0",
          step: "1",
        },
      })
      .addParameter("r_p", {
        value: 0.4,
        slider: {
          desc: "(growth rate)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
        },
      })
      .addParameter("eta", {
        value: 0.0001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
        },
      })
      .addParameter("nu", {
        value: 0.00001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "1.0",
          step: "0.00001",
        },
      })
      .addParameter("r_m", {
        value: 0.2,
        slider: {
          desc: "(growth rate)",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
        },
      })
      .addParameter("gamma", {
        value: 0.0001,
        slider: {
          desc: "(density)",
          min: "0.0",
          max: "5.0",
          step: "0.0001",
        },
      })
      .addParameter("alpha", {
        value: 0.0002,
        slider: {
          desc: "(P→C cooperation)",
          min: "0.0",
          max: "1.0",
          step: "0.0001",
        },
      })
      .addParameter("beta", {
        value: 0.0001,
        slider: {
          desc: "(P↔M competition)",
          min: "0.0",
          max: "1.0",
          step: "0.0001",
        },
      })
      .addReaction("dPdt", {
        fn: new Minus([
          new Mul([new Name("r_p"), new Name("Public")]),
          new Mul([new Name("alpha"), new Name("Public"), new Name("Cheater")]),
          new Mul([new Name("beta"), new Name("Public"), new Name("Private")]),
          new Mul([
            new Name("eta"),
            // FIXME: square
            new Name("Public"),
            new Name("Public"),
          ]),
        ]),
        stoichiometry: [{ name: "Public", value: new Num(1.0) }],
      })
      .addReaction("dCdt", {
        fn: new Minus([
          new Mul([new Name("alpha"), new Name("Public"), new Name("Cheater")]),
          new Mul([
            new Name("nu"),
            // FIXME: square
            new Name("Cheater"),
            new Name("Cheater"),
          ]),
        ]),
        stoichiometry: [{ name: "Cheater", value: new Num(1.0) }],
      })
      .addReaction("dMdt", {
        fn: new Minus([
          new Mul([new Name("r_m"), new Name("Private")]),
          new Mul([new Name("beta"), new Name("Public"), new Name("Private")]),
          new Mul([
            new Name("gamma"),
            // FIXME: Square
            new Name("Private"),
            new Name("Private"),
          ]),
        ]),
        stoichiometry: [{ name: "Private", value: new Num(1.0) }],
      });
  }

  let model = $state(initModel());

  const eqs = String.raw`
  \begin{align*}
    \frac{dP}{dt} &= r_p\,P - \alpha\,P\,C - \beta\,P\,M - \eta\,P^2 \\
    \frac{dC}{dt} &= \alpha\,P\,C - \nu\,C^2 \\
    \frac{dM}{dt} &= r_m\,M - \beta\,M\,P - \gamma\,M^2 \\
  \end{align*}`;

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
    <span class="bold">Tripartite-population-dynamics</span>
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

<p>
  Dynamic model of a tripartite population of <b>P</b>ublic consumers,
  <b>C</b>heaters and <b>P</b>rivate consumers.
</p>

<h3>Model equations</h3>

<Math tex={eqs} display />

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
    align-items: center;
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
