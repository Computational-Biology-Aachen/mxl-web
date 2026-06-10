<script>
  import { DynBoxRow } from "@computational-biology-aachen/design";
</script>

<svelte:head>
  <title>Analyses - mxlweb</title>
</svelte:head>

<DynBoxRow
  items={[]}
  onAdd={(_box) => {
    return 1;
  }}
  onRemove={(_box) => {}}
>
  {#snippet children({ box: _box })}
    <h1>Test</h1>
  {/snippet}
</DynBoxRow>
