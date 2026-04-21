<script lang="ts">
  import type { Analyses } from "$lib";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
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
      method: "Radau",
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<AnalysesDashboard
  name={"Model"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={false}
>
  <h1>Yokota 1985 photorespiration model</h1>
</AnalysesDashboard>
