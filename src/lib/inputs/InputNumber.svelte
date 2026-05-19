<script lang="ts">
  import InlineGrid from "$lib/InlineGrid.svelte";
  import { Row } from "@computational-biology-aachen/design";

  type Props = {
    id: string;
    label?: string;
    value: number;
    border?: "transparent" | "solid";
  };
  let { id, label, value = $bindable(), border = "solid" }: Props = $props();
</script>

{#if label}
  <InlineGrid>
    <label for={id}>{label}</label>
    <input
      id={id}
      class={border}
      type="number"
      bind:value={value}
    />
  </InlineGrid>
{:else}
  <Row stack gap="0.5rem">
    <input
      id={id}
      class={border}
      type="number"
      bind:value={value}
    />
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
