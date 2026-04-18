<script lang="ts">
  import AnalysisEditor from "$lib/simulations/TimeCourseEditor.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";

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
    method: "RK45",
  };
</script>

<AnalysisEditor
  parent={analysis}
  model={model}
  onSave={() => null}
  popovertarget="/"
/>
