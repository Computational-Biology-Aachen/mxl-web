<script>
  import Icon from "$lib/Icon.svelte";
  import AnalysisEditor from "$lib/model-editor/AnalysisEditor.svelte";

  let analysis = {
    tEnd: 1.0,
    yMax: 20.0,
  };
</script>

<button popovertarget="analysis-editor"><Icon>edit</Icon></button>

<AnalysisEditor parent={analysis} onSave={() => null} popovertarget="/" />
