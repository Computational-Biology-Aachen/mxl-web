<script lang="ts">
  import { base } from "$app/paths";
  import * as config from "$lib/config";
  import "../app.css";

  import Navbar from "$lib/Navbar.svelte";

  let { children } = $props();
</script>

<!-- SEO -->
<svelte:head>
  <meta name="description" content={config.description} />
  <meta property="og:title" content={config.title} />
  <meta property="og:description" content={config.description} />
  <meta property="og:url" content={config.url} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Navbar>
  <li><a href="{base}/">Home</a></li>
  <li><a href="{base}/lotka-volterra">Lotka Volterra</a></li>
  <li><a href="{base}/population-dynamics">Population dynamics</a></li>
  <li><a href="{base}/tripartite">Tripartite dynamics</a></li>
  <li><a href="{base}/dynamic-entrobactin">Entrobactin</a></li>
  <li><a href="{base}/npq">NPQ</a></li>
  <li><a href="{base}/fvcb">FvCB</a></li>
</Navbar>

<main>
  {@render children()}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 5rem;
  }
</style>
