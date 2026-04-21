<script lang="ts">
  import type { Analyses } from "$lib";
  import scheme from "$lib/assets/lotka-volterra-scheme.png";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
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
      method: "LSODA",
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
      method: "LSODA",
      showDerived: true,
      nTimePoints: 500,
      lineDisplay: "last",
    },
  ]);
</script>

<AnalysesDashboard
  name={"Lotka-Volterra"}
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

<style>
  img {
    max-width: 90rem;
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
