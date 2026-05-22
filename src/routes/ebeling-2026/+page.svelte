<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import scheme from "$lib/assets/ebeling2026-scheme.png";
  import type { PamGroup } from "$lib/protocol";
  import { SectionMain } from "@computational-biology-aachen/design";
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
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
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
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["Fluo"],
      normalizedKeys: ["Fluo"],
      nTimePoints: 100,
      lineDisplay: "first",
    },
  ]);
</script>

<SectionMain>
  <AnalysesDashboard
    name={"Ebeling 2026"}
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
    <p>
      The adjustable parameters are set to their default value in the model. To
      simulate knockouts, adjust the slider of the given kinetic constants to 0.
      To up regulate shift the slider to the right and for down regulation to
      the left.
    </p>
    <p>
      Default light intensity settings are: 900 ppfd as actinic light and 90
      ppfd as relaxation light. In the PAM protocol the saturating pulse
      intensity is set to 5000 ppfd. To adjust light intensities, click the menu
      tab (three horizontal lines) and you can freely adjust the protocols light
      intensity and durations of each light phase.
    </p>
  </AnalysesDashboard>
</SectionMain>

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
