<script lang="ts">
  import type { SteadyStateAnalyses } from "#lib";
  import SteadyStateDashboard from "#lib/SteadyStateDashboard.svelte";
  import { SectionMain as Main } from "@computational-biology-aachen/design";
  import { initModel } from "./model";

  let analyses: SteadyStateAnalyses = $state([
    {
      type: "steadyState" as const,
      id: 0,
      idx: 0,
      title: "h_cyt vs q",
      span: 3,
      parameter: "q",
      min: 0,
      max: 1,
      steps: 100,
      xMin: undefined,
      xMax: undefined,
      yMin: undefined,
      yMax: undefined,
      selectedKeys: ["h_cyt"],
      lineDisplay: "current",
    },
  ]);
</script>

<svelte:head>
  <title>Gu 2023 - mxlweb</title>
</svelte:head>

<Main pad="tight">
  <SteadyStateDashboard
    name="Gu 2023"
    initModel={initModel}
    bind:analyses={analyses}
    equationsOpen={false}
  >
    <h1>Gu 2023 model</h1>
  </SteadyStateDashboard>
</Main>
