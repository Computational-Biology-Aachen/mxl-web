<script lang="ts">
  import { backends, type Analyses } from "$lib";
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

<AnalysesDashboard
  name={"Compartmental models"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={true}
>
  <h1>SIR Compartmental models</h1>
</AnalysesDashboard>
