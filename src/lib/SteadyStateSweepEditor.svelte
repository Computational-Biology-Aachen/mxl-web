<script lang="ts">
  import type { SteadyStateAnalysis } from "$lib";
  import {
    Button,
    InputChoice,
    InputNumber,
    InputNumberOptional,
    InputText,
    Row,
  } from "@computational-biology-aachen/design";
  import type { ModelBuilderBase } from "@computational-biology-aachen/mxlweb-core";
  import { untrack } from "svelte";
  import TableSearch from "./TableSearch.svelte";
  import { fuzzyMatch } from "./utils";

  let {
    parent,
    model,
    onSave,
    popovertarget,
  }: {
    parent: SteadyStateAnalysis;
    model: ModelBuilderBase;
    onSave: (analysis: SteadyStateAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $derived(parent.title);
  let parameter = $derived(parent.parameter);
  let min = $derived(parent.min);
  let max = $derived(parent.max);
  let steps = $derived(parent.steps);
  let varQuery = $state("");

  let xMin: number = $derived(parent.xMin || 0);
  let xMax: number = $derived(parent.xMax || 10);
  let yMin: number = $derived(parent.yMin || 0);
  let yMax: number = $derived(parent.yMax || 10);
  let xMinAuto: boolean = $derived(untrack(() => parent.xMin) ? false : true);
  let xMaxAuto: boolean = $derived(untrack(() => parent.xMax) ? false : true);
  let yMinAuto: boolean = $derived(untrack(() => parent.yMin) ? false : true);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);
  let lineDisplay = $state(untrack(() => parent.lineDisplay));

  // Outputs are the model's assignments, in topological order.
  let allAvailableKeys = $derived(model.sortDependencies());

  let filteredKeys = $derived(
    allAvailableKeys.filter((key) => fuzzyMatch(keyLabel(key), varQuery)),
  );

  let selectedKeys = $state<string[] | undefined>(
    untrack(() => parent.selectedKeys),
  );

  let normalizedKeys = $state<string[]>(
    untrack(() => parent.normalizedKeys ?? []),
  );

  function keyLabel(key: string): string {
    return model.getDisplayNames().get(key) ?? key;
  }

  function isSelected(key: string): boolean {
    return selectedKeys === undefined || selectedKeys.includes(key);
  }

  function toggle(key: string, checked: boolean) {
    if (checked) {
      if (selectedKeys === undefined) return;
      const next = [...selectedKeys, key];
      selectedKeys = next.length >= allAvailableKeys.length ? undefined : next;
    } else {
      const current = selectedKeys ?? [...allAvailableKeys];
      selectedKeys = current.filter((k) => k !== key);
    }
  }

  function isNormalized(key: string): boolean {
    return normalizedKeys.includes(key);
  }

  function toggleNormalized(key: string, checked: boolean) {
    if (checked) {
      normalizedKeys = [...normalizedKeys, key];
    } else {
      normalizedKeys = normalizedKeys.filter((k) => k !== key);
    }
  }

  let parameterKeys = $derived([...model.parameters.keys()]);
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <h2>Edit sweep</h2>
  <Button
    onclick={() =>
      onSave({
        ...parent,
        title,
        parameter,
        min,
        max,
        steps,
        xMin: xMinAuto ? undefined : xMin,
        xMax: xMaxAuto ? undefined : xMax,
        yMin: yMinAuto ? undefined : yMin,
        yMax: yMaxAuto ? undefined : yMax,
        selectedKeys,
        normalizedKeys: normalizedKeys.length > 0 ? normalizedKeys : undefined,
        lineDisplay,
      })}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<InputText
  id="sweep-name"
  label="Name: "
  bind:value={title}
/>

<div class="field-row">
  <label for="sweep-parameter">Axis (parameter): </label>
  <select
    id="sweep-parameter"
    bind:value={parameter}
  >
    {#each parameterKeys as key (key)}
      <option value={key}
        >{model.parameters.get(key)?.displayName ?? key}</option
      >
    {/each}
  </select>
</div>

<InputNumber
  id="sweep-min"
  label="Min: "
  bind:value={min}
/>
<InputNumber
  id="sweep-max"
  label="Max: "
  bind:value={max}
/>
<InputNumber
  id="sweep-steps"
  label="Steps: "
  bind:value={steps}
/>

<InputChoice
  id="line-display"
  label="LineDisplay"
  bind:value={lineDisplay}
>
  <option value="current">Only current</option>
  <option value="last">Compare to last</option>
  <option value="first">Compare to first</option>
</InputChoice>

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
  id="xMin"
  valueLabel="xMin: "
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

<details>
  <summary class="section-summary">Output selection</summary>
  <TableSearch bind:value={varQuery} />
  <div class="key-grid-header">
    <span></span>
    <span>Show</span>
    <span>Normalize</span>
  </div>
  {#each filteredKeys as key (key)}
    <div class="key-row">
      <label for="sel-{key}">{keyLabel(key)}</label>
      <input
        id="sel-{key}"
        type="checkbox"
        checked={isSelected(key)}
        onchange={(e) => toggle(key, e.currentTarget.checked)}
      />
      <input
        id="norm-{key}"
        type="checkbox"
        checked={isNormalized(key)}
        onchange={(e) => toggleNormalized(key, e.currentTarget.checked)}
      />
    </div>
  {/each}
</details>

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

  details {
    margin-top: 0.5rem;
  }

  .section-summary {
    cursor: pointer;
    padding: 0.25rem 0;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    list-style: none;
    user-select: none;
  }

  .section-summary::before {
    vertical-align: middle;
    content: "▶ ";
    font-size: 0.6rem;
  }

  details[open] .section-summary::before {
    content: "▼ ";
  }

  .key-grid-header,
  .key-row {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 0.5rem;
    padding: 0.1rem 0;
  }

  .key-grid-header span:not(:first-child) {
    width: 2.5rem;
    color: var(--color-text-muted, #888);
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
    text-align: center;
  }

  .key-row input[type="checkbox"] {
    justify-self: center;
    cursor: pointer;
    width: 1rem;
    height: 1rem;
  }

  .key-row label {
    cursor: pointer;
    font-size: 0.875rem;
  }
</style>
