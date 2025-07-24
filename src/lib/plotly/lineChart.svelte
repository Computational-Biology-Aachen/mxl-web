<script lang="ts">
  import { browser } from "$app/environment";
  import type { Config, Data, Layout } from "plotly.js";
  import { onMount } from "svelte";

  let {
    data,
    layout = {},
    config = {},
  }: {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
  } = $props();

  let plotDiv: HTMLDivElement;
  let Plotly: any;
  let loaded = $state(false);

  onMount(() => {
    console.log("Plotly component mounted with data:", data);

    if (browser && plotDiv) {
      // Dynamically import Plotly only in the browser
      import("plotly.js-dist-min")
        .then((plotlyModule) => {
          Plotly = plotlyModule.default;
          console.log("Creating initial plot with data:", data);
          loaded = true;
          return Plotly.newPlot(plotDiv, data, layout, config);
        })
        .catch((error) => {
          console.error("Failed to load Plotly:", error);
        });

      return () => {
        if (plotDiv && Plotly) {
          Plotly.purge(plotDiv);
        }
      };
    }
  });

  $effect(() => {
    if (loaded) {
      Plotly.react(plotDiv, data, layout, config);
    }
  });
</script>

<div bind:this={plotDiv}></div>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>
