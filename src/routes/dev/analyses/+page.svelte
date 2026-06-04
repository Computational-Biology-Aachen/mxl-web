<script>
  import { DynBoxRow } from "@computational-biology-aachen/design";
</script>

<svelte:head>
  <title>Analyses - mxlweb</title>
</svelte:head>

<DynBoxRow
  items={[]}
  onAdd={(box) => {
    return 1;
  }}
  onRemove={(box) => {}}
>
  {#snippet children({ box })}
    <h1>Test</h1>
  {/snippet}
</DynBoxRow>
