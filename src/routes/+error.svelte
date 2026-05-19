<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { Icon } from "@computational-biology-aachen/design";
</script>

<svelte:head>
  <title>{$page.status} — mxlweb</title>
</svelte:head>

<hgroup>
  <h1>{$page.status}</h1>
  <p>{$page.error?.message ?? "An unexpected error occurred"}</p>
</hgroup>

<div class="card">
  <div class="row">
    <Icon color="primary">home</Icon>
    <a href="{base}/">Back to home</a>
  </div>
</div>

<style>
  .card {
    box-shadow: var(--shadow);
    border-radius: var(--radius-lg);
    background-color: var(--color-surface);
    padding: 1.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
