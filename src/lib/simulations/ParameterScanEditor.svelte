<script lang="ts">
  import type { ParameterScanAnalysis } from "$lib";
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputNumberOptional from "$lib/inputs/InputNumberOptional.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";

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
  let tEnd = $derived(parent.tEnd);
  let min = $derived(parent.min);
  let max = $derived(parent.max);
  let steps = $derived(parent.steps);
  let timeoutInSeconds = $derived(parent.timeoutInSeconds);
  let tolerance = $derived(parent.tolerance);

  let xMin: number = $derived(parent.xMin || 0);
  let xMax: number = $derived(parent.xMax || 10);
  let yMin: number = $derived(parent.yMin || 0);
  let yMax: number = $derived(parent.yMax || 10);
  let xMinAuto: boolean = $derived(untrack(() => parent.xMin) ? false : true);
  let xMaxAuto: boolean = $derived(untrack(() => parent.xMax) ? false : true);
  let yMinAuto: boolean = $derived(untrack(() => parent.yMin) ? false : true);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);
  let showDerived = $state(untrack(() => parent.showDerived ?? false));

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
        tolerance,
        tEnd,
        xMin: yMaxAuto ? undefined : xMin,
        xMax: yMaxAuto ? undefined : xMax,
        yMin: yMaxAuto ? undefined : yMin,
        yMax: yMaxAuto ? undefined : yMax,
        timeoutInSeconds,
        showDerived,
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
  <select
    id="scan-parameter"
    bind:value={parameter}
  >
    {#each parameterKeys as key}
      <option value={key}
        >{model.parameters.get(key)?.displayName ?? key}</option
      >
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
  id="final-time"
  label="Simulate until: "
  bind:value={tEnd}
/>
<InputNumber
  id="scan-timeout"
  label="Simulation timeout in seconds: "
  bind:value={timeoutInSeconds}
/>
<InputNumber
  id="scan-tolerance"
  label="Steady-state tolerance (L2): "
  bind:value={tolerance}
/>

<h3>Plot options</h3>
<InputNumberOptional
  id="yMin"
  valueLabel="yMin: "
  condLabel="Auto?"
  bind:value={yMin}
  bind:condition={yMinAuto}
/>
<InputNumberOptional
  id="yMax"
  valueLabel="yMax: "
  condLabel="Auto?"
  bind:value={yMax}
  bind:condition={yMaxAuto}
/>
<InputNumberOptional
  id="xMax"
  valueLabel="xMax: "
  condLabel="Auto?"
  bind:value={xMin}
  bind:condition={xMinAuto}
/>
<InputNumberOptional
  id="xMax"
  valueLabel="xMax: "
  condLabel="Auto?"
  bind:value={xMax}
  bind:condition={xMaxAuto}
/>
<InputCheckbox
  id="showDerived"
  label="Show assignments & reactions"
  bind:checked={showDerived}
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
