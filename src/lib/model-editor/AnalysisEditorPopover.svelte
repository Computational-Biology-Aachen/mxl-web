<script lang="ts">
  import Icon from "$lib/Icon.svelte";

  type Analysis = {
    tEnd: number;
  };

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: Analysis;
    onSave: (options: Analysis) => void;
    popovertarget: string;
  } = $props();

  let tEnd = $derived(parent.tEnd);
</script>

<section class="page">
  <label for="min-slider">tEnd</label>
  <input id="min-slider" type="number" bind:value={tEnd} />

  <button
    class="save"
    onclick={() => onSave({ tEnd })}
    popovertargetaction="hide"
    {popovertarget}
  >
    <Icon fontSize="lg">play_arrow</Icon>
    Save
  </button>
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
</style>
