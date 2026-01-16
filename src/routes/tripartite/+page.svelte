<script lang="ts">
  import Simulator from "$lib/Simulator.svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  // Simulation state
  let tEnd = $state(100);

  const variables = [
    {
      name: "Public",
      init: 1.0,
      min: "0.0",
      max: "10000.0",
      step: "1",
    },
    {
      name: "Cheaters",
      init: 1.0,
      min: "0.0",
      max: "10000.0",
      step: "1",
    },
    {
      name: "Private",
      init: 1.0,
      min: "0.0",
      max: "10000.0",
      step: "1",
    },
  ];
  const pars = [
    {
      name: "r_p (growth rate)",
      init: 0.4,
      min: "0.0",
      max: "1.0",
      step: "0.00001",
    },
    {
      name: "η (density)",
      init: 0.0001,
      min: "0.0",
      max: "1.0",
      step: "0.00001",
    },
    {
      name: "ν (density)",
      init: 0.00001,
      min: "0.0",
      max: "1.0",
      step: "0.00001",
    },
    {
      name: "r_m (growth rate)",
      init: 0.2,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
    },
    {
      name: "γ (density)",
      init: 0.0001,
      min: "0.0",
      max: "5.0",
      step: "0.0001",
    },
    {
      name: "α (P→C cooperation)",
      init: 0.0002,
      min: "0.0",
      max: "1.0",
      step: "0.0001",
    },
    {
      name: "β (P↔M competition)",
      init: 0.0001,
      min: "0.0",
      max: "1.0",
      step: "0.0001",
    },
  ];
</script>

<h1>Tripartite dynamics dynamics</h1>

<Simulator modelJs={modelJs.toString()} {modelPy} {pars} {tEnd} {variables} />
