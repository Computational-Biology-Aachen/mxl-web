<script lang="ts">
  import * as config from "$lib/config";
  import "../app.css";

  import { base } from "$app/paths";
  import favicon from "$lib/assets/cpbl-favicon.svg";
  import BuildChooser from "$lib/BuildChooser.svelte";
  import {
    Button,
    CollapseToBurger,
    Imprint,
    Navbar,
    NavGH,
    NavItem,
  } from "@computational-biology-aachen/design";

  let { children } = $props();
</script>

<!-- SEO -->
<svelte:head>
  <title>mxlweb</title>
  <meta
    name="description"
    content={config.description}
  />
  <meta
    property="og:title"
    content={config.title}
  />
  <meta
    property="og:description"
    content={config.description}
  />
  <meta
    property="og:url"
    content={config.url}
  />
  <meta
    property="og:type"
    content="website"
  />
  <meta
    name="twitter:card"
    content="summary"
  />
  <link
    rel="icon"
    href={favicon}
  />
</svelte:head>

<Navbar>
  {#snippet brand()}
    <div class="brand">
      <svg
        fill="none"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          clip-rule="evenodd"
          d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
          fill="currentColor"
          fill-rule="evenodd"
        ></path>
        <path
          clip-rule="evenodd"
          d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
          fill="currentColor"
          fill-rule="evenodd"
        ></path>
      </svg>
      <span>mxlweb</span>
    </div>
  {/snippet}
  <CollapseToBurger collapseAt="512px">
    <NavItem href="{base}/">Home</NavItem>
    <NavItem href="{base}/models">Models</NavItem>

    <Button
      variant="secondary"
      popovertarget="build-chooser">Build your own</Button
    >
  </CollapseToBurger>
  <NavGH href="https://github.com/Computational-Biology-Aachen/mxl-web" />
</Navbar>

{@render children()}

<Imprint github="https://github.com/Computational-Biology-Aachen/mxl-web" />

<!-- Global popup due to nav -->
<BuildChooser />

<style>
  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    font-weight: 600;
  }

  .brand svg {
    width: 1.5rem;
    height: 1.5rem;
  }
</style>
