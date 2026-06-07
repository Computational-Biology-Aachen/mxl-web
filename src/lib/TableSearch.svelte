<script lang="ts">
  let {
    value = $bindable(),
    placeholder = "Filter…",
  }: {
    value: string;
    placeholder?: string;
  } = $props();
</script>

<input
  type="search"
  class="search"
  placeholder={placeholder}
  bind:value={value}
/>

<style>
  .search {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    padding: var(--space-2) var(--space-3);
    width: 100%;
    color: inherit;
    font: inherit;
  }
</style>
