<script lang="ts">
  import Icon from "$lib/Icon.svelte";

  let {
    popovertarget,
  }: {
    popovertarget: string;
  } = $props();
</script>

<button popovertarget={popovertarget}>
  <Icon
    color="inherit"
    fontSize="inherit">edit</Icon
  >
</button>

<style>
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: var(--round);
    background-color: var(--bg-l1);
    width: 1.5rem;
    height: 1.5rem;
    color: var(--primary);
    font-size: 0.75rem;
  }
  button:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
    color: white;
  }
</style>
