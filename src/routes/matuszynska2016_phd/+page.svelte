<script lang="ts">
  import type { Analyses } from "$lib";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import type { PamGroup } from "$lib/simulations/protocol";
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
      method: "Radau",
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
      method: "Radau",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["Fluo"],
      normalizedKeys: ["Fluo"],
      nTimePoints: 100,
      lineDisplay: "last",
    },
  ]);
</script>

<h1>Matuszyńska 2016 PhD model</h1>

<AnalysesDashboard
  name={"Model"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={false}
></AnalysesDashboard>
