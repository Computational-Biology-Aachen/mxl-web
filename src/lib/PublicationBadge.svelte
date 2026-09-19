<script lang="ts">
  let {
    logo,
    text,
    href,
  }: {
    logo: string;
    text: string;
    href?: string;
  } = $props();
</script>

<div class="wrapper">
  <a
    href="https://www.sfb1535.hhu.de/en/mibinet"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src={logo}
      alt="SFB MibiNet logo"
    />
  </a>
  {#if href}
    <a
      class="text"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  {:else}
    <span class="text">
      {text}
    </span>
  {/if}
</div>

<style>
  div.wrapper {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    padding: 0.35rem 0.75rem;
    max-width: 50rem;
    height: 6rem;
  }
  div.wrapper:hover {
    border-color: var(--color-primary);
  }

  a,
  span {
    transition: var(--transition);
    color: var(--color-text);
    font-size: var(--text-callout);
    font-family: var(--font-sans);
    text-decoration: none;
  }

  .text {
    width: 10rem;
  }
  a.text:hover {
    color: var(--color-primary);
  }

  img {
    width: auto;
    height: 100%;
    max-height: 4rem;
  }
  img:hover {
    transform: translateY(-3px);
  }
</style>
