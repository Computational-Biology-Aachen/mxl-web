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
      span: 6,
      tEnd: 5,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      method: "Radau",
      nTimePoints: 100,
    },
  ]);
</script>

<AnalysesDashboard
  name={"Population Dynamics"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={true}
>
  <h1>Population dynamics</h1>
</AnalysesDashboard>
