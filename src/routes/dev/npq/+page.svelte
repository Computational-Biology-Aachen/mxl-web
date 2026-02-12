<script lang="ts">
  import { ModelBuilder } from "$lib/model-editor/model";
  import Simulator from "$lib/Simulator.svelte";

  const pars = [
    { name: "PPFD", init: 100.0, min: "50.0", max: "150", step: "10" },
  ];
  const variables = [
    {
      name: "ATP",
      init: 1.6999999999999997,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "Plastoquinone (oxidised)",
      init: 4.706348349506148,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "Plastocyanine (oxidised)",
      init: 3.9414515288091567,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "Ferredoxin",
      init: 3.7761613271207324,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "protons_lumen",
      init: 7.737821100836988,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "Light-harvesting complex",
      init: 0.5105293511676007,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "PsbS (de-protonated)",
      init: 0.5000000001374878,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
    {
      name: "Violaxanthin",
      init: 0.09090909090907397,
      min: "0",
      max: "1",
      step: "0.1",
      fixed: true,
    },
  ];
  const tEnd = 10.0;
  let yLim = $state(8);

  let model = new ModelBuilder();
</script>

<Simulator {model} {tEnd} {yLim} />
