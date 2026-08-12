<script lang="ts">
  import type { FitAnalysis } from "$lib";
  import {
    Button,
    InputNumber,
    InputNumberOptional,
    InputText,
    Row,
  } from "@computational-biology-aachen/design";
  import { untrack } from "svelte";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: FitAnalysis;
    onSave: (options: FitAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $derived(parent.title);
  let chunkMaxfev = $derived(parent.chunkMaxfev);
  let yMax: number = $derived(parent.yMax || 10);
  let yMaxAuto: boolean = $derived(untrack(() => parent.yMax) ? false : true);
</script>

<Row
  stack
  justify="between"
  gap="0.5rem"
>
  <h2>Edit fit</h2>
  <Button
    onclick={() =>
      onSave({
        ...parent,
        title,
        chunkMaxfev,
        yMax: yMaxAuto ? undefined : yMax,
      })}
    popovertarget={popovertarget}
    popovertargetaction="hide">Save</Button
  >
</Row>

<InputText
  id="fit-name"
  label="Name: "
  bind:value={title}
/>
<InputNumber
  id="chunk-maxfev"
  label="Function evaluations per progress update: "
  bind:value={chunkMaxfev}
/>

<h3>Plot options</h3>
<InputNumberOptional
  id="fit-yMax"
  valueLabel="yMax: "
  condLabel="Auto?"
  bind:value={yMax}
  bind:condition={yMaxAuto}
/>
