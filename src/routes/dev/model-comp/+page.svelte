<script lang="ts">
  import SimulatorComp from "$lib/SimulatorComp.svelte";

  import { modelPy1, modelPy2 } from "./modelPy";

  // Simulation state
  const tEnd = 100;

  const pars = [
    { name: "Alpha", init: 0.1, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Beta", init: 0.02, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Gamma", init: 0.4, min: "0.01", max: "1.0", step: "0.05" },
    { name: "Delta ", init: 0.02, min: "0.01", max: "1.0", step: "0.001" },
    { name: "K ", init: 50.0, min: "10.0", max: "100.0", step: "1" },
  ];

  const variables = [
    {
      name: "Prey",
      init: 10.0,
      min: "1.0",
      max: "10.0",
      step: "1.0",
      fixed: true,
    },
    {
      name: "Predator",
      init: 10.0,
      min: "1.0",
      max: "10.0",
      step: "1.0",
      fixed: true,
    },
  ];
</script>

<h1>Model comparison</h1>

<SimulatorComp
  modelPy1={modelPy1}
  modelPy2={modelPy2}
  pars={pars}
  tEnd={tEnd}
  variables={variables}
/>
