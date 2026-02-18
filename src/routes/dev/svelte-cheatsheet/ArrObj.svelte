<script lang="ts">
  let {
    value = $bindable(),
    isBound = false,
  }: { value: Array<{ value: number }>; isBound?: boolean } = $props();
</script>

<div class="row">
  <span>In container</span>
  <span>value = {value[0].value}</span><button
    onclick={() => (value[0] = { value: value[0].value + 1 })}
    >Assign in container {isBound ? "(bound)" : ""}</button
  >
</div>
