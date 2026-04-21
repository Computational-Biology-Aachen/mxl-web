<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";
  import type { Attachment } from "svelte/attachments";

  type DS = Record<string, unknown>;

  let {
    data,
    yMin = 0,
    xMin = undefined,
    xMax = undefined,
    yMax,
    xScale = "linear",
    yScale = "linear",
    xLabel = "Time / unit",
    yLabel = "Amount / unit",
    loading = true,
    loadingDelay = 500,
    lineDisplay,
  }: {
    data: ChartData;
    yMax: number | undefined;
    yMin?: number;
    xMin?: number;
    xMax?: number;
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    loadingDelay?: number;
    lineDisplay: "current" | "last" | "first";
  } = $props();

  let chartInstance = $state<Chart | null>(null);
  let firstDatasets: ChartData["datasets"] | null = null;
  let lastDatasets: ChartData["datasets"] | null = null;

  $effect(() => {
    console.log("lineDisplay", $state.snapshot(lineDisplay));

    const ch = chartInstance;
    if (!ch) return;

    if (lineDisplay === "current") return;

    const newDatasets = $state.snapshot(data.datasets) as ChartData["datasets"];
    const newLabels = data.labels;

    const snapshotCurrent = () =>
      (ch.data.datasets as unknown as Record<string, unknown>[]).map((ds) => ({
        ...ds,
      })) as unknown as ChartData["datasets"];

    if (firstDatasets === null) {
      firstDatasets = snapshotCurrent();
      lastDatasets = firstDatasets;
      return;
    }

    const referenceDatasets =
      lineDisplay === "first" ? firstDatasets : lastDatasets!;

    const coloredNewDatasets = newDatasets.map((ds, i) => {
      const ref = referenceDatasets[i] as unknown as DS;
      return {
        ...(ds as unknown as DS),
        borderColor: ref?.borderColor,
        backgroundColor: ref?.backgroundColor,
      };
    });

    const dashedDatasets = referenceDatasets.map((ds) => ({
      ...(ds as unknown as DS),
      borderDash: [6, 4],
      label: "",
    }));

    ch.data.labels = newLabels as ChartData["labels"];
    ch.data.datasets = [
      ...coloredNewDatasets,
      ...dashedDatasets,
    ] as unknown as ChartData["datasets"];
    ch.update("none");

    lastDatasets = coloredNewDatasets as unknown as ChartData["datasets"];
  });

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
    const chart = new Chart(canvas as HTMLCanvasElement, {
      type: "line",
      data: $state.snapshot(data) as ChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          // @ts-ignore
          x: {
            type: xScale,
            min: xMin,
            max: xMax,
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
        plugins: {
          legend: {
            labels: {
              filter: (item) => item.text !== "",
            },
          },
        },
        elements: {
          point: { radius: 0 },
        },
      },
    });

    chartInstance = chart;
    return () => {
      chart.destroy();
      chartInstance = null;
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
