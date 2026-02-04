<script lang="ts">
  import Math from "$lib/Math.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";
  const pars = [
    {
      name: "E. coli growth rate",
      init: 0.4,
      min: "0.0",
      max: "1.0",
      step: "0.05",
    },
    {
      name: "C. glut growth rate",
      init: 0.3,
      min: "0.0",
      max: "1.0",
      step: "0.05",
    },
    {
      name: "E. coli affinity",
      init: 6.0,
      min: "0.0",
      max: "10.0",
      step: "0.5",
    },
    {
      name: "C. glut affinity ",
      init: 4.0,
      min: "0.0",
      max: "10.0",
      step: "0.5",
    },
    { name: "theta ", init: 0.001, min: "0.0", max: "1.0", step: "0.05" },
  ];

  const variables = [
    { name: "E. coli", init: 5.0, min: "0.0", max: "1000.0", step: "1.0" },
    {
      name: "C. glutamicum",
      init: 5.0,
      min: "0.0",
      max: "1000.0",
      step: "1.0",
    },
  ];

  const tEnd = 100;
  const eqE = String.raw`\frac{dE}{dt} = E\,a_e\,\mu_e`;
  const eqC = String.raw`\frac{dC}{dt} = C\,a_c\,\mu_c - \theta\,C^2`;
</script>

<h1>Population dynamics</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqE} display />
  <br />
  <Math tex={eqC} display />
</section>

<Simulator modelJs={modelJs.toString()} {modelPy} {pars} {tEnd} {variables} />
