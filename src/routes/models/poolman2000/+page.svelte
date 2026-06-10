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
      title: "Simulation",
      col: 1,
      span: 6,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Poolman 2000 - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Poolman 2000"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Poolman 2000 CBB model</h1>
    <p>
      The Poolman 2000 model is a kinetic model of the Calvin–Benson cycle, the
      carbon-fixation pathway of C3 plant chloroplasts. Rubisco carboxylase and
      oxygenase compete for ribulose-1,5-bisphosphate, while downstream enzymes
      such as FBPase and SBPase regenerate it, with the whole cycle driven by
      dissolved CO₂, NADPH and ATP.
    </p>
    <p>
      Enzyme activities scale with their maximal turnover and are subject to
      product inhibition, letting the model reproduce the steady-state behaviour
      and regulation of carbon assimilation.
    </p>
  </AnalysesDashboard>
</Main>
