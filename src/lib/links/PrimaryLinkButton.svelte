<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, href }: { href: string; children: Snippet } = $props();
</script>

<a href={href}>{@render children()}</a>

<style>
  a {
    display: inline-flex;
    align-items: center;
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
    font-size: 1rem;
    letter-spacing: 0.025rem;
  }
  a:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
