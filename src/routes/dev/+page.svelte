<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/Icon.svelte";
  import { pyWorkerManager } from "$lib/stores/workerStore";

  // Get shared workers to initialise them
  const pyWorker = pyWorkerManager;
</script>

<hgroup>
  <h1>mxlweb - development</h1>
  <p>Build and analyse models directly in the browser</p>
</hgroup>

<div class="heading">
  <Icon>settings</Icon>
  <h2>Development pages</h2>
</div>

<div class="card">
  <p>Quick access to important components</p>
  <ul>
    <li><a href="{base}/dev/analyses">analyses</a></li>
    <li><a href="{base}/dev/eq-editor">Eq editor</a></li>
    <li><a href="{base}/dev/model-comp">Model comparison</a></li>
    <li><a href="{base}/dev/model-edit">Model edit</a></li>
    <li><a href="{base}/dev/npq">npq</a></li>
    <li><a href="{base}/dev/stoich-editor">Stoich editor</a></li>
    <li><a href="{base}/dev/stoich-latex">Stoich latex</a></li>
  </ul>
</div>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: var(--shadow);
    border-radius: 0.75rem;
    background-color: var(--bg-l1);
    padding: 1.5rem;
  }
  li {
    list-style-position: inside;
  }
  li::marker {
    color: var(--primary);
  }
</style>
