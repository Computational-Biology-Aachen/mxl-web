<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";
  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 100,
      lineDisplay: "first",
    },
  ]);
</script>

<svelte:head>
  <title>SIR - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name={"Compartmental models"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>SIR Compartmental models</h1>
    <p>
      The SIR model is the classic compartmental model of infectious-disease
      spread, dividing a population into Susceptible, Infected and Recovered
      groups. Susceptible individuals become infected at a rate set by the
      transmission coefficient β through contact with the infected, and infected
      individuals recover at rate γ.
    </p>
    <p>
      Despite its simplicity, the model captures the characteristic epidemic
      curve and the threshold behaviour governed by the basic reproduction
      number.
    </p>
  </AnalysesDashboard>
</Main>
