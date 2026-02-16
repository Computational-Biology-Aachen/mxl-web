<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import type { MouseEventHandler } from "svelte/elements";

  let {
    onclick,
    popovertarget,
  }: {
    onclick: MouseEventHandler<HTMLButtonElement>;
    popovertarget: string;
  } = $props();
</script>

<button class="save" {onclick} popovertargetaction="hide" {popovertarget}>
  <Icon color="inherit" fontSize="lg">play_arrow</Icon>
  Save
</button>

<style>
  /* Save button */
  button.save {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-primary);
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--primary);
    width: 8rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button.save:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
