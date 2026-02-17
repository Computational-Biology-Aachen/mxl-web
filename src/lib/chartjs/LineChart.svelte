<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";
  import type { Attachment } from "svelte/attachments";

  let {
    data,
    yMin = 0,
    yMax,
    xScale = "linear",
    yScale = "linear",
    xLabel = "Time / unit",
    yLabel = "Amount / unit",
    loading = true,
    loadingDelay = 500,
  }: {
    data: ChartData;
    yMax: number | undefined;
    yMin?: number;
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    loadingDelay?: number;
  } = $props();

  // svelte-ignore state_referenced_locally
  let showLoadingSpinner = $state(loading);
  let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    if (loading) {
      loadingTimeout = setTimeout(() => {
        showLoadingSpinner = true;
      }, loadingDelay);
    } else {
      if (loadingTimeout !== null) {
        clearTimeout(loadingTimeout);
      }
      showLoadingSpinner = false;
    }
  });

  const myChart: Attachment = (canvas) => {
    let chart = new Chart(canvas as HTMLCanvasElement, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          // @ts-ignore
          x: {
            type: xScale,
            min: 0,
            title: {
              display: true,
              text: xLabel,
            },
            ticks: {
              format: {
                maximumFractionDigits: 2,
                maximumSignificantDigits: 2,
              },
            },
          },
          // @ts-ignore
          y: {
            type: yScale,
            beginAtZero: true,
            min: yMin,
            max: yMax,
            title: {
              display: true,
              text: yLabel,
            },
            ticks: {
              format: {
                maximumFractionDigits: 2,
                maximumSignificantDigits: 2,
              },
            },
          },
        },
        elements: {
          point: { radius: 0 },
        },
      },
    });

    return () => {
      if (chart) chart.destroy();
    };
  };
</script>

<div class="chart-container">
  {#if showLoadingSpinner}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading chart...</p>
    </div>
  {:else}
    <canvas {@attach myChart}></canvas>
  {/if}
</div>

<style>
  .chart-container {
    width: 100%;
    height: auto;
    min-height: 400px;
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    height: 100%;
  }

  .loading-container p {
    margin: 0;
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.95rem;
  }

  .spinner {
    animation: spin 1s linear infinite;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: var(--round);
    width: 40px;
    height: 40px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
