<script lang="ts">
  import InlineGrid from "$lib/InlineGrid.svelte";

  type Props = {
    id: string;
    label: string;
    checked: boolean;
    border?: "transparent" | "solid";
  };
  let {
    id,
    label: name,
    checked = $bindable(),
    border = "solid",
  }: Props = $props();
</script>

<InlineGrid>
  <label for={id}>{name}</label>
  <input
    id={id}
    class={border}
    type="checkbox"
    bind:checked={checked}
  />
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
