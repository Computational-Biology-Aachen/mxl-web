<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import scheme from "$lib/assets/ebeling2026-scheme.png";
  import type { PamGroup } from "$lib/protocol";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  const defaultPamProtocol: PamGroup[] = [
    {
      steps: [{ pfd: 10, duration: 30 }],
      repetitions: 1,
    },
    {
      steps: [
        { pfd: 5000, duration: 0.72 },
        { pfd: 200, duration: 29.28 },
      ],
      repetitions: 20,
    },
  ];

  // const defaultPamProtocol: PamGroup[] = [
  //   {
  //     steps: [{ pfd: 5000, duration: 0.72 }],
  //     repetitions: 1,
  //   },
  //   {
  //     steps: [
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //     ],
  //     repetitions: 8,
  //   },
  //   {
  //     steps: [
  //       { pfd: 2000, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 2000, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //       { pfd: 200, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //     ],
  //     repetitions: 4,
  //   },
  //   {
  //     steps: [
  //       { pfd: 0, duration: 29.28 },
  //       { pfd: 5000, duration: 0.72 },
  //     ],
  //     repetitions: 10,
  //   },
  // ];

  let analyses: Analyses = $state([
    {
      type: "pam" as const,
      id: 0,
      idx: 0,
      title: "PAM Fluorescence - NPQ results",
      span: 3,
      yMax: undefined,
      timeoutInSeconds: 500,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      fluoKey: "Fluo",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["Fluo", "NPQ"],
      normalizedKeys: ["Fluo", "NPQ"],
      nTimePoints: 100,
      lineDisplay: "first",
    },
    {
      type: "pam" as const,
      id: 1,
      idx: 1,
      title: "qL",
      span: 3,
      yMax: undefined,
      timeoutInSeconds: 500,
      backend: backends.wasmRadau5,
      ppfdKey: "PPFD",
      pamProtocol: defaultPamProtocol,
      showDerived: true,
      selectedKeys: ["qL"],
      normalizedKeys: ["qL"],
      nTimePoints: 100,
      lineDisplay: "first",
    },
    // {
    //   type: "simulation" as const,
    //   id: 0,
    //   idx: 0,
    //   title: "Simulation - Normalised concentrations",
    //   span: 3,
    //   tEnd: 10.0,
    //   xMin: undefined,
    //   xMax: undefined,
    //   yMin: undefined,
    //   yMax: undefined,
    //   timeoutInSeconds: 60,
    //   backend: backends.wasmRadau5,
    //   nTimePoints: 100,
    //   showDerived: false,
    //   normalizedKeys: [
    //     "B0",
    //     "B1",
    //     "B2",
    //     "PQH2",
    //     "ATP",
    //     "H_lumen",
    //     "delta_psi",
    //     "Vx",
    //     "PsbS",
    //     "ATPactivity",
    //     "K_lumen",
    //     "K_stroma",
    //   ],
    //   lineDisplay: "last",
    // },
    // {
    //   type: "simulation" as const,
    //   id: 1,
    //   idx: 1,
    //   title: "Simulation - Derived values",
    //   span: 3,
    //   tEnd: 10.0,
    //   xMin: undefined,
    //   xMax: undefined,
    //   yMin: undefined,
    //   yMax: undefined,
    //   timeoutInSeconds: 60,
    //   backend: backends.wasmRadau5,
    //   nTimePoints: 100,
    //   showDerived: true,
    //   selectedKeys: ["Keqcytb6f"],
    //   lineDisplay: "last",
    // },
  ]);
</script>

<Main pad="tight">
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
</Main>

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
