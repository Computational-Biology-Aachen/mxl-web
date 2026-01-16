<script lang="ts">
  import Math from "$lib/Math.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  // End shared setup

  // Simulation settings
  let tEnd = $state(100);

  const eqE = String.raw`\frac{dE}{dt}=\mu_E\,\frac{a_E\,B}{K_E+B}\,E-\delta_E\,E`;
  const eqC = String.raw`\frac{dC}{dt}=\mu_C\,\frac{a_C\,B}{K_C+B}\,C-\theta\,C^2`;
  const eqB = String.raw`\frac{dB}{dt}=r_{\text{prod}}\,E - r_{\text{cons,E}}\!\left(\mu_E\,\frac{a_E\,B}{K_E+a_E\,B}\,E\right) - r_{\text{cons,C}}\!\left(\mu_C\,\frac{a_C\,B}{K_C+a_C\,B}\,C\right)`;

  const variables = [
    {
      name: "E. coli",
      init: 5.0,
      min: "0.0",
      max: "1000.0",
      step: "1",
    },
    {
      name: "C. glutamicum",
      init: 5.0,
      min: "0.0",
      max: "1000.0",
      step: "1",
    },
    {
      name: "Enterobactin (B₀)",
      init: 1.0,
      min: "0.0",
      max: "1000.0",
      step: "0.5",
    },
  ];

  const pars = [
    {
      name: "E. coli growth rate (μ_E)",
      init: 0.4,
      min: "0.0",
      max: "2.0",
      step: "0.01",
    },
    {
      name: "E. coli affinity (a_E)",
      init: 6.0,
      min: "0.0",
      max: "10.0",
      step: "0.1",
    },
    {
      name: "C. glut growth rate (μ_C)",
      init: 0.3,
      min: "0.0",
      max: "2.0",
      step: "0.01",
    },
    {
      name: "K_E (half-sat E)",
      init: 0.5,
      min: "0.00000001",
      max: "1.0",
      step: "0.000001",
    },
    {
      name: "K_C (half-sat C)",
      init: 0.5,
      min: "0.00000001",
      max: "1.0",
      step: "0.000001",
    },
    {
      name: "C density loss (θ)",
      init: 0.001,
      min: "0.0",
      max: "1.0",
      step: "0.0001",
    },
    {
      name: "B production by E (r_prod)",
      init: 0.2,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
    },
    {
      name: "B consumption weight E (r_cons,E)",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
    },
    {
      name: "B consumption weight C (r_cons,C)",
      init: 1.0,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
    },
  ];
</script>

<h1>Dynamic-Entrobactin</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqE} display />
  <Math tex={eqC} display />
  <Math tex={eqB} display />
</section>

<h3>Initial conditions & settings</h3>

<Simulator modelJs={modelJs.toString()} {modelPy} {pars} {tEnd} {variables}
></Simulator>
