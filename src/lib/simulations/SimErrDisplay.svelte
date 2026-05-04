<script lang="ts">
  import Accordion from "$lib/Accordion.svelte";
  import type { SimulationError } from "$lib/stores/workerStore";

  let {
    err,
  }: {
    err: SimulationError;
  } = $props();

  let { message, hints, dxdt, args } = $derived(err);
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

  {#if dxdt || args}
    <Accordion>
      {#snippet header()}
        <h3>Diagnostics</h3>
      {/snippet}

      {#if dxdt && dxdt.length > 0}
        <h4>dxdt</h4>
        <table>
          <thead>
            <tr><th>Name</th><th>Value</th></tr>
          </thead>
          <tbody>
            {#each dxdt as { name, val }}
              <tr><td>{name}</td><td>{val}</td></tr>
            {/each}
          </tbody>
        </table>
      {/if}

      {#if args && args.length > 0}
        <h4>args</h4>
        <table>
          <thead>
            <tr><th>Name</th><th>Value</th></tr>
          </thead>
          <tbody>
            {#each args as { name, val }}
              <tr><td>{name}</td><td>{val}</td></tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </Accordion>
  {/if}
</div>

<style>
  .sim-error {
    border-left: 3px solid var(--color-error, #c0392b);
    /* border-radius: 0 var(--round, 4px) var(--round, 4px) 0; */
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

  table {
    margin: 1rem 0;
    border-collapse: collapse;
    font-size: inherit;
    font-family: monospace;
  }

  th,
  td {
    padding: 0.1rem 0.5rem 0.1rem 0;
    color: var(--color-text, inherit);
    text-align: left;
  }

  th:first-child,
  td:first-child {
    border-right: 1px solid currentColor;
    padding-right: 0.75rem;
  }

  th:last-child,
  td:last-child {
    padding-left: 0.5rem;
    text-align: right;
  }

  th {
    opacity: 0.6;
    border-bottom: 1px solid currentColor;
    font-weight: 600;
  }
</style>
