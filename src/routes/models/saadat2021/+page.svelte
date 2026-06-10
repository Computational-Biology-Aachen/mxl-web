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
      nTimePoints: 100,
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
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["GAP", "atp"],
      normalizedKeys: ["GAP", "atp"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Saadat 2021 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Saadat 2021"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Saadat 2021 model</h1>
    <p>
      The Saadat 2021 model describes linear electron flow through photosystem I
      (PSI) in the chloroplast. Electrons pass from plastocyanin through P700
      and the iron–sulfur cluster FA to ferredoxin and on to NADPH, driven by
      light (PPFD) and governed by Nernst equilibrium potentials.
    </p>
    <p>
      The model also includes the Mehler reaction, in which O₂ is reduced at
      PSI, providing a focused, redox-resolved view of the PSI segment of the
      photosynthetic electron transport chain.
    </p>
  </AnalysesDashboard>
</Main>
