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
  let r_p = $state(0.4); // intrinsic growth (Public, P)
  let r_m = $state(0.2); // intrinsic growth (Private, M)
  let alpha = $state(0.0002); // cooperation: P→C
  let beta = $state(0.0001); // competition: P↔M
  let eta = $state(0.0001); // density constraint for P
  let gamma = $state(0.0001); // density constraint for M
  let nu = $state(0.00001); // density constraint for C
  let p0 = $state(1.0); // Public metabolizers (P)
  let c0 = $state(1.0); // Cheaters (C)
  let m0 = $state(1.0); // Private metabolizers (M)
  let tEnd = $state(100);
  let yLim = undefined;

  function runSimulation() {
    backend.worker.postMessage({
      model: backend.model,
      initialValues: [p0, c0, m0],
      tEnd: tEnd,
      pars: [r_p, r_m, alpha, beta, eta, gamma, nu],
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

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        {
          label: "Public",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "Cheaters",
          data: arrayColumn(result.values, 1),
        },
        {
          label: "Private",
          data: arrayColumn(result.values, 2),
        },
      ],
    };
  });
</script>

<h1>Tripartite dynamics dynamics</h1>

<div class="grid-row">
  <span>Initial conditions & settings</span>
  <div class="inner-row">
    <Slider
      name="Public"
      bind:val={p0}
      callback={runSimulation}
      min="0.0"
      max="10000.0"
      step="1"
    />
    <Slider
      name="Cheaters"
      bind:val={c0}
      callback={runSimulation}
      min="0.0"
      max="10000.0"
      step="1"
    />
    <Slider
      name="Private"
      bind:val={m0}
      callback={runSimulation}
      min="0.0"
      max="10000.0"
      step="1"
    />
    <Slider
      name="Simulate until t"
      bind:val={tEnd}
      callback={runSimulation}
      min="1.0"
      max="10000.0"
      step="10"
    />
  </div>
</div>

<div class="grid-row">
  <span>Public (P)</span>
  <div class="inner-row">
    <Slider
      name="r_p (growth rate)"
      bind:val={r_p}
      callback={runSimulation}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
    <Slider
      name="η (density)"
      bind:val={eta}
      callback={runSimulation}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
  </div>
</div>

<div class="grid-row">
  <span>Cheaters (C)</span>
  <div class="inner-row">
    <Slider
      name="ν (density)"
      bind:val={nu}
      callback={runSimulation}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
  </div>
</div>
<div class="grid-row">
  <span>Private (M)</span>
  <div class="inner-row">
    <Slider
      name="r_m (growth rate)"
      bind:val={r_m}
      callback={runSimulation}
      min="0.0"
      max="5.0"
      step="0.0001"
    />
    <Slider
      name="γ (density)"
      bind:val={gamma}
      callback={runSimulation}
      min="0.0"
      max="5.0"
      step="0.0001"
    />
  </div>
</div>
<div class="grid-row">
  <span>Interaction</span>
  <div class="inner-row">
    <Slider
      name="α (P→C cooperation)"
      bind:val={alpha}
      callback={runSimulation}
      min="0.0"
      max="1.0"
      step="0.0001"
    />
    <Slider
      name="β (P↔M competition)"
      bind:val={beta}
      callback={runSimulation}
      min="0.0"
      max="1.0"
      step="0.0001"
    />
  </div>
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
  span {
    font-size: 0.8rem;
    font-weight: 700;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 5rem 1fr;
  }
  .inner-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10rem);
    align-items: center;
    gap: 0 1rem;
  }
</style>
