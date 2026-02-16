<script lang="ts">
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputNumberOptional from "$lib/inputs/InputNumberOptional.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";

  type Analysis = {
    tEnd: number;
    title: string;
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
  let title = $derived(parent.title);
  let yMaxAuto: boolean = $derived(untrack(() => yMax) ? false : true);
</script>

<RowApart>
  <h2>Edit analysis</h2>
  <PopoverSaveButton
    onclick={() =>
      onSave({ tEnd, yMax: yMaxAuto ? undefined : yMax, title: title })}
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

<h3>Plot options</h3>
<InputNumberOptional
  id="yMax"
  valueLabel="yMax: "
  condLabel="Auto?"
  bind:value={yMax}
  bind:condition={yMaxAuto}
/>
