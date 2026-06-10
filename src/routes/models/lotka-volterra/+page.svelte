<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import scheme from "$lib/assets/lotka-volterra-scheme.png";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Short Simulation",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      showDerived: false,
      nTimePoints: 100,
      lineDisplay: "last",
    },
    {
      type: "simulation" as const,
      id: 1,
      idx: 1,
      title: "Extended Simulation",
      col: 4,
      span: 3,
      tEnd: 200,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 20,
      backend: backends.wasmRadau5,
      showDerived: true,
      nTimePoints: 500,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Lotka-Volterra - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Lotka-Volterra"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Lotka Volterra model</h1>
    <p>
      The Lotka-Volterra equations, developed in the 1920s by Alfred Lotka and
      Vito Volterra representing the cyclic, phase-shifted population dynamics
      between a predator and its prey.
    </p>
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
    max-width: min(90rem, 100%);
    max-height: 25rem;
  }

  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
