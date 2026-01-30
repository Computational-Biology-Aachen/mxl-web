<script lang="ts">
  import { base } from "$app/paths";
  import { jsWorkerManager, pyWorkerManager } from "$lib/stores/workerStore";

  // Get shared workers to initialise them
  const pyWorker = pyWorkerManager;
  const jsWorker = jsWorkerManager;
</script>

<h1>mxlweb</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<h2>Select a pre-defined model</h2>
<ul>
  <li><a href="{base}/lotka-volterra">Lotka Volterra</a></li>
  <li><a href="{base}/population-dynamics">Population dynamics</a></li>
  <li><a href="{base}/tripartite">Tripartite dynamics</a></li>
  <li><a href="{base}/dynamic-entrobactin">Entrobactin</a></li>
  <li><a href="{base}/npq">NPQ</a></li>
  <li><a href="{base}/fvcb">FvCB</a></li>
</ul>

<h2>Model builder</h2>
<ul>
  <li><a href="{base}/dev/eq-editor">Eq editor</a></li>
  <li><a href="{base}/dev/stoich-editor">Stoich editor</a></li>
  <li><a href="{base}/dev/model-builder">Model builder</a></li>
  <li><a href="{base}/dev/model-edit">Model edit</a></li>
  <li><a href="{base}/dev/model-comp">Model comparison</a></li>
</ul>
