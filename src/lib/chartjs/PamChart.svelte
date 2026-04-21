<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";
  import type { Attachment } from "svelte/attachments";

  export interface PhaseRegion {
    start: number;
    end: number;
    color: string;
    label?: string;
  }

  let {
    data,
    yMin = 0,
    xMin = undefined,
    xMax = undefined,
    yMax,
    phases = [],
    xScale = "linear",
    yScale = "linear",
    xLabel = "Time / unit",
    yLabel = "Amount / unit",
    loading = true,
    lineDisplay,
  }: {
    data: ChartData;
    yMax: number | undefined;
    phases?: PhaseRegion[];
    yMin?: number;
    xMin?: number;
    xMax?: number;
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    lineDisplay: "current" | "last" | "first";
  } = $props();

  const showLoadingSpinner = $derived(loading);

  let chartInstance = $state<Chart | null>(null);
  let prevDatasets: ChartData["datasets"] | null = null;

  $effect(() => {
    if (lineDisplay === "current") return;
    const ch = chartInstance;
    if (!ch) return;

    const newDatasets = $state.snapshot(data.datasets) as ChartData["datasets"];
    const newLabels = data.labels;

    if (prevDatasets === null) {
      prevDatasets = (
        ch.data.datasets as unknown as Record<string, unknown>[]
      ).map((ds) => ({ ...ds })) as unknown as ChartData["datasets"];
      return;
    }

    type DS = Record<string, unknown>;
    const coloredNewDatasets = newDatasets.map((ds, i) => {
      const prev = prevDatasets![i] as unknown as DS;
      return {
        ...(ds as unknown as DS),
        borderColor: prev?.borderColor,
        backgroundColor: prev?.backgroundColor,
      };
    });

    const dashedDatasets = prevDatasets.map((ds) => ({
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

    // Keep updating to last simulation if this is set
    if (lineDisplay === "last") {
      prevDatasets = coloredNewDatasets as unknown as ChartData["datasets"];
    }
  });

  // Custom plugin for background phase shading + labels
  const phaseShadingPlugin = {
    id: "phaseShading",
    beforeDraw(ch: Chart) {
      if (!phases.length) return;
      const { ctx, chartArea, scales } = ch;
      if (!chartArea || !scales.x) return;
      const { left, right, top, bottom } = chartArea;
      const height = bottom - top;

      ctx.save();
      ctx.beginPath();
      ctx.rect(left, top, right - left, height);
      ctx.clip();

      for (const phase of phases) {
        const xStart = Math.max(scales.x.getPixelForValue(phase.start), left);
        const xEnd = Math.min(scales.x.getPixelForValue(phase.end), right);
        if (xEnd <= xStart) continue;

        ctx.fillStyle = phase.color;
        ctx.fillRect(xStart, top, xEnd - xStart, height);

        if (phase.label && phase.end > phase.start) {
          const midX = (xStart + xEnd) / 2;
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.font = "11px system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(phase.label, midX, top + 14);
        }
      }

      ctx.restore();
    },
  };

  const myChart: Attachment = (canvas) => {
    const chart = new Chart(canvas as HTMLCanvasElement, {
      type: "line",
      plugins: [phaseShadingPlugin],
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
