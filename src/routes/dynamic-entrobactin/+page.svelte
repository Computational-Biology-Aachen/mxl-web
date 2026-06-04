<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import scheme from "$lib/assets/mibinet-duo.png";
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
      tEnd: 20,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      nTimePoints: 100,
      lineDisplay: "first",
    },
    {
      type: "parameterScan" as const,
      id: 1,
      idx: 1,
      title: "Innoculation ratio scan",
      span: 3,
      parameter: "innoculationRatio",
      min: 0.1,
      max: 0.9,
      steps: 11,
      tEnd: 20,
      tolerance: 1e-4,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
      backend: backends.wasmRadau5,
      selectedKeys: ["x1", "x2"],
      lineDisplay: "current" as const,
    },
  ]);
</script>

<svelte:head>
  <title>Dynamic Entrobactin - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name={"Dynamic Entrobaction"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Dynamic Entrobaction model</h1>
    <div class="centered">
      <img
        src={scheme}
        alt="model-scheme"
      />
    </div>
  </AnalysesDashboard>
</Main>

<style>
  img {
    max-width: 90rem;
    max-height: 20rem;
  }

  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
