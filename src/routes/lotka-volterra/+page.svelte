<script lang="ts">
  import Simulator from "$lib/Simulator.svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  // Simulation state
  const tEnd = 100;

  const pars = [
    { name: "Alpha", init: 0.1, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Beta", init: 0.02, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Gamma", init: 0.4, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Delta ", init: 0.02, min: "0.01", max: "1.0", step: "0.001" },
  ];

  const variables = [
    { name: "Prey", init: 10.0, min: "1.0", max: "10.0", step: "1.0" },
    { name: "Predator", init: 10.0, min: "1.0", max: "10.0", step: "1.0" },
  ];
</script>

<h1>Lotka-Volterra</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<Simulator modelJs={modelJs.toString()} {modelPy} {pars} {tEnd} {variables}
></Simulator>
