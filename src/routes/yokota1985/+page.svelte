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
      title: "Simulation",
      col: 1,
      span: 6,
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

<Main pad="tight">
  <AnalysesDashboard
    name={"Yokota 1985"}
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Yokota 1985 photorespiration model</h1>
  </AnalysesDashboard>
</Main>
