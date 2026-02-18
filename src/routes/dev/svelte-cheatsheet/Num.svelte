<script lang="ts">
  let {
    value = $bindable(),
    isBound = false,
  }: { value: number; isBound?: boolean } = $props();
</script>

<div class="row">
  <span>In container</span>
  <span>a = {value}</span>
  <button onclick={() => (value = value + 1)}>
    Assign in container {isBound ? "(bound)" : ""}</button
  >
</div>
