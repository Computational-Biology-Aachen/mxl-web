<script lang="ts">
  import type { SimulationAnalysis } from "$lib";
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputChoice from "$lib/inputs/InputChoice.svelte";
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputNumberOptional from "$lib/inputs/InputNumberOptional.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import type { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";

  let {
    parent,
    model,
    onSave,
    popovertarget,
  }: {
    parent: SimulationAnalysis;
    model: ModelBuilder;
    onSave: (options: SimulationAnalysis) => void;
    popovertarget: string;
  } = $props();

  let tEnd = $derived(parent.tEnd);
  let xMin: number = $derived(parent.xMin || 0);
  let xMax: number = $derived(parent.xMax || 10);
  let yMin: number = $derived(parent.yMin || 0);
  let yMax: number = $derived(parent.yMax || 10);
  let xMinAuto: boolean = $derived(untrack(() => parent.xMin) ? false : true);
  let xMaxAuto: boolean = $derived(untrack(() => parent.xMax) ? false : true);
  let yMinAuto: boolean = $derived(untrack(() => parent.yMin) ? false : true);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);
  let title = $derived(parent.title);
  let timeoutInSeconds = $derived(parent.timeoutInSeconds);
  let method = $derived(parent.method);
  let showDerived = $state(untrack(() => parent.showDerived ?? false));

  let allAvailableKeys = $derived([
    ...model.variables.keys(),
    ...(showDerived ? model.sortDependencies() : []),
  ]);

  let selectedKeys = $state<string[] | undefined>(untrack(() => parent.selectedKeys));

  function keyLabel(key: string): string {
    return (
      model.variables.get(key)?.displayName ??
      model.assignments.get(key)?.displayName ??
      model.reactions.get(key)?.displayName ??
      key
    );
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
</script>

<RowApart>
  <h2>Edit analysis</h2>
  <PopoverSaveButton
    onclick={() =>
      onSave({
        ...parent,
        tEnd,
        xMin: yMaxAuto ? undefined : xMin,
        xMax: yMaxAuto ? undefined : xMax,
        yMin: yMaxAuto ? undefined : yMin,
        yMax: yMaxAuto ? undefined : yMax,
        title: title,
        timeoutInSeconds: timeoutInSeconds,
        method: method,
        showDerived,
        selectedKeys,
      })}
    popovertarget={popovertarget}
  />
</RowApart>

<InputText
  id="name"
  label="Name: "
  bind:value={title}
/>
<InputNumber
  id="final-time"
  label="Simulate until: "
  bind:value={tEnd}
/>
<InputNumber
  id="timeoutInSeconds"
  label="Simulation timeout in seconds: "
  bind:value={timeoutInSeconds}
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

<InputChoice
  id="integrationMethod"
  label="Method"
  bind:value={method}
/>
<InputCheckbox
  id="showDerived"
  label="Show assignments & reactions"
  bind:checked={showDerived}
/>

<details>
  <summary class="section-summary">Variable selection</summary>
  {#each allAvailableKeys as key (key)}
    <InputCheckbox
      id="sel-{key}"
      label={keyLabel(key)}
      bind:checked={
        () => isSelected(key),
        (v) => toggle(key, v)
      }
    />
  {/each}
</details>

<style>
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
    content: "▶ ";
    font-size: 0.6rem;
    vertical-align: middle;
  }

  details[open] .section-summary::before {
    content: "▼ ";
  }
</style>
