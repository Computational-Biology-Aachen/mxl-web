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
  ]);
</script>

<svelte:head>
  <title>Li 2021 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name={"Li 2021"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Li 2021 model</h1>
    <p>
      The Li 2021 model is a kinetic model of photosynthesis centred on ion
      fluxes across the thylakoid membrane and their effect on the proton motive
      force (pmf). Built upon the Davis 2017 model, it gives a detailed account
      of the pmf-generating reactions — water splitting at photosystem II and
      plastoquinone oxidation at cytochrome b6f — while representing other steps
      with minimal complexity.
    </p>
    <p>
      It adds two potassium and two chloride transport pathways to the thylakoid
      membrane and was validated against wild-type behaviour and several
      knockout mutants (VCCN1, CLCE, KEA3), making it a tool to dissect how ion
      fluxes regulate photosynthetic electron transport and photoprotection.
    </p>
  </AnalysesDashboard>
</Main>
