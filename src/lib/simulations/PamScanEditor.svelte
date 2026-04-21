<script lang="ts">
  import type { PamAnalysis } from "$lib";
  import Icon from "$lib/Icon.svelte";
  import InputCheckbox from "$lib/inputs/InputCheckbox.svelte";
  import InputChoice from "$lib/inputs/InputChoice.svelte";
  import InputNumber from "$lib/inputs/InputNumber.svelte";
  import InputText from "$lib/inputs/InputText.svelte";
  import type { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import RowApart from "$lib/RowApart.svelte";
  import { untrack } from "svelte";
  import PopoverSaveButton from "../buttons/PopoverSaveButton.svelte";
  import { type PamGroup, migratePamPhases } from "./protocol";

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

  function initGroups(): PamGroup[] {
    const raw = untrack(() => $state.snapshot(parent.pamProtocol));
    if (raw.length > 0 && "backgroundPFD" in (raw[0] as object)) {
      return migratePamPhases(
        raw as unknown as Parameters<typeof migratePamPhases>[0],
      );
    }
    return raw as PamGroup[];
  }

  let title = $state(untrack(() => parent.title));
  let timeoutInSeconds = $state(untrack(() => parent.timeoutInSeconds));
  let method = $state(untrack(() => parent.method));
  let groups = $state<PamGroup[]>(initGroups());
  let showDerived = $state(untrack(() => parent.showDerived ?? false));
  let nTimePoints = $state(untrack(() => parent.nTimePoints ?? 100));
  let lineDisplay = $state(untrack(() => parent.lineDisplay));

  let allAvailableKeys = $derived([
    ...model.variables.keys(),
    ...(showDerived ? model.sortDependencies() : []),
  ]);

  let selectedKeys = $state<string[] | undefined>(
    untrack(() => parent.selectedKeys),
  );

  let normalizedKeys = $state<string[]>(
    untrack(() => parent.normalizedKeys ?? []),
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

  function addGroup() {
    groups = [
      ...groups,
      {
        steps: [{ pfd: 100, duration: 60 }],
        repetitions: 1,
      },
    ];
  }

  function removeGroup(i: number) {
    groups = groups.filter((_, idx) => idx !== i);
  }

  function addStep(groupIdx: number) {
    groups = groups.map((g, i) =>
      i === groupIdx
        ? { ...g, steps: [...g.steps, { pfd: 100, duration: 60 }] }
        : g,
    );
  }

  function removeStep(groupIdx: number, stepIdx: number) {
    groups = groups.map((g, i) =>
      i === groupIdx
        ? { ...g, steps: g.steps.filter((_, si) => si !== stepIdx) }
        : g,
    );
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
        pamProtocol: groups,
        showDerived,
        selectedKeys,
        normalizedKeys: normalizedKeys.length > 0 ? normalizedKeys : undefined,
        nTimePoints,
        lineDisplay,
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
>
  <option value="Radau">Radau</option>
  <option value="LSODA">LSODA</option>
</InputChoice>

<InputChoice
  id="line-display"
  label="LineDisplay"
  bind:value={lineDisplay}
>
  <option value="current">Only current</option>
  <option value="last">Compare to previous</option>
  <option value="first">Compare to first</option>
</InputChoice>

<h3>Protocol phases</h3>

{#each groups as group, gi}
  <div class="group">
    <div class="group-header">
      <span class="group-label">Group {gi + 1} — repeat</span>
      <InputNumber
        id="reps-{gi}"
        bind:value={group.repetitions}
      />
      <span class="group-label">×</span>
      <button
        class="remove"
        onclick={() => removeGroup(gi)}
        aria-label="Remove group"
      >
        <Icon
          fontSize="sm"
          color="inherit">close</Icon
        >
      </button>
    </div>

    <div class="step-grid">
      <span class="header">PFD</span>
      <span class="header">Duration (s)</span>
      <span class="header">Label</span>
      <span></span>

      {#each group.steps as step, si}
        <InputNumber
          id="step-pfd-{gi}-{si}"
          bind:value={step.pfd}
        />
        <InputNumber
          id="step-dur-{gi}-{si}"
          bind:value={step.duration}
        />
        <input
          id="step-label-{gi}-{si}"
          class="label-input"
          type="text"
          placeholder="label"
          value={step.label ?? ""}
          oninput={(e) => {
            step.label = e.currentTarget.value || undefined;
          }}
        />
        <button
          class="remove"
          onclick={() => removeStep(gi, si)}
          aria-label="Remove step"
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
      onclick={() => addStep(gi)}
    >
      <Icon
        fontSize="sm"
        color="inherit">add</Icon
      >
      Add step
    </button>
  </div>
{/each}

<button
  class="add"
  onclick={addGroup}
>
  <Icon
    fontSize="sm"
    color="inherit">add</Icon
  >
  Add group
</button>

<InputCheckbox
  id="showDerived"
  label="Show assignments & reactions"
  bind:checked={showDerived}
/>

<details>
  <summary class="section-summary">Variable selection</summary>
  <div class="key-grid-header">
    <span></span>
    <span>Show</span>
    <span>Normalize</span>
  </div>
  {#each allAvailableKeys as key (key)}
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
  .group {
    margin-bottom: 1rem;
    border: var(--border);
    border-radius: var(--border-radius);
    padding: 0.5rem 0.75rem;
  }

  .group-header {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-bottom: 0.5rem;
  }

  .group-label {
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .step-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
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

  .label-input {
    border: var(--border);
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
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
