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
      tEnd: 300,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      selectedKeys: ["PQ_ox", "PC_ox", "Fd_ox", "NADPH", "ATP", "OCP"],
      nTimePoints: 500,
      lineDisplay: "last",
    },
    {
      type: "simulation" as const,
      id: 1,
      idx: 1,
      title: "Fluorescence and lumen pH",
      col: 4,
      span: 3,
      tEnd: 300,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      showDerived: true,
      selectedKeys: ["Fluo", "pHlumen"],
      nTimePoints: 500,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Pfennig 2024 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Pfennig 2024"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Pfennig 2024 model</h1>
    <p>
      The Pfennig 2024 model is a wavelength-dependent kinetic model of
      photosynthesis in the cyanobacterium <em>Synechocystis</em> sp. PCC 6803. Instead
      of a single photon flux density, it resolves the light spectrum: the light absorbed
      by photosystem I, photosystem II and the phycobilisomes is integrated over wavelength
      from the spectrum of the light source and the absorption of each pigment. This
      makes it possible to ask how the colour of the light, not just its intensity,
      shapes electron transport, carbon fixation and photoprotection.
    </p>
    <p>
      Around this light harvesting, the model covers the photosynthetic and
      respiratory electron transport chains that share the thylakoid membrane
      (PSII, PSI, plastoquinone, cytochrome b6f, plastocyanin, ferredoxin, FNR,
      NDH-1/2, succinate dehydrogenase, terminal oxidases and flavodiiron
      proteins), ATP synthase, lumped Calvin–Benson–Bassham and photorespiratory
      reactions, a carbon-concentrating mechanism, and quenching by the orange
      carotenoid protein (OCP). The default actinic light is a warm white LED.
    </p>
  </AnalysesDashboard>
</Main>
