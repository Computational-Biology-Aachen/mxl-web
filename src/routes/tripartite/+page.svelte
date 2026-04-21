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
    {
      type: "parameterScan" as const,
      id: 1,
      idx: 1,
      title: "r_p scan",
      span: 3,
      parameter: "r_p",
      min: 0.4,
      max: 0.8,
      steps: 5,
      tEnd: 10_000,
      tolerance: 1e-4,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
      method: "LSODA",
    },
  ]);
</script>

<AnalysesDashboard
  name={"Tripartite dynamics"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={true}
>
  <h1>Tripartite population model</h1>
  <p>
    Dynamic model of a tripartite population of <b>P</b>ublic consumers,
    <b>C</b>heaters and private <b>m</b>etabolisers.
  </p>
</AnalysesDashboard>
