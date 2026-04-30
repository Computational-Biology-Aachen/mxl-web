<script lang="ts">
  import { base } from "$app/paths";
  import schemeEbeling from "$lib/assets/ebeling2026-scheme.png";
  import schemeEntrobactin from "$lib/assets/entrobactin.png";
  import schemeLotkaVolt from "$lib/assets/lotka-volterra-scheme.png";
  import scheme2016npq from "$lib/assets/matuszynska2016npq.png";
  import scheme2016phd from "$lib/assets/matuszynska2016phd.png";
  import schemePopDyn from "$lib/assets/population-dynamics.png";
  import schemeSaadat from "$lib/assets/saadat2021.png";
  import schemeTripartite from "$lib/assets/tripartite.png";
  import schemeYokota from "$lib/assets/yokota.png";
  import Icon from "$lib/Icon.svelte";
  import ModelCard from "$lib/ModelCard.svelte";
  import ModelGallery from "$lib/ModelGallery.svelte";
  import { pyWorkerPool } from "$lib/stores/workerPool";

  // Get shared workers to initialise them
  const workerPool = pyWorkerPool;
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
    image={schemeLotkaVolt}
  />
  <ModelCard
    name="Population dynamics"
    href="{base}/population-dynamics"
    image={schemePopDyn}
  />
  <ModelCard
    name="Tripartite dynamics"
    href="{base}/tripartite"
    image={schemeTripartite}
  />
  <ModelCard
    name="Entrobactin"
    href="{base}/dynamic-entrobactin"
    image={schemeEntrobactin}
  />
  <ModelCard
    name="Yokota 1985"
    href="{base}/yokota1985"
    image={schemeYokota}
  />
  <ModelCard
    name="Poolman 2000"
    href="{base}/poolman2000"
    image={scheme2016phd}
  />
  <ModelCard
    name="Matuszyńska 2016 (NPQ)"
    href="{base}/matuszynska2016_npq"
    image={scheme2016npq}
  />
  <ModelCard
    name="Matuszyńska 2016 (PHD)"
    href="{base}/matuszynska2016_phd"
    image={scheme2016phd}
  />
  <ModelCard
    name="Saadat 2021"
    href="{base}/saadat2021"
    image={schemeSaadat}
  />
  <ModelCard
    name="Ebeling 2026"
    href="{base}/ebeling-2026"
    image={schemeEbeling}
  />
  <ModelCard
    name="Tomato KEA3"
    href="{base}/kea3-tomato"
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
