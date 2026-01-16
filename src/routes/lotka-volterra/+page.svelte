<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import Slider from "$lib/Slider.svelte";
  import {
    jsWorkerManager,
    pyWorkerManager,
    type WorkerManager,
  } from "$lib/stores/workerStore";
  import { arrayColumn } from "$lib/utils";
  import { onMount } from "svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  // Shared setup
  // Get shared workers
  const pyWorker = pyWorkerManager;
  const jsWorker = jsWorkerManager;
  let backend: { worker: WorkerManager; model: string } = $state({
    worker: jsWorker,
    model: "",
  });

  let backends: Array<{
    name: string;
    backend: { worker: WorkerManager; model: string };
  }> = $state([
    {
      name: "native",
      backend: { worker: jsWorker, model: modelJs.toString() },
    },
    { name: "pyodide", backend: { worker: pyWorker, model: modelPy } },
  ]);
  let result = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });
  // End shared setup

  // Simulation state
  const initialValues = [10.0, 10.0];
  const tEnd = 100;
  let alpha = $state(0.1);
  let beta = $state(0.02);
  let gamma = $state(0.4);
  let delta = $state(0.02);
  let yLim = $state(100);

  function runSimulation() {
    backend.worker.postMessage({
      model: backend.model,
      initialValues: initialValues,
      tEnd: tEnd,
      pars: [alpha, beta, gamma, delta],
      method: "LSODA",
    });
  }

  onMount(() => {
    // Set up message handlers for this component
    const unsubscribePy = pyWorker.onMessage((data) => {
      if (backend.worker === pyWorker) {
        result = data;
      }
    });

    const unsubscribeJs = jsWorker.onMessage((data) => {
      if (backend.worker === jsWorker) {
        result = data;
      }
    });

    // Set default backend
    backend = backends[1].backend;

    // Initial run
    runSimulation();

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsubscribePy();
      unsubscribeJs();
    };
  });

  // Plot
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

<label for="backend-select">Choose an integration backend:</label>
<select
  id="backend-select"
  bind:value={backend}
  onchange={() => {
    runSimulation();
  }}
>
  {#each backends as item}
    <option value={item.backend}>
      {item.name}
    </option>
  {/each}
</select>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
