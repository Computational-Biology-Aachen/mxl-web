<script>
  import DynBoxRow from "$lib/DynBoxRow.svelte";
</script>

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
