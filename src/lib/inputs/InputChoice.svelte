<script lang="ts">
  import InlineGrid2 from "$lib/InlineGrid2.svelte";
  import type { Snippet } from "svelte";

  type Props = {
    id: string;
    label: string;
    value: string | undefined;
    border?: "transparent" | "solid";
    children: Snippet;
  };
  let {
    id,
    label: name,
    value = $bindable(),
    border = "solid",
    children,
  }: Props = $props();
</script>

<InlineGrid2>
  <label for={id}>{name}</label>
  <select
    id={id}
    class={border}
    bind:value={value}
  >
    {@render children()}
  </select>
</InlineGrid2>

<style>
  select {
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
