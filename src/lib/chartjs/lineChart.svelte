<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";

  let {
    data,
    yMin = 0,
    yMax = undefined,
    xScale = "linear",
    yScale = "linear",
    xLabel = "Time / unit",
    yLabel = "Amount / unit",
    loading = true,
    loadingDelay = 500,
  }: {
    data: ChartData;
    yMax?: number;
    yMin?: number;
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    loadingDelay?: number;
  } = $props();

  let showLoadingSpinner = $state(true);
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

  function makeChart(canvas: HTMLCanvasElement, data: any) {
    const chart = new Chart(canvas, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: xScale,
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

    return {
      update(data: any) {
        chart.data = data;
        chart.update("resize");
      },
      destroy() {
        if (chart) {
          chart.destroy();
        }
      },
    };
  }
</script>

<div class="chart-container">
  {#if showLoadingSpinner}
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading chart...</p>
    </div>
  {:else}
    <canvas use:makeChart={data}></canvas>
  {/if}
</div>

<style>
  .chart-container {
    width: 100%;
    min-height: 400px;
    height: auto;
    margin: 1rem 0;
    padding: 2rem;
    /* border: 1px solid #ccc; */
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 1rem;
  }

  .loading-container p {
    margin: 0;
    font-size: 0.95rem;
    color: rgba(0, 0, 0, 0.6);
  }

  .spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
