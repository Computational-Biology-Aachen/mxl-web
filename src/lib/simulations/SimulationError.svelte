<script lang="ts">
  let {
    message,
    hints,
  }: {
    message: string;
    hints?: string[];
  } = $props();
</script>

<div class="sim-error">
  <p class="error-msg">{message}</p>
  {#if hints && hints.length > 0}
    <p class="try-label">Try:</p>
    <ul>
      {#each hints as hint}
        <li>{hint}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .sim-error {
    border-left: 3px solid var(--color-error, #c0392b);
    border-radius: 0 var(--round, 4px) var(--round, 4px) 0;
    background: color-mix(in srgb, var(--color-error, #c0392b) 8%, transparent);
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .error-msg {
    margin: 0 0 0.4rem;
    color: var(--color-error, #c0392b);
    font-weight: 600;
    word-break: break-word;
  }

  .try-label {
    margin: 0 0 0.25rem;
    color: var(--color-text, inherit);
    font-weight: 600;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    color: var(--color-text, inherit);
  }

  li {
    margin-bottom: 0.2rem;
  }
</style>
