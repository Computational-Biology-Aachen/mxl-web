<!--
  @component

  Inline slider settings (enabled, min, max, step) for a variable or
  parameter, shown in an expanded table row. Edits apply immediately.

  ### Props

  - `slider?: SliderArgs`
    The current settings; `undefined` means no slider.
  - `onChange: (slider: SliderArgs | undefined) => void`
    Called with the next settings on every edit.
-->
<script lang="ts">
  import type { SliderArgs } from "./modelView";

  let {
    slider,
    onChange,
  }: {
    slider?: SliderArgs;
    onChange: (slider: SliderArgs | undefined) => void;
  } = $props();
</script>

<div class="slider">
  <label>
    <input
      type="checkbox"
      checked={slider !== undefined}
      onchange={(e) =>
        onChange(
          e.currentTarget.checked
            ? { min: "0.0", max: "1.0", step: "0.1" }
            : undefined,
        )}
    />
    Display slider
  </label>
  {#if slider}
    {#each ["min", "max", "step"] as const as field (field)}
      <label>
        {field}
        <input
          type="text"
          inputmode="decimal"
          class="field"
          value={slider[field]}
          onchange={(e) =>
            onChange({ ...slider, [field]: e.currentTarget.value })}
        />
      </label>
    {/each}
  {/if}
</div>

<style>
  .slider {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1.5rem;
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.875rem;
  }
  .field {
    border: var(--border-primary);
    border-radius: var(--radius-lg);
    padding: 0.35rem 0.5rem;
    width: 5rem;
    font-size: 0.875rem;
    text-align: right;
  }
</style>
