<script lang="ts">
  import InlineGrid3 from "$lib/InlineGrid3.svelte";
  import Row from "$lib/Row.svelte";

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

<InlineGrid3>
  <label for={id}>{valueLabel}</label>
  <Row>
    <label for="{id}-cond">{condLabel}</label>
    <input
      id="{id}-cond"
      class={border}
      type="checkbox"
      bind:checked={condition}
    />
  </Row>
  {#if !condition}
    <input {id} class={border} type="number" bind:value />
  {/if}
</InlineGrid3>

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
