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
      span: 3,
      col: 4,
      yMax: undefined,
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["Fluo"],
      normalizedKeys: ["Fluo"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Matuszyńska 2016 NPQ - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name={"Matuszyńska 2016"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Matuszyńska 2016 NPQ model</h1>
    <p>
      The Matuszyńska 2016 NPQ model is an ODE model of photoprotection in plant
      photosystem II. It tracks the PSII open and closed states, the
      plastoquinone (PQ/PQH₂) redox pool, lumenal proton buffering, ATP
      synthesis, PsbS protonation and xanthophyll de-epoxidation (zeaxanthin
      formation) — the molecular machinery underlying non-photochemical
      quenching.
    </p>
    <p>
      The model can be run under PAM fluorescence protocols, reproducing the
      Fm/Fm′ quenching observed experimentally and linking the fast
      photoprotective response to the redox state of the electron transport
      chain.
    </p>
  </AnalysesDashboard>
</Main>
