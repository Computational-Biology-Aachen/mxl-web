<!--
  @component

  The Name cell shared by the model-editor tables: a text input for the
  display name beside the click-to-edit rendered TeX name.

  ### Props

  - `name: string`
    The name shown in the input (display name, or the id when unset).
  - `texName: string`
    Raw LaTeX source of the TeX name.
  - `onName: (name: string) => void`
    Called when the name changes. The caller also re-derives the TeX name
    (`defaultTexName`), so both stay in step until the TeX name is edited.
  - `onTex: (texName: string) => void`
    Called when the TeX name is edited directly.
-->
<script lang="ts">
  import TexNameInput from "./TexNameInput.svelte";

  let {
    name,
    texName,
    onName,
    onTex,
  }: {
    name: string;
    texName: string;
    onName: (name: string) => void;
    onTex: (texName: string) => void;
  } = $props();
</script>

<div class="name-cell">
  <input
    type="text"
    aria-label="Name"
    value={name}
    oninput={(e) => onName(e.currentTarget.value)}
  />
  <div class="tex">
    <TexNameInput bind:value={() => texName, onTex} />
  </div>
</div>

<style>
  .name-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  input,
  .tex {
    flex: 1 1 50%;
    min-width: 0;
  }
  .tex {
    overflow: hidden;
  }
  input {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    font-size: 0.875rem;
  }
  input:hover,
  input:focus {
    border: var(--border-primary);
  }
</style>
