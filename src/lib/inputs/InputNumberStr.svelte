<script lang="ts">
  import InlineGrid2 from "$lib/InlineGrid2.svelte";

  type Props = {
    id: string;
    label?: string;
    value: string;
    border?: "transparent" | "solid";
  };
  let { id, label, value = $bindable(), border = "solid" }: Props = $props();
</script>

<InlineGrid2>
  {#if label}
    <label for={id}>{label}</label>
  {/if}
  <input {id} class={border} type="number" bind:value />
</InlineGrid2>

<style>
  input {
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }
  .transparent {
    border: var(--border-transparent);
  }

  .solid {
    border: var(--border);
  }
</style>
