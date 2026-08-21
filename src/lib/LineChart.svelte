<!--
  @component

  A responsive Chart.js line chart for time-series data with configurable axes,
  optional shaded phase regions, a delayed loading spinner, and a comparison mode
  that overlays the first/last run as dashed reference lines.

  A local fork of `@computational-biology-aachen/design`'s LineChart, kept only
  for Fit.svelte's live-updating prediction/residual-norm charts: the upstream
  component destroys and recreates the whole Chart.js instance on every data
  change (its mount attachment reads `data` directly, so Svelte 5 re-runs the
  whole attachment body whenever a new `data` object arrives), which made a
  running fit's charts visibly jump on every progress tick. This fork instead
  creates the chart once and updates it in place. See mxl-web's Fit.svelte for
  the full context; this is scoped to mxl-web rather than fixed upstream so the
  behavior change doesn't ripple into every other consumer of the design
  package's LineChart before we're confident it's safe everywhere.

  ### Props

  - `data: ChartData`
    Chart.js line-chart data (labels + datasets).
  - `yMin?: number`, `yMax?: number`, `xMin?: number`, `xMax?: number`
    Axis bounds (`yMin` defaults to `0`).
  - `phases?: PhaseRegion[]`
    Background shaded regions (`{ start, end, color, label? }`).
  - `xScale?`, `yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries"`
    Axis scale types. Default `"linear"`.
  - `xLabel?: string`, `yLabel?: string`
    Axis titles.
  - `loading?: boolean`
    Show the loading spinner. Defaults to `true`.
  - `loadingDelay?: number`
    Delay (ms) before the spinner appears. Defaults to `500`.
  - `lineDisplay?: "current" | "last" | "first"`
    Comparison mode — overlay the first/last datasets as dashed references.
    Defaults to `"current"`.
  - `styleVars?: { chartHeight?: string }`
    Override the chart container height via CSS custom property.

  ### Example

  ```svelte
  <LineChart {data} yLabel="Concentration" loading={isRunning} />
  ```
-->
<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";
  import { untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";

  export interface PhaseRegion {
    start: number;
    end: number;
    color: string;
    label?: string;
  }

  type DS = Record<string, unknown>;

  let {
    data,
    yMin = 0,
    xMin = undefined,
    xMax = undefined,
    yMax = undefined,
    phases = [],
    xScale = "linear",
    yScale = "linear",
    xLabel = "Time / unit",
    yLabel = "Amount / unit",
    loading = true,
    loadingDelay = 500,
    lineDisplay = "current",
    styleVars = {},
  }: {
    data: ChartData;
    yMax?: number;
    yMin?: number;
    xMin?: number;
    xMax?: number;
    phases?: PhaseRegion[];
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    loadingDelay?: number;
    lineDisplay?: "current" | "last" | "first";
    styleVars?: {
      chartHeight?: string;
    };
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

  let chartInstance = $state<Chart | null>(null);
  let firstDatasets: ChartData["datasets"] | null = null;
  let lastDatasets: ChartData["datasets"] | null = null;

  let cssVars = $derived({
    ...(styleVars.chartHeight
      ? { "--line-chart-height": styleVars.chartHeight }
      : {}),
  });

  $effect(() => {
    const ch = chartInstance;
    if (!ch) return;

    const newDatasets = $state.snapshot(data.datasets) as ChartData["datasets"];
    const newLabels = data.labels;

    if (lineDisplay === "current") {
      ch.data.labels = newLabels as ChartData["labels"];
      ch.data.datasets = newDatasets;
      // "none": a tweened update() restarts its animation clock from 0 on
      // every call (Chart.js #6104), so back-to-back updates arriving faster
      // than the animation duration keep interrupting each other and the
      // points visibly snap back mid-tween instead of smoothly progressing.
      ch.update("none");
      return;
    }

    const snapshotCurrent = () =>
      (ch.data.datasets as unknown as DS[]).map((ds) => ({
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
      data: untrack(() => $state.snapshot(data)) as ChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          // @ts-expect-error chart.js scale config type is narrower than the dynamic scale value
          x: {
            type: xScale,
            min: xMin,
            max: xMax,
            title: { display: true, text: xLabel },
            ticks: {
              format: { maximumFractionDigits: 2, maximumSignificantDigits: 2 },
            },
          },
          // @ts-expect-error chart.js scale config type is narrower than the dynamic scale value
          y: {
            type: yScale,
            beginAtZero: true,
            min: yMin,
            max: yMax,
            title: { display: true, text: yLabel },
            ticks: {
              format: { maximumFractionDigits: 2, maximumSignificantDigits: 2 },
            },
          },
        },
        plugins: {
          legend: {
            labels: { filter: (item) => item.text !== "" },
          },
        },
        elements: { point: { radius: 0 } },
      },
    });

    chartInstance = chart;
    return () => {
      chart.destroy();
      chartInstance = null;
    };
  };
</script>

<div
  class="chart-container"
  style={Object.entries(cssVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}
>
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
    --line-chart-height: 300px;
    width: 100%;
    height: var(--line-chart-height);

    @media (min-width: 640px) {
      --line-chart-height: 400px;
    }
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
    border-radius: var(--radius-full);
    width: 40px;
    height: 40px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
