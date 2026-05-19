<script lang="ts">
  import InlineGrid from "$lib/InlineGrid.svelte";
  import { Row } from "@computational-biology-aachen/design";

  type Props = {
    id: string;
    valueLabel: string;
    condLabel: string;
    value: number;
    condition: boolean;
    border?: "transparent" | "solid";
  };
  let {
    id,
    valueLabel,
    condLabel,
    value = $bindable(),
    condition = $bindable(),
    border = "solid",
  }: Props = $props();
</script>

<InlineGrid cols={3}>
  <label for={id}>{valueLabel}</label>
  <Row stack gap="0.5rem">
    <label for="{id}-cond">{condLabel}</label>
    <input
      id="{id}-cond"
      class={border}
      type="checkbox"
      bind:checked={condition}
    />
  </Row>
  {#if !condition}
    <input
      id={id}
      class={border}
      type="number"
      bind:value={value}
    />
  {/if}
</InlineGrid>

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
