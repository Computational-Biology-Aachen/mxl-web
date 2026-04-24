<script lang="ts">
  import { base } from "$app/paths";
  import Icon from "$lib/Icon.svelte";
  import ModelCard from "$lib/ModelCard.svelte";
  import ModelGallery from "$lib/ModelGallery.svelte";
  import { pyWorkerManager } from "$lib/stores/workerStore";
  import ebelingScheme from "$lib/assets/ebeling2026-scheme.png";
  import lotkaVolterraScheme from "$lib/assets/lotka-volterra-scheme.png";

  // Get shared workers to initialise them
  const pyWorker = pyWorkerManager;
</script>

<hgroup>
  <h1>mxlweb</h1>
  <p>Build and analyse models directly in the browser</p>
</hgroup>

<div class="heading">
  <Icon color="primary">bolt</Icon>
  <h2>Select a pre-defined model</h2>
</div>

<ModelGallery title="ODE models">
  <ModelCard
    name="Lotka Volterra"
    href="{base}/lotka-volterra"
    image={lotkaVolterraScheme}
  />
  <ModelCard
    name="Population dynamics"
    href="{base}/population-dynamics"
  />
  <ModelCard
    name="Tripartite dynamics"
    href="{base}/tripartite"
  />
  <ModelCard
    name="Entrobactin"
    href="{base}/dynamic-entrobactin"
  />
  <ModelCard
    name="Yokota 1985"
    href="{base}/yokota1985"
  />
  <ModelCard
    name="Poolman 2000"
    href="{base}/poolman2000"
  />
  <ModelCard
    name="Matuszyńska 2016 (NPQ)"
    href="{base}/matuszynska2016_npq"
  />
  <ModelCard
    name="Matuszyńska 2016 (PHD)"
    href="{base}/matuszynska2016_phd"
  />
  <ModelCard
    name="Saadat 2021"
    href="{base}/saadat2021"
  />
  <ModelCard
    name="Ebeling 2026"
    href="{base}/ebeling-2026"
    image={ebelingScheme}
  />
</ModelGallery>

<ModelGallery title="Steady-state models">
  <ModelCard
    name="FvCB"
    href="{base}/fvcb"
  />
</ModelGallery>

<style>
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
