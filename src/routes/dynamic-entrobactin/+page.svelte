<script lang="ts">
  import type { Analyses } from "$lib";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";

  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 3,
      tEnd: 20,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      method: "LSODA",
      nTimePoints: 100,
      lineDisplay: "first",
    },
    // {
    //   type: "parameterScan" as const,
    //   id: 1,
    //   idx: 1,
    //   title: "Innoculation ratio scan",
    //   span: 3,
    //   parameter: "innoculationRatio",
    //   min: 0.1,
    //   max: 0.9,
    //   steps: 5,
    //   tEnd: 100,
    //   tolerance: 1e-4,
    //   xMin: undefined,
    //   xMax: undefined,
    //   yMin: undefined,
    //   yMax: undefined,
    //   timeoutInSeconds: 120,
    //   method: "LSODA",
    //   lineDisplay: "current" as const,
    // },
  ]);
</script>

<AnalysesDashboard
  name={"Dynamic Entrobaction"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={true}
>
  <h1>Dynamic Entrobaction model</h1>
</AnalysesDashboard>
