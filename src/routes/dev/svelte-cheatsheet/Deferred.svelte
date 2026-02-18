<script lang="ts">
  type Data = Array<{ value: number }>;

  let {
    parent,
    callback,
  }: {
    parent: Data;
    callback: (arg0: Data) => void;
  } = $props();

  let internal = $state<Data>([]);
  $effect(() => {
    internal = parent.slice();
  });
</script>

<div class="row">
  <span>In container</span>
  {#each internal as _, idx}
    <span>value = {internal[idx].value}</span>
    <button onclick={() => (internal[idx] = { value: internal[idx].value + 1 })}
      >Assign internally</button
    >
  {/each}

  <button onclick={() => callback(internal)}> Callback</button>
</div>
