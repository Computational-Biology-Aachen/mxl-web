<script lang="ts">
  import { browser } from "$app/environment";
  import LineChart from "$lib/chartjs/lineChart.svelte";

  import Slider from "$lib/Slider.svelte";
  import { onMount } from "svelte";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  const initialValues = [10.0, 10.0];
  const tEnd = 100;
  const stepSize = 0.01;
  let alpha = $state(0.1);
  let beta = $state(0.02);
  let gamma = $state(0.4);
  let delta = $state(0.02);
  let yLim = $state(100);

  let worker: Worker | null = null;
  let result = $state({ time: [], values: [] });

  function runSimulation() {
    // Sadly we can't pass the function object to a web worker
    // so we have to define it **in** the worker.
    worker?.postMessage({
      initialValues: initialValues,
      tEnd: tEnd,
      stepSize: stepSize,
      pars: [alpha, beta, gamma, delta],
    });
  }
  let lineData = $derived.by(() => {
    return {
      labels: result.time as number[],
      datasets: [
        {
          label: "Prey",
          data: arrayColumn(result.values, 0) as number[],
        },
        {
          label: "Predator",
          data: arrayColumn(result.values, 1) as number[],
        },
      ],
    };
  });

  onMount(() => {
    // worker only in browser
    if (!browser) return;

    worker = new Worker(
      new URL("$lib/workers/lotka-volterra.worker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    worker.onmessage = (e: MessageEvent) => {
      result = e.data;
    };
    worker.onerror = (e) => {
      console.log(e);
    };

    // Initial run
    runSimulation();
    return () => worker?.terminate();
  });
</script>

<h1>Lotka-Volterra</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<div>
  <Slider
    name="Alpha"
    bind:val={alpha}
    callback={runSimulation}
    min="0.01"
    max="1.0"
    step="0.05"
  />
  <Slider
    name="Beta"
    bind:val={beta}
    callback={runSimulation}
    min="0.01"
    max="1.0"
    step="0.05"
  />
  <Slider
    name="Gamma"
    bind:val={gamma}
    callback={runSimulation}
    min="0.01"
    max="1.0"
    step="0.05"
  />
  <Slider
    name="Delta "
    bind:val={delta}
    callback={runSimulation}
    min="0.01"
    max="1.0"
    step="0.001"
  />
</div>
<LineChart data={lineData} yMax={yLim} />

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
