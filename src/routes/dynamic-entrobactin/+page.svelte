<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { Add, Divide, Minus, Mul, Name, Num } from "$lib/mathml";
  import { ModelBuilder } from "$lib/model-editor/model";
  import ModelEditorPopover from "$lib/model-editor/ModelEditorPopover.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";

  // Simulation state
  let tEnd = $state(100);
  let simulatorComponent: Simulator;

  function initModel(): ModelBuilder {
    return new ModelBuilder()
      .addVariable("e_coli", 5.0)
      .addVariable("c_gluta", 5.0)
      .addVariable("enterobactin", 5.0)
      .addParameter("mu_e", 0.4)
      .addParameter("mu_c", 0.3)
      .addParameter("a_e", 6.0)
      .addParameter("K_e", 0.5)
      .addParameter("K_c", 0.5)
      .addParameter("theta", 0.001)
      .addParameter("r_prod", 0.2)
      .addParameter("r_cons_e", 1.0)
      .addParameter("r_cons_c", 1.0)
      .addAssignment("a_c", {
        fn: new Minus([new Num(10), new Name("a_e")]),
      })
      .addAssignment("uptake_E_growth", {
        fn: new Divide([
          new Mul([new Name("a_e"), new Name("enterobactin")]),
          new Add([new Name("K_e"), new Name("enterobactin")]),
        ]),
      })
      .addAssignment("uptake_C_growth", {
        fn: new Divide([
          new Mul([new Name("a_c"), new Name("enterobactin")]),
          new Add([new Name("K_c"), new Name("enterobactin")]),
        ]),
      })
      .addAssignment("cons_term_E", {
        fn: new Mul([
          new Name("mu_e"),
          new Divide([
            new Mul([new Name("a_e"), new Name("enterobactin")]),
            new Mul([
              new Add([new Name("K_e"), new Name("a_e")]),
              new Name("enterobactin"),
            ]),
          ]),
          new Name("e_coli"),
        ]),
      })
      .addAssignment("cons_term_C", {
        fn: new Mul([
          new Name("mu_c"),
          new Divide([
            new Mul([new Name("a_c"), new Name("enterobactin")]),
            new Mul([
              new Add([new Name("K_c"), new Name("a_c")]),
              new Name("enterobactin"),
            ]),
          ]),
          new Name("c_gluta"),
        ]),
      })
      .addReaction("dEdt", {
        fn: new Mul([
          new Name("mu_e"),
          new Name("uptake_E_growth"),
          new Name("e_coli"),
        ]),
        stoichiometry: [{ name: "e_coli", value: new Num(1.0) }],
      })
      .addReaction("dCdt", {
        fn: new Minus([
          new Mul([
            new Name("mu_c"),
            new Name("uptake_C_growth"),
            new Name("c_gluta"),
          ]),
          new Mul([
            new Name("theta"),
            // FIXME: square
            new Name("c_gluta"),
            new Name("c_gluta"),
          ]),
        ]),
        stoichiometry: [{ name: "c_gluta", value: new Num(1.0) }],
      })
      .addReaction("dBdt", {
        fn: new Minus([
          new Mul([new Name("r_prod"), new Name("enterobactin")]),
          new Mul([new Name("r_cons_e"), new Name("cons_term_E")]),
          new Mul([new Name("r_cons_c"), new Name("cons_term_C")]),
        ]),
        stoichiometry: [{ name: "enterobactin", value: new Num(1.0) }],
      });
  }

  let model = $state(initModel());

  const varSliders = [
    {
      name: "e_coli",
      init: 5.0,
      min: "0.0",
      max: "1000.0",
      step: "1",
      fixed: false,
    },
    {
      name: "c_gluta",
      init: 5.0,
      min: "0.0",
      max: "1000.0",
      step: "1",
      fixed: false,
    },
    {
      name: "enterobactin",
      desc: "B₀",
      init: 1.0,
      min: "0.0",
      max: "1000.0",
      step: "0.5",
      fixed: false,
    },
  ];

  const parSliders = [
    {
      name: "mu_e",
      desc: "E. coli growth rate",
      init: 0.4,
      min: "0.0",
      max: "2.0",
      step: "0.01",
      fixed: false,
    },
    {
      name: "a_e",
      desc: "E. coli affinity",
      init: 6.0,
      min: "0.0",
      max: "10.0",
      step: "0.1",
      fixed: false,
    },
    {
      name: "mu_C",
      desc: "C. glut growth rate",
      init: 0.3,
      min: "0.0",
      max: "2.0",
      step: "0.01",
      fixed: false,
    },
    {
      name: "K_e",
      desc: "(half-sat E. coli)",
      init: 0.5,
      min: "0.00000001",
      max: "1.0",
      step: "0.000001",
      fixed: false,
    },
    {
      name: "K_C",
      desc: "(half-sat C)",
      init: 0.5,
      min: "0.00000001",
      max: "1.0",
      step: "0.000001",
      fixed: false,
    },
    {
      name: "theta",
      desc: "C density loss",
      init: 0.001,
      min: "0.0",
      max: "1.0",
      step: "0.0001",
      fixed: false,
    },
    {
      name: "r_prod",
      desc: "B production by E",
      init: 0.2,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
      fixed: false,
    },
    {
      name: "r_cons_e",
      desc: "B consumption weight E",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
      fixed: false,
    },
    {
      name: "r_cons_c",
      desc: "B consumption weight C",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
      fixed: false,
    },
  ];

  const eqs = String.raw`
  \begin{align*}
    \frac{dE}{dt}&=\mu_E\,\frac{a_E\,B}{K_E+B}\,E-\delta_E\,E \\
    \frac{dC}{dt}&=\mu_C\,\frac{a_C\,B}{K_C+B}\,C-\theta\,C^2 \\
    \frac{dB}{dt}&=r_{\text{prod}}\,E - r_{\text{cons,E}}\!\left(\mu_E\,\frac{a_E\,B}{K_E+a_E\,B}\,E\right) - r_{\text{cons,C}}\!\left(\mu_C\,\frac{a_C\,B}{K_C+a_C\,B}\,C\right) \\
  \end{align*}`;
</script>

<h1>Dynamic-Entrobactin</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqs} display />
</section>

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
    {#each varSliders as { name, desc, min, max, step, fixed }, idx}
      {#if fixed === undefined || !fixed}
        <Slider
          {name}
          {desc}
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
