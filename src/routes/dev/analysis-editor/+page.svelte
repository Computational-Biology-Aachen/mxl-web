<svelte:head>
  <title>Analysis Editor - mxlweb</title>
</svelte:head>

<script lang="ts">
  import { ModelBuilder } from "@computational-biology-aachen/mxlweb-core";
  import AnalysisEditor from "$lib/TimeCourseEditor.svelte";
  import { backends } from "$lib/stores/backends";

  const model = new ModelBuilder();

  let analysis = {
    type: "simulation" as const,
    id: 0,
    idx: 0,
    title: "",
    span: 1,
    tEnd: 1.0,
    xMin: undefined,
    xMax: undefined,
    yMin: undefined,
    yMax: 20.0,
    timeoutInSeconds: 10,
    backend: backends.wasmRadau5,
    nTimePoints: 100,
    lineDisplay: "current" as const,
  };
</script>

<AnalysisEditor
  parent={analysis}
  model={model}
  onSave={() => null}
  popovertarget="/"
/>
