<script>
  import AnalysisEditor from "$lib/model-editor/AnalysisEditor.svelte";

  let analysis = {
    tEnd: 1.0,
    yMax: 20.0,
  };
</script>

<AnalysisEditor parent={analysis} onSave={() => null} popovertarget="/" />
