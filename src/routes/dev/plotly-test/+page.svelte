<script lang="ts">
  import Plotly from "$lib/plotly/lineChart.svelte";
  import type { Data, Layout } from "plotly.js";

  let y2 = $state(1.0);
  let data: Data[] = $derived.by(() => {
    return [
      {
        x: [0, 1, 2, 3],
        y: [0, y2, 0.5, 2],
        type: "scatter",
        mode: "lines+markers",
        name: "Trace 1",
        line: { color: "rgb(219, 64, 82)" },
      },
    ];
  });

  const layout: Partial<Layout> = {
    title: {
      text: "Line Plot Example",
    },
    xaxis: { title: { text: "X Axis" } },
    yaxis: { title: { text: "Y Axis" } },
    margin: { t: 50, r: 50, b: 50, l: 50 },
  };
</script>

<h1>Plotly Line Plot</h1>
<div style="width: 100%; height: 500px;">
  <Plotly {data} {layout} />

  <label>
    <span>Y2</span>
    <input type="number" bind:value={y2} min="1.0" max="10.0" step="1.0" />
  </label>
</div>
