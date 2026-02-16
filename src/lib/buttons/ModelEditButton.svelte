<script lang="ts">
  let {
    popovertarget,
  }: {
    popovertarget: string;
  } = $props();
</script>

<button {popovertarget}>Edit model</button>

<style>
  button {
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--primary);
    padding: 0 1rem;
    min-width: 1rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
