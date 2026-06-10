<script lang="ts">
  import { backends, type Analyses } from "$lib";
  import AnalysesDashboard from "$lib/AnalysesDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  let analyses: Analyses = $state([
    {
      type: "simulation" as const,
      id: 0,
      idx: 0,
      title: "Time course",
      col: 1,
      span: 6,
      tEnd: 5,
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
  <title>Population Dynamics - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <AnalysesDashboard
    name="Population Dynamics"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={true}
  >
    <h1>Population dynamics</h1>
    <p>
      This model describes the population dynamics of an <i>E. coli</i> /
      <i>C. glutamicum</i> co-culture as a two-species competition with
      Monod-type growth. Each species grows according to its substrate affinity
      and maximum growth rate, and <i>C. glutamicum</i> additionally carries a density-dependent
      death term.
    </p>
    <p>
      It is a simpler precursor to the dynamic enterobactin model, with no
      shared siderophore variable, and illustrates the baseline competition
      dynamics of the two organisms.
    </p>
  </AnalysesDashboard>
</Main>
