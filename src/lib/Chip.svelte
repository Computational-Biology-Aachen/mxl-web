<!--
  @component

  A small read-only pill used to label a model with its type or biological
  system.

  ### Props

  - `label: string`
    Text shown in the chip.
  - `icon?: string`
    Optional Material Symbols icon name shown before the label.

  ### Example

  ```svelte
  <Chip label="ODE model" icon="timeline" />
  ```
-->
<script lang="ts">
  let {
    label,
    icon,
  }: {
    label: string;
    icon?: string;
  } = $props();
</script>

<span class="chip">
  {#if icon}
    <span class="material-symbols-outlined">{icon}</span>
  {/if}
  {label}
</span>

<style>
  .chip {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    border: var(--border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    padding: 2px var(--space-2);
    color: var(--color-text-muted);
    font-size: var(--text-callout);
    white-space: nowrap;
  }

  .material-symbols-outlined {
    font-size: 1rem;
  }
</style>
