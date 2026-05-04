<script lang="ts">
  import type { Analyses } from "$lib";
  import scheme from "$lib/assets/ebeling2026-scheme.png";
  import AnalysesDashboard from "$lib/model-editor/AnalysesDashboard.svelte";
  import type { PamGroup } from "$lib/simulations/protocol";
  import { initModel } from "./model";

  const defaultPamProtocol: PamGroup[] = [
    {
      steps: [{ pfd: 5000, duration: 0.72 }],
      repetitions: 1,
    },
    {
      steps: [
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
      ],
      repetitions: 8,
    },
    {
      steps: [
        { pfd: 2000, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 2000, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
      ],
      repetitions: 4,
    },
    {
      steps: [
        { pfd: 0, duration: 29.28 },
        { pfd: 5000, duration: 0.72 },
      ],
      repetitions: 10,
    },
  ];

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Simulation",
      col: 1,
      span: 6,
      tEnd: 0.1,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 60,
      method: "Radau",
      nTimePoints: 100,
      lineDisplay: "last",
    },
    // {
    //   type: "pam" as const,
    //   id: 0,
    //   idx: 0,
    //   title: "PAM Fluorescence - NPQ results",
    //   col: 4,
    //   span: 3,
    //   yMax: undefined,
    //   timeoutInSeconds: 500,
    //   method: "Radau",
    //   pamProtocol: defaultPamProtocol,
    //   showDerived: true,
    //   selectedKeys: ["NPQ"],
    //   normalizedKeys: ["NPQ"],
    //   nTimePoints: 100,
    //   lineDisplay: "first",
    // },
    // {
    //   type: "pam" as const,
    //   id: 1,
    //   idx: 1,
    //   title: "qL",
    //   col: 4,
    //   span: 3,
    //   yMax: undefined,
    //   timeoutInSeconds: 500,
    //   method: "Radau",
    //   pamProtocol: defaultPamProtocol,
    //   showDerived: true,
    //   selectedKeys: ["qL"],
    //   normalizedKeys: ["qL"],
    //   nTimePoints: 100,
    //   lineDisplay: "first",
    // },
  ]);
</script>

<AnalysesDashboard
  name={"KEA3 - tomato"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={false}
>
  <h1>Tomato KEA3 model</h1>
  <div class="centered">
    <img
      src={scheme}
      alt="model-scheme"
    />
  </div>
</AnalysesDashboard>

<style>
  img {
    width: 100%;
    max-width: 90rem;
  }

  .centered {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
</style>
