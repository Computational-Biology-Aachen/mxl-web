<script lang="ts">
  import Chart, { type ChartData } from "chart.js/auto";

  let {
    data,
    yLim,
    xScale = "linear",
    yScale = "linear",
  }: {
    data: ChartData;
    yLim?: number;
    xScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
    yScale?: "linear" | "logarithmic" | "category" | "time" | "timeseries";
  } = $props();

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
              text: "Time / unit",
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
            max: yLim,
            title: {
              display: true,
              text: "Amount / unit",
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
  <canvas use:makeChart={data}></canvas>
</div>

<style>
  .chart-container {
    width: 100%;
    min-height: 400px;
    height: auto;
    margin: 1rem 0;
    padding: 2rem;
    border: 1px solid #ccc;
  }

  canvas {
    max-width: 100%;
    max-height: 100%;
  }
</style>
