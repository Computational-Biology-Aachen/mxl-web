<script lang="ts">
  let {
    value = $bindable(),
    isBound = false,
  }: { value: number[]; isBound?: boolean } = $props();
</script>

<div class="row">
  <span>In container</span>
  <span>a = {value[0]}</span>
  <button onclick={() => (value[0] = value[0] + 1)}
    >Assign in container {isBound ? "(bound)" : ""}</button
  >
</div>
