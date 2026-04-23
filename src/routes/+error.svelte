<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import Icon from "$lib/Icon.svelte";
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
    border-radius: var(--border-radius);
    background-color: var(--bg-l1);
    padding: 1.5rem;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
