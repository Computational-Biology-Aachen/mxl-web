<script lang="ts">
  import type { OutcomeHeatmapAnalysis } from "$lib";
  import {
    Button,
    InputNumber,
    InputText,
    Row,
  } from "@computational-biology-aachen/design";
  import type { ModelBuilderBase } from "@computational-biology-aachen/mxlweb-core";

  let {
    parent,
    model,
    onSave,
    popovertarget,
  }: {
    parent: OutcomeHeatmapAnalysis;
    model: ModelBuilderBase;
    onSave: (analysis: OutcomeHeatmapAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $derived(parent.title);
  let xParameter = $derived(parent.xParameter);
  let xMin = $derived(parent.xMin);
  let xMax = $derived(parent.xMax);
  let xSteps = $derived(parent.xSteps);
  let yParameter = $derived(parent.yParameter);
  let yMin = $derived(parent.yMin);
  let yMax = $derived(parent.yMax);
  let ySteps = $derived(parent.ySteps);
  let tEnd = $derived(parent.tEnd);

  // NN block weights/biases are never a valid scan axis (ADR 0005 §2.1.3)
  // — a block is trained as one unit, not swept parameter-by-parameter.
  let ownedParams = $derived(model.nnBlockScaleParameterNames());
  let parameterKeys = $derived(
    [...model.parameters.keys()].filter((key) => !ownedParams.has(key)),
  );
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <h2>Edit ecological outcome heatmap</h2>
  <Button
    onclick={() =>
      onSave({
        ...parent,
        title,
        xParameter,
        xMin,
        xMax,
        xSteps,
        yParameter,
        yMin,
        yMax,
        ySteps,
        tEnd,
      })}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<InputText
  id="heatmap-name"
  label="Name: "
  bind:value={title}
/>
<InputNumber
  id="heatmap-tend"
  label="Simulate until: "
  bind:value={tEnd}
/>

<h3>X axis</h3>
<div class="field-row">
  <label for="heatmap-x-parameter">Parameter: </label>
  <select
    id="heatmap-x-parameter"
    bind:value={xParameter}
  >
    {#each parameterKeys as key (key)}
      <option value={key}
        >{model.parameters.get(key)?.displayName ?? key}</option
      >
    {/each}
  </select>
</div>
<InputNumber
  id="heatmap-x-min"
  label="Min: "
  bind:value={xMin}
/>
<InputNumber
  id="heatmap-x-max"
  label="Max: "
  bind:value={xMax}
/>
<InputNumber
  id="heatmap-x-steps"
  label="Steps: "
  bind:value={xSteps}
/>

<h3>Y axis</h3>
<div class="field-row">
  <label for="heatmap-y-parameter">Parameter: </label>
  <select
    id="heatmap-y-parameter"
    bind:value={yParameter}
  >
    {#each parameterKeys as key (key)}
      <option value={key}
        >{model.parameters.get(key)?.displayName ?? key}</option
      >
    {/each}
  </select>
</div>
<InputNumber
  id="heatmap-y-min"
  label="Min: "
  bind:value={yMin}
/>
<InputNumber
  id="heatmap-y-max"
  label="Max: "
  bind:value={yMax}
/>
<InputNumber
  id="heatmap-y-steps"
  label="Steps: "
  bind:value={ySteps}
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
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  select:hover {
    border: var(--border-primary);
  }
</style>
