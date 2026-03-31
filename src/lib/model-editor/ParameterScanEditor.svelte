<script lang="ts">
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputNumberOptional from "$lib/inputs/InputNumberOptional.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import type { ModelBuilder } from "./modelBuilder";
  import type { ParameterScanAnalysis } from "$lib";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";

  let {
    parent,
    model,
    onSave,
    popovertarget,
  }: {
    parent: ParameterScanAnalysis;
    model: ModelBuilder;
    onSave: (analysis: ParameterScanAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $derived(parent.title);
  let parameter = $derived(parent.parameter);
  let min = $derived(parent.min);
  let max = $derived(parent.max);
  let steps = $derived(parent.steps);
  let timeoutInSeconds = $derived(parent.timeoutInSeconds);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);
  let yMax: number = $derived(parent.yMax || 10);

  let parameterKeys = $derived([...model.parameters.keys()]);
</script>

<RowApart>
  <h2>Edit parameter scan</h2>
  <PopoverSaveButton
    onclick={() =>
      onSave({
        ...parent,
        title,
        parameter,
        min,
        max,
        steps,
        yMax: yMaxAuto ? undefined : yMax,
        timeoutInSeconds,
      })}
    popovertarget={popovertarget}
  />
</RowApart>

<InputText
  id="scan-name"
  label="Name: "
  bind:value={title}
/>

<div class="field-row">
  <label for="scan-parameter">Parameter: </label>
  <select id="scan-parameter" bind:value={parameter}>
    {#each parameterKeys as key}
      <option value={key}>{model.parameters.get(key)?.displayName ?? key}</option>
    {/each}
  </select>
</div>

<InputNumber
  id="scan-min"
  label="Min: "
  bind:value={min}
/>
<InputNumber
  id="scan-max"
  label="Max: "
  bind:value={max}
/>
<InputNumber
  id="scan-steps"
  label="Steps: "
  bind:value={steps}
/>
<InputNumber
  id="scan-timeout"
  label="Simulation timeout in seconds: "
  bind:value={timeoutInSeconds}
/>

<h3>Plot options</h3>
<InputNumberOptional
  id="scan-yMax"
  valueLabel="yMax: "
  condLabel="Auto?"
  bind:value={yMax}
  bind:condition={yMaxAuto}
/>

<style>
  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
  }

  select {
    border: var(--border);
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  select:hover {
    border: var(--border-primary);
  }
</style>
