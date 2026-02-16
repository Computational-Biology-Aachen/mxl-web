<script lang="ts">
  import InlineGrid2 from "$lib/InlineGrid2.svelte";
  import Row from "$lib/Row.svelte";

  type Props = {
    id: string;
    label?: string;
    value: number;
    border?: "transparent" | "solid";
  };
  let { id, label, value = $bindable(), border = "solid" }: Props = $props();
</script>

{#if label}
  <InlineGrid2>
    <label for={id}>{label}</label>
    <input {id} class={border} type="number" bind:value />
  </InlineGrid2>
{:else}
  <Row>
    <input {id} class={border} type="number" bind:value />
  </Row>
{/if}

<style>
  input {
    border-radius: var(--border-radius);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
  }

  input:hover {
    border: var(--border-primary);
  }

  .transparent {
    border: var(--border-transparent);
  }

  .solid {
    border: var(--border);
  }
</style>
