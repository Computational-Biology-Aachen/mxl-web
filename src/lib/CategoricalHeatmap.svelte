<!--
  @component

  A 2D categorical heatmap: each grid cell is filled with one of a small set
  of named colors (like matplotlib `imshow` + `ListedColormap`), not a
  continuous colorscale. Built on Chart.js, following `LineChart.svelte`'s
  conventions — a `scatter` chart with no visible dataset (just real
  linear x/y scales for free ticks/axis-titles), and a custom plugin that
  fills each cell as a rectangle centered on its `xValues`/`yValues` point.

  ### Props

  - `grid: (number | null)[][]`
    `grid[rowIdx][colIdx]` is an index into `categories`, or `null` for a
    not-yet-computed cell (left unfilled).
  - `xValues: number[]`, `yValues: number[]`
    Evenly-spaced column/row center coordinates.
  - `categories: { label: string; color: string }[]`
    The full, index-aligned category list — `grid`'s cell values are indices
    into this exact array, so pass every category here (don't pre-filter:
    that would desync the indices). The legend below the chart
    automatically only lists categories actually present in `grid`.
  - `xLabel?: string`, `yLabel?: string`
    Axis titles.
  - `loading?: boolean`
    Show the loading spinner. Defaults to `false`.
  - `styleVars?: { chartHeight?: string }`
    Override the chart container height via CSS custom property.

  ### Example

  ```svelte
  <CategoricalHeatmap
    {grid}
    xValues={growthRates}
    yValues={phValues}
    categories={[{ label: "Public dominance", color: "green" }, ...]}
    xLabel="Growth rate (h⁻¹)"
    yLabel="pH"
  />
  ```
-->
<script lang="ts">
  import Chart from "chart.js/auto";
  import type { Attachment } from "svelte/attachments";
  import { toStyleString } from "./utils";

  let {
    grid,
    xValues,
    yValues,
    categories,
    xLabel = "",
    yLabel = "",
    loading = false,
    loadingDelay = 500,
    styleVars = {},
  }: {
    grid: (number | null)[][];
    xValues: number[];
    yValues: number[];
    categories: { label: string; color: string }[];
    xLabel?: string;
    yLabel?: string;
    loading?: boolean;
    loadingDelay?: number;
    styleVars?: { chartHeight?: string };
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
      if (loadingTimeout !== null) clearTimeout(loadingTimeout);
      showLoadingSpinner = false;
    }
  });

  let cssVars = $derived({
    ...(styleVars.chartHeight
      ? { "--categorical-heatmap-height": styleVars.chartHeight }
      : {}),
  });

  let legendCategories = $derived(
    categories.filter((_, idx) => grid.some((row) => row.includes(idx))),
  );

  function halfStep(values: number[]): number {
    if (values.length < 2) return 0.5;
    return Math.abs(values[1] - values[0]) / 2;
  }

  let chartInstance = $state<Chart | null>(null);
  let redrawScheduled = false;

  $effect(() => {
    // Re-draw whenever the grid contents change — the plugin reads `grid`
    // directly (see gridPlugin below), so this effect exists purely to
    // trigger that redraw as new cells are classified. A caller streaming
    // in results one at a time (e.g. one per finished simulation) can
    // mutate `grid` far faster than the display needs to refresh, so this
    // coalesces any number of mutations within a frame into one redraw.
    void grid;
    if (!chartInstance || redrawScheduled) return;
    redrawScheduled = true;
    requestAnimationFrame(() => {
      redrawScheduled = false;
      chartInstance?.update("none");
    });
  });

  const gridPlugin = {
    id: "categoricalGrid",
    beforeDraw(ch: Chart) {
      const { ctx, chartArea, scales } = ch;
      if (!chartArea || !scales.x || !scales.y) return;
      const hx = halfStep(xValues);
      const hy = halfStep(yValues);

      ctx.save();
      ctx.beginPath();
      ctx.rect(
        chartArea.left,
        chartArea.top,
        chartArea.right - chartArea.left,
        chartArea.bottom - chartArea.top,
      );
      ctx.clip();

      grid.forEach((row, i) => {
        const y = yValues[i];
        if (y === undefined) return;
        const yTop = scales.y.getPixelForValue(y + hy);
        const yBottom = scales.y.getPixelForValue(y - hy);
        row.forEach((catIdx, j) => {
          if (catIdx === null || catIdx === undefined) return;
          const x = xValues[j];
          if (x === undefined) return;
          const category = categories[catIdx];
          if (!category) return;
          const xLeft = scales.x.getPixelForValue(x - hx);
          const xRight = scales.x.getPixelForValue(x + hx);
          ctx.fillStyle = category.color;
          ctx.fillRect(xLeft, yTop, xRight - xLeft, yBottom - yTop);
        });
      });

      ctx.restore();
    },
  };

  const myChart: Attachment = (canvas) => {
    const xMin = Math.min(...xValues) - halfStep(xValues);
    const xMax = Math.max(...xValues) + halfStep(xValues);
    const yMin = Math.min(...yValues) - halfStep(yValues);
    const yMax = Math.max(...yValues) + halfStep(yValues);

    const chart = new Chart(canvas as HTMLCanvasElement, {
      type: "scatter",
      plugins: [gridPlugin],
      data: { datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
          x: {
            type: "linear",
            min: xMin,
            max: xMax,
            title: { display: !!xLabel, text: xLabel },
          },
          y: {
            type: "linear",
            min: yMin,
            max: yMax,
            title: { display: !!yLabel, text: yLabel },
          },
        },
        plugins: {
          legend: { display: false },
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

<div
  class="heatmap-container"
  style={toStyleString(cssVars)}
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
<ul class="legend">
  {#each legendCategories as category (category.label)}
    <li>
      <span
        class="swatch"
        style:background-color={category.color}
      ></span>
      {category.label}
    </li>
  {/each}
</ul>

<style>
  .heatmap-container {
    --categorical-heatmap-height: 400px;
    width: 100%;
    height: var(--categorical-heatmap-height);
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
  }

  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.25rem;
    margin: 0.75rem 0 0;
    padding: 0;
    list-style: none;
  }

  .legend li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
  }

  .swatch {
    display: inline-block;
    flex-shrink: 0;
    border-radius: var(--radius-small, 2px);
    width: 0.9rem;
    height: 0.9rem;
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

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
</style>
