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
  <title>Davis 2017 - mxlweb</title>
</svelte:head>

<Main
  pad="tight"
  width="full"
>
  <AnalysesDashboard
    name={"Davis 2017"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Davis 2017 model</h1>
    <p>
      The Davis 2017 model is a mechanistic description of the photosynthetic
      electron transport chain and the thylakoid proton motive force (pmf),
      resolving the pmf into its two thermodynamically distinct components: the
      transmembrane electric field (Δψ) and the lumen pH gradient. Its central
      result is that the Δψ component, rather than lumen acidification, drives
      elevated PSII charge recombination, which produces singlet oxygen and
      subsequent PSII photodamage.
    </p>
    <p>
      Electron transport runs from PSII through the plastoquinone pool,
      cytochrome b6f, plastocyanin, PSI and ferredoxin to NADPH, while
      counter-ion fluxes (KEA3 K⁺/H⁺ antiport, VKC K⁺ channel) partition the pmf
      between Δψ and the pH gradient, and non-photochemical quenching is
      captured through PsbS protonation and the xanthophyll cycle.
    </p>
  </AnalysesDashboard>
</Main>
