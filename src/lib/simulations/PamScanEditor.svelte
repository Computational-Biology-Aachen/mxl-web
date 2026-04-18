<script lang="ts">
  import type { PamAnalysis } from "$lib";
  import Icon from "$lib/Icon.svelte";
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputChoice from "$lib/inputs/InputChoice.svelte";
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import type { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import type { PamPhase } from "./protocol";

  let {
    parent,
    model,
    onSave,
    popovertarget,
  }: {
    parent: PamAnalysis;
    model: ModelBuilder;
    onSave: (options: PamAnalysis) => void;
    popovertarget: string;
  } = $props();

  let title = $state(untrack(() => parent.title));
  let timeoutInSeconds = $state(untrack(() => parent.timeoutInSeconds));
  let method = $state(untrack(() => parent.method));
  let phases = $state<PamPhase[]>(
    untrack(() => $state.snapshot(parent.pamProtocol)) as PamPhase[],
  );
  let showDerived = $state(untrack(() => parent.showDerived ?? false));
  let nTimePoints = $state(untrack(() => parent.nTimePoints ?? 100));

  let allAvailableKeys = $derived([
    ...model.variables.keys(),
    ...(showDerived ? model.sortDependencies() : []),
  ]);

  let selectedKeys = $state<string[] | undefined>(
    untrack(() => parent.selectedKeys),
  );

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
        showDerived,
        selectedKeys,
        nTimePoints,
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
<InputNumber
  id="pam-nTimePoints"
  label="Time points per step: "
  bind:value={nTimePoints}
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
    <InputNumber
      id="bg-pfd-{i}"
      bind:value={phase.backgroundPFD}
    />
    <InputNumber
      id="bg-len-{i}"
      bind:value={phase.backgroundLength}
    />
    <InputNumber
      id="pulse-pfd-{i}"
      bind:value={phase.pulsePFD}
    />
    <InputNumber
      id="pulse-len-{i}"
      bind:value={phase.pulseLength}
    />
    <InputNumber
      id="reps-{i}"
      bind:value={phase.repetitions}
    />
    <button
      class="remove"
      onclick={() => removePhase(i)}
      aria-label="Remove phase"
    >
      <Icon
        fontSize="sm"
        color="inherit">close</Icon
      >
    </button>
  {/each}
</div>

<button
  class="add"
  onclick={addPhase}
>
  <Icon
    fontSize="sm"
    color="inherit">add</Icon
  >
  Add phase
</button>
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
      bind:checked={() => isSelected(key), (v) => toggle(key, v)}
    />
  {/each}
</details>

<style>
  .phase-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
    align-items: center;
    gap: 0.25rem 0.5rem;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .header {
    padding-bottom: 0.25rem;
    color: var(--text-secondary, #666);
    font-weight: var(--weight-bold);
    font-size: 0.75rem;
  }

  .remove {
    display: flex;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: var(--border-radius);
    background: none;
    padding: 0.25rem;
    color: var(--text-secondary, #888);
  }

  .remove:hover {
    background-color: color-mix(in srgb, var(--error, #c00) 10%, transparent);
    color: var(--error, #c00);
  }

  .add {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
    border: var(--border);
    border-radius: var(--border-radius);
    background: none;
    padding: 0.35rem 0.75rem;
    font-size: 0.875rem;
  }

  .add:hover {
    background-color: var(--bg-hover, #f5f5f5);
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
</style>
