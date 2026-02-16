<script lang="ts">
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import { type Parameter, type Variable } from "./model";

  let {
    target,
    onSave,
    popovertarget,
  }: {
    target: Variable | Parameter;
    onSave: (fn: Variable | Parameter) => void;
    popovertarget: string;
  } = $props();

  let enabled: boolean = $derived(target.slider ? true : false);
  let minVal: string = $derived(target.slider?.min || "0.0");
  let maxVal: string = $derived(target.slider?.max || "1.0");
  let stepVal: string = $derived(target.slider?.step || "0.1");
  let texName: string | undefined = $derived(target.slider?.texName);
</script>

<RowApart>
  <h2>Edit Options</h2>
  <PopoverSaveButton
    {popovertarget}
    onclick={() =>
      onSave(
        enabled
          ? {
              value: target.value,
              slider: { min: minVal, max: maxVal, step: stepVal },
            }
          : { value: target.value },
      )}
  />
</RowApart>

<label for="tex-name">LaTeX name</label>
<input id="tex-name" type="text" bind:value={texName} />

<div class="row">
  <label for="slider-enabled">Display slider?</label>
  <input id="slider-enabled" type="checkbox" bind:checked={enabled} />
</div>
{#if enabled}
  <label for="min-slider">Min</label>
  <input id="min-slider" type="number" bind:value={minVal} />
  <label for="max-slider">Max</label>
  <input id="max-slider" type="number" bind:value={maxVal} />
  <label for="step-slider">Step</label>
  <input id="step-slider" type="number" bind:value={stepVal} />
{/if}

<style>
  .row {
    display: flex;
    flex-direction: row;
    gap: 0 0.5rem;
  }
</style>
