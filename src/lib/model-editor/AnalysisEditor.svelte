<script lang="ts">
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../PopoverSaveButton.svelte";

  type Analysis = {
    tEnd: number;
    yMax: number | undefined;
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
  let yMax: number = $derived(parent.yMax || 10);
  let yMaxAuto: boolean = $derived(untrack(() => yMax) ? false : true);
</script>

<RowApart>
  <h2>Edit analysis</h2>
  <PopoverSaveButton
    onclick={() => onSave({ tEnd, yMax: yMaxAuto ? undefined : yMax })}
    {popovertarget}
  />
</RowApart>

<div>
  <label for="final-time">Simulate until:</label>
  <input id="final-time" type="number" bind:value={tEnd} />
</div>
<h3>Plot options</h3>
<div>
  <label for="ymax-val">yMax:</label>
  {#if !yMaxAuto}
    <input id="ymax-val" type="number" bind:value={yMax} />
  {/if}
  <label for="ymax-auto">Auto?</label>
  <input id="ymax-auto" type="checkbox" bind:checked={yMaxAuto} />
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: 100%;
  }

  input {
    border: var(--border);
    border-radius: var(--border-radius);
    padding: 0 0.5rem;
  }
</style>
