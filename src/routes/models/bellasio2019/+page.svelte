<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Simulation",
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
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Bellasio 2019 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Bellasio 2019"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Bellasio 2019 model</h1>
    <p>
      The Bellasio 2019 model is a generalised model of leaf-level C3
      photosynthesis that couples simplified light and dark reactions with a
      stomatal-behaviour submodule. Building on the Farquhar–von Caemmerer–Berry
      framework and the light reactions of Yin et al. (2004), it derives the
      potential rates of ATP and NADPH production from light intensity and links
      them to carbon assimilation and stomatal conductance.
    </p>
    <p>
      Designed to stay deliberately simple, it reproduces the classic
      steady-state assimilation responses to intercellular CO₂ and light while
      remaining valid under dynamic conditions, which makes it a convenient
      starting block for larger models of plant physiology.
    </p>
  </AnalysesDashboard>
</Main>
