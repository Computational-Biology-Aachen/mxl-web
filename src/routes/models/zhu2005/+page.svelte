<script lang="ts">
  import { backends, type Analyses } from "#lib";
  import AnalysesDashboard from "#lib/AnalysesDashboard.svelte";
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
      tEnd: 1.0,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 30,
      backend: backends.wasmRadau5,
      nTimePoints: 500,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Zhu 2005 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Zhu 2005"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Zhu 2005 model</h1>
  </AnalysesDashboard>
</Main>
