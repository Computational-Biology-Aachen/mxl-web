<!--
  @component

  A "Tex name" table cell: renders the LaTeX-rendered name by default,
  switching to a plain text input on click for editing and back to the
  rendered display on blur. Shared by every model-editor table's Tex name
  column (Variables, Parameters, Assignments, Reactions, Readouts).

  ### Props

  - `value: string` (bindable)
    The raw LaTeX source.
  - `ariaLabel?: string`
    Defaults to `"Tex name"`.
-->
<script lang="ts">
  import { Math } from "@computational-biology-aachen/design";

  let {
    value = $bindable(),
    ariaLabel = "Tex name",
  }: {
    value: string;
    ariaLabel?: string;
  } = $props();

  let editing = $state(false);

  function focusOnMount(node: HTMLInputElement) {
    node.focus();
  }
</script>

{#if editing}
  <input
    type="text"
    aria-label={ariaLabel}
    use:focusOnMount
    onblur={() => (editing = false)}
    bind:value={value}
  />
{:else}
  <button
    type="button"
    class="tex-display"
    aria-label={ariaLabel}
    onclick={() => (editing = true)}
  >
    <Math
      tex={value}
      display={false}
      fontSize="0.75rem"
    />
  </button>
{/if}

<style>
  input,
  .tex-display {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.25rem 0.5rem;
    width: 100%;
    font-size: 0.75rem;
  }

  input:hover,
  .tex-display:hover {
    border: var(--border-primary);
  }

  .tex-display {
    display: block;
    cursor: text;
    font: inherit;
    text-align: left;
  }
</style>
