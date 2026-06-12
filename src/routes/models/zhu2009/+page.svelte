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
      span: 6,
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
  <title>Zhu 2009 - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Zhu 2009"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Zhu et al. (2009) Calvin Cycle model</h1>
    <p>
      The Zhu 2009 model is a deliberately simplified kinetic model of the
      Calvin-Benson-Bassham (CBB) cycle, the carbon-fixing dark reactions of
      photosynthesis. It tracks only five metabolites —
      ribulose-1,5-bisphosphate (RuBP), 3-phosphoglycerate (PGA),
      1,3-bisphosphoglycerate (DPGA), glyceraldehyde-3-phosphate (GAP), and
      ribulose-5-phosphate (Ru5P) — and lumps the many intermediate steps of the
      cycle into a handful of Michaelis-Menten reactions, with ATP supplied as a
      fixed external parameter rather than a dynamic variable. This reduction
      keeps the system small enough to be analysed mathematically while still
      capturing the essential autocatalytic structure of carbon fixation, where
      RuBP is both consumed by RuBisCO and regenerated downstream.
    </p>
  </AnalysesDashboard>
</Main>
