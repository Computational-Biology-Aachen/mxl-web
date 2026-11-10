<script lang="ts">
  import { backends, type Analyses } from "#lib";
  import AnalysesDashboard from "#lib/AnalysesDashboard.svelte";
  import type { PamGroup } from "#lib/protocol.js";
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
      title: "Time course",
      col: 1,
      span: 3,
      tEnd: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 30,
      backend: backends.wasmRadau5,
      showDerived: true,
      selectedKeys: ["pH_lumen", "fluorescenceyield", "Zeaxanthin", "P700r"],
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
      timeoutInSeconds: 60,
      backend: backends.wasmRadau5,
      ppfdKey: "LightIntensity",
      fluoKey: "fluorescenceyield",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["fluorescenceyield"],
      normalizedKeys: ["fluorescenceyield"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<svelte:head>
  <title>Zaks 2012 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name="Zaks 2012"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Zaks 2012 model</h1>
  </AnalysesDashboard>
</Main>
