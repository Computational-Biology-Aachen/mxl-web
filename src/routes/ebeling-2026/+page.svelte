<script lang="ts">
  import type { Analyses } from "$lib";
  import scheme from "$lib/assets/ebeling2026-scheme.png";
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
  const ecsProtocol: PamGroup[] = [
    {
      steps: [
        { pfd: 900, duration: 60 },
        { pfd: 90, duration: 20 },
        { pfd: 0, duration: 30 },
      ],
      repetitions: 3,
    },
  ];
  let analyses: Analyses = $state([
    {
      type: "pam" as const,
      id: 0,
      idx: 0,
      title: "ECS",
      col: 1,
      span: 3,
      yMax: undefined,
      timeoutInSeconds: 120,
      method: "Radau",
      pamProtocol: ecsProtocol,
      showDerived: true,
      selectedKeys: ["delta_psi", "deltapH_in_volts", "pmf_in_V"],
      nTimePoints: 100,
      lineDisplay: "first",
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
      lineDisplay: "first",
    },
  ]);
</script>

<AnalysesDashboard
  name={"Model"}
  initModel={initModel}
  bind:analyses={analyses}
  equationsOpen={false}
>
  <h1>Ebeling 2026 model</h1>
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
