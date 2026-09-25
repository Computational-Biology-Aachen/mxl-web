<!--
  @component

  A dropdown filter control: a trigger showing a small label above the current
  selection, opening a native popover panel with the options. Either
  single-choice (`value`) or multi-select (`values`, empty meaning "all").

  ### Props

  - `label: string`
    Small label shown above the current selection.
  - `options: { value: string; label: string }[]`
    Choices offered in the panel.
  - `multiple?: boolean`
    Multi-select bound to `values`. Defaults to single-choice bound to `value`.
  - `allLabel?: string`
    Text for "no restriction". Multi-select shows it when `values` is empty.
    Single-choice adds it as a first option with value `""`. Omit for controls
    that always need a value, such as sorting.
  - `value?: string` (bindable)
    Single-choice selection.
  - `values?: string[]` (bindable)
    Multi-select selection.

  ### Example

  ```svelte
  <FilterDropdown label="Biological system" multiple allLabel="All systems"
    options={systemOptions} bind:values={systems} />
  ```
-->
<script lang="ts">
  let {
    label,
    options,
    multiple = false,
    allLabel,
    value = $bindable(""),
    values = $bindable([]),
  }: {
    label: string;
    options: { value: string; label: string }[];
    multiple?: boolean;
    allLabel?: string;
    value?: string;
    values?: string[];
  } = $props();

  const id = $props.id();

  let trigger: HTMLButtonElement | undefined = $state();
  let panel: HTMLDivElement | undefined = $state();

  const choices = $derived(
    !multiple && allLabel !== undefined
      ? [{ value: "", label: allLabel }, ...options]
      : options,
  );

  const summary = $derived.by(() => {
    if (!multiple) {
      return choices.find((o) => o.value === value)?.label ?? "";
    }
    const picked = options.filter((o) => values.includes(o.value));
    if (picked.length === 0) return allLabel ?? "";
    return picked.length === 1
      ? picked[0].label
      : `${picked[0].label} +${picked.length - 1}`;
  });

  function place(e: ToggleEvent) {
    if (e.newState !== "open" || !trigger || !panel) return;
    const r = trigger.getBoundingClientRect();
    panel.style.top = `${r.bottom + 4}px`;
    panel.style.left = `${r.left}px`;
    panel.style.minWidth = `${r.width}px`;
  }

  function pick(v: string) {
    value = v;
    panel?.hidePopover();
  }

  function toggle(v: string, checked: boolean) {
    values = checked ? [...values, v] : values.filter((x) => x !== v);
  }
</script>

<div class="dropdown">
  <button
    bind:this={trigger}
    type="button"
    class="trigger"
    popovertarget={id}
  >
    <span class="text">
      <span class="label">{label}</span>
      <span class="summary">{summary}</span>
    </span>
    <span class="material-symbols-outlined">expand_more</span>
  </button>

  <div
    bind:this={panel}
    id={id}
    popover="auto"
    class="panel"
    ontoggle={place}
  >
    {#each choices as option (option.value)}
      {#if multiple}
        <label class="option">
          <input
            type="checkbox"
            checked={values.includes(option.value)}
            onchange={(e) => toggle(option.value, e.currentTarget.checked)}
          />
          {option.label}
        </label>
      {:else}
        <button
          type="button"
          class="option"
          class:selected={option.value === value}
          onclick={() => pick(option.value)}
        >
          <span class="material-symbols-outlined check">
            {option.value === value ? "check" : ""}
          </span>
          {option.label}
        </button>
      {/if}
    {/each}
  </div>
</div>

<style>
  .trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    cursor: pointer;
    border: var(--border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    padding: var(--space-2) var(--space-3);
    width: 100%;
    min-width: 10rem;
    color: var(--color-text);
    font: inherit;
    text-align: left;
  }

  .trigger:hover,
  .trigger:has(+ :popover-open) {
    border-color: var(--color-primary);
  }

  .text {
    display: flex;
    flex-direction: column;
  }

  .label {
    color: var(--color-text-muted);
    font-size: var(--text-callout);
  }

  .summary {
    font-weight: var(--weight-medium);
    font-size: var(--text-sm);
  }

  .panel {
    position: fixed;
    margin: 0;
    inset: auto;
    box-shadow: var(--shadow-md);
    border: var(--border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    padding: var(--space-1);
  }

  .option {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    border: none;
    border-radius: var(--radius-sm);
    background: none;
    padding: var(--space-2) var(--space-3);
    width: 100%;
    color: var(--color-text);
    font: inherit;
    font-size: var(--text-sm);
    text-align: left;
    white-space: nowrap;
  }

  .option:hover {
    background: var(--color-bg);
  }

  .option.selected {
    color: var(--color-primary);
    font-weight: var(--weight-medium);
  }

  .check {
    width: 1.25rem;
    font-size: 1.125rem;
  }

  input[type="checkbox"] {
    accent-color: var(--color-primary);
  }
</style>
