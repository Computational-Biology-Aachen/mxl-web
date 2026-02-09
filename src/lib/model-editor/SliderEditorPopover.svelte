<script lang="ts">
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

  let enabled: boolean = $state(target.slider ? true : false);
  let minVal: string = $state(target.slider?.min || "0.0");
  let maxVal: string = $state(target.slider?.max || "1.0");
  let stepVal: string = $state(target.slider?.step || "0.1");
  let texName: string | undefined = $state(target.slider?.texName);
</script>

<section class="page">
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

  <button
    class="save"
    onclick={() =>
      onSave(
        enabled
          ? {
              value: target.value,
              slider: { min: minVal, max: maxVal, step: stepVal },
            }
          : { value: target.value },
      )}
    popovertargetaction="hide"
    {popovertarget}>Save</button
  >
</section>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .row {
    display: flex;
    flex-direction: row;
    gap: 0 0.5rem;
  }

  /* Save button */
  button.save {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: 0.5rem;
    background-color: var(--primary);
    width: 8rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.save:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
