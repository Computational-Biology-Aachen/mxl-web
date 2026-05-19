<script lang="ts">
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputNumberStr from "$lib/inputs/InputNumberStr.svelte";
  import { Button, Row } from "@computational-biology-aachen/design";
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
</script>

<Row stack justify="between" gap="0.5rem">
  <h2>Edit Options</h2>
  <Button
    popovertarget={popovertarget}
    popovertargetaction="hide"
    onclick={() =>
      onSave(
        enabled
          ? {
              ...target,
              slider: { min: minVal, max: maxVal, step: stepVal },
            }
          : target,
      )}
  >Save</Button>
</Row>

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
