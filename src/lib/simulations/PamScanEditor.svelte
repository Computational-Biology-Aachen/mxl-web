<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import InputChoice from "$lib/inputs/InputChoice.svelte";
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import type { PamPhase } from "./protocol";
  import type { PamAnalysis } from "$lib";

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: PamAnalysis;
    onSave: (options: PamAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $state(untrack(() => parent.title));
  let timeoutInSeconds = $state(untrack(() => parent.timeoutInSeconds));
  let method = $state(untrack(() => parent.method));
  let phases = $state<PamPhase[]>(
    untrack(() => $state.snapshot(parent.pamProtocol)) as PamPhase[],
  );

  function addPhase() {
    phases = [
      ...phases,
      {
        backgroundPFD: 100,
        backgroundLength: 85,
        pulsePFD: 5000,
        pulseLength: 0.8,
        repetitions: 1,
      },
    ];
  }

  function removePhase(i: number) {
    phases = phases.filter((_, idx) => idx !== i);
  }
</script>

<RowApart>
  <h2>Edit PAM analysis</h2>
  <PopoverSaveButton
    onclick={() =>
      onSave({
        ...parent,
        title,
        timeoutInSeconds,
        method,
        pamProtocol: phases,
      })}
    popovertarget={popovertarget}
  />
</RowApart>

<InputText
  id="pam-name"
  label="Name: "
  bind:value={title}
/>
<InputNumber
  id="pam-timeout"
  label="Simulation timeout in seconds: "
  bind:value={timeoutInSeconds}
/>
<InputChoice
  id="pam-method"
  label="Method"
  bind:value={method}
/>

<h3>Protocol phases</h3>

<div class="phase-grid">
  <span class="header">BG PFD</span>
  <span class="header">BG length (s)</span>
  <span class="header">Pulse PFD</span>
  <span class="header">Pulse length (s)</span>
  <span class="header">Repetitions</span>
  <span></span>

  {#each phases as phase, i}
    <InputNumber id="bg-pfd-{i}" bind:value={phase.backgroundPFD} />
    <InputNumber id="bg-len-{i}" bind:value={phase.backgroundLength} />
    <InputNumber id="pulse-pfd-{i}" bind:value={phase.pulsePFD} />
    <InputNumber id="pulse-len-{i}" bind:value={phase.pulseLength} />
    <InputNumber id="reps-{i}" bind:value={phase.repetitions} />
    <button class="remove" onclick={() => removePhase(i)} aria-label="Remove phase">
      <Icon fontSize="sm" color="inherit">close</Icon>
    </button>
  {/each}
</div>

<button class="add" onclick={addPhase}>
  <Icon fontSize="sm" color="inherit">add</Icon>
  Add phase
</button>

<style>
  .phase-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
    gap: 0.25rem 0.5rem;
    align-items: center;
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .header {
    font-size: 0.75rem;
    font-weight: var(--weight-bold);
    color: var(--text-secondary, #666);
    padding-bottom: 0.25rem;
  }

  .remove {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--border-radius);
    color: var(--text-secondary, #888);
    display: flex;
    align-items: center;
  }

  .remove:hover {
    color: var(--error, #c00);
    background-color: color-mix(in srgb, var(--error, #c00) 10%, transparent);
  }

  .add {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: var(--border);
    border-radius: var(--border-radius);
    cursor: pointer;
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
  }

  .add:hover {
    background-color: var(--bg-hover, #f5f5f5);
  }
</style>
