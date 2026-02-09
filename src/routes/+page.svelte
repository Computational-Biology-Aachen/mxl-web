<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/Icon.svelte";
  import { jsWorkerManager, pyWorkerManager } from "$lib/stores/workerStore";

  // Get shared workers to initialise them
  const pyWorker = pyWorkerManager;
  const jsWorker = jsWorkerManager;
</script>

<hgroup>
  <h1>mxlweb</h1>
  <p>Build and analyse models directly in the browser</p>
</hgroup>

<div class="heading">
  <Icon>bolt</Icon>
  <h2>Select a pre-defined model</h2>
</div>

<div class="card">
  <p>Quickly start by picking one of our pre-build ODE models</p>
  <ul>
    <li><a href="{base}/lotka-volterra">Lotka Volterra</a></li>
    <li><a href="{base}/population-dynamics">Population dynamics</a></li>
    <li><a href="{base}/tripartite">Tripartite dynamics</a></li>
    <li><a href="{base}/dynamic-entrobactin">Entrobactin</a></li>
    <!-- <li><a href="{base}/npq">NPQ</a></li> -->
  </ul>

  <p>Steady-state models</p>
  <ul>
    <li><a href="{base}/fvcb">FvCB</a></li>
  </ul>
</div>

<!-- <div class="heading">
  <Icon>settings</Icon>
  <h2>Development pages</h2>
</div>

<div class="card">
  <p>Quick access to important components</p>
  <ul>
    <li><a href="{base}/dev/eq-editor">Eq editor</a></li>
    <li><a href="{base}/dev/stoich-editor">Stoich editor</a></li>
    <li><a href="{base}/dev/model-edit">Model edit</a></li>
    <li><a href="{base}/dev/model-comp">Model comparison</a></li>
  </ul>
</div> -->

<style>
  .heading {
    display: flex;
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
