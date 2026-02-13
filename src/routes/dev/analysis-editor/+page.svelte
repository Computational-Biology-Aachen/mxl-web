<script>
  import Icon from "$lib/Icon.svelte";
  import AnalysisEditorPopover from "$lib/model-editor/AnalysisEditorPopover.svelte";

  let parent = "";
</script>

<button popovertarget="analysis-editor"><Icon>edit</Icon></button>

<AnalysisEditorPopover onSave={() => null} />
