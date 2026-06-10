<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import type { PamGroup } from "$lib/protocol";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  const defaultPamProtocol: PamGroup[] = [
    {
      steps: [
        { pfd: 100, duration: 9.2 },
        { pfd: 5000, duration: 0.8 },
      ],
      repetitions: 3,
    },
    {
      steps: [
        { pfd: 500, duration: 9.2 },
        { pfd: 5000, duration: 0.8 },
      ],
      repetitions: 3,
    },
    {
      steps: [
        { pfd: 100, duration: 9.2 },
        { pfd: 5000, duration: 0.8 },
      ],
      repetitions: 3,
    },
  ];

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
      showDerived: false,
      nTimePoints: 500,
      lineDisplay: "last",
    },
    {
      type: "pam" as const,
      id: 1,
      idx: 1,
      title: "PAM Fluorescence",
      col: 4,
      span: 3,
      yMax: undefined,
      timeoutInSeconds: 120,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["pq_ox", "Fluo"],
      normalizedKeys: ["pq_ox", "Fluo"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Matuszyńska 2016 PhD - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Matuszyńska 2016"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Matuszyńska 2016 PhD model</h1>
    <p>
      The Matuszyńska 2016 PhD model extends the NPQ model into a fuller
      chloroplast description by adding photosystem I electron transport (P700,
      ferredoxin, NADPH) and explicit lumenal pH dynamics. A carotenoid pool and
      LHC antenna switching couple photoprotection to the redox state of both
      photosystems.
    </p>
    <p>
      Like its predecessor it supports PAM fluorescence protocols, thereby
      linking the fast photoprotective response to the broader
      electron-transport state of the thylakoid.
    </p>
  </AnalysesDashboard>
</Main>
