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
      tEnd: 100,
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
  <title>Morales 2018 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Morales 2018"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Morales 2018 model</h1>
  </AnalysesDashboard>
</Main>
