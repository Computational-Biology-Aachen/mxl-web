<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import type { Snippet } from "svelte";

  let {
    header,
    children,
    open = $bindable(false),
  }: {
    header: Snippet;
    children: Snippet;
    open?: boolean;
  } = $props();
</script>

<div class="accordion">
  <button
    class="trigger"
    onclick={() => (open = !open)}
  >
    {@render header()}
    <span>
      <Icon
        color="inherit"
        fontSize="inherit"
      >
        {open ? "expand_less" : "expand_more"}</Icon
      >
    </span>
  </button>
  {#if open}
    <div class="content">
      {@render children()}
    </div>
  {/if}
</div>

<style>
  span {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    border-radius: var(--round);
    background-color: var(--primary);
    width: 1.8rem;
    height: 1.8rem;
    color: white;
    font-size: 1.33rem;
  }
  span:hover {
    background-color: lch(from var(--primary) calc(l - 10) c h);
  }
  .accordion {
    width: 100%;
  }

  .trigger {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0.25rem 0;
    width: 100%;
    color: inherit;
    font: inherit;
    text-align: left;
  }

  .trigger :global(h3) {
    flex: 1;
    margin: 0;
  }

  .content {
    padding: 1rem 0;
    max-height: 40vh;
    overflow: auto;
  }
</style>
