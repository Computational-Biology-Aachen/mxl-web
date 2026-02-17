<script lang="ts">
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputNumberStr from "$lib/inputs/InputNumberStr.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import { type Parameter, type Variable } from "./modelView";

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
  let texName: string | undefined = $derived(target.texName);
</script>

<RowApart>
  <h2>Edit Options</h2>
  <PopoverSaveButton
    popovertarget={popovertarget}
    onclick={() =>
      onSave(
        enabled
          ? {
              id: target.id,
              value: target.value,
              slider: { min: minVal, max: maxVal, step: stepVal },
            }
          : { id: target.id, value: target.value },
      )}
  />
</RowApart>

<InputText
  id="tex-name"
  label="LaTeX name: "
  bind:value={texName}
/>
<InputCheckbox
  id="slider-enabeld"
  label="Display slider?"
  bind:checked={enabled}
/>

{#if enabled}
  <InputNumberStr
    id="min-slider"
    label="Min: "
    bind:value={minVal}
  />
  <InputNumberStr
    id="max-slider"
    label="Max: "
    bind:value={maxVal}
  />
  <InputNumberStr
    id="step-slider"
    label="Step: "
    bind:value={stepVal}
  />
{/if}
