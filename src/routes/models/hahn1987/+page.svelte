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
      span: 3,
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
  <title>Hahn 1987 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Hahn 1987"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Hahn 1987 model</h1>
    <p>
      The Hahn 1987 model is a comprehensive description of C3 leaf carbon
      metabolism that combines the Calvin cycle with the glycolate and glycerate
      pathways of photorespiration, formulated as a large system of non-linear
      differential equations. It extends Hahn's earlier Calvin-cycle models by
      adding the competitive inhibition of ribulose-bisphosphate carboxylase by
      oxygen.
    </p>
    <p>
      The model settles to an effectively stable steady state and responds
      realistically to changes in external CO₂ and O₂: photosynthesis is
      inhibited by higher oxygen levels, while photorespiration is suppressed by
      higher carbon dioxide levels.
    </p>
  </AnalysesDashboard>
</Main>
