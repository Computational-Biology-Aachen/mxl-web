<script lang="ts">
  import type { Severity } from "./modelDiagnostics";

  let { counts }: { counts: Record<Severity, number> } = $props();

  let severity = $derived<Severity | null>(
    counts.error > 0 ? "error" : counts.warning > 0 ? "warning" : null,
  );
</script>

{#if severity}
  <span
    class="badge {severity}"
    title="{counts.error} errors, {counts.warning} warnings"
  >
    {counts[severity]}
  </span>
{/if}

<style>
  .badge {
    border-radius: var(--radius-full);
    padding: 0 0.4rem;
    min-width: 1.1rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.7rem;
    line-height: 1.1rem;
    text-align: center;
  }
  .error {
    background-color: var(--rwth-red);
  }
  .warning {
    background-color: var(--rwth-orange);
  }
</style>
