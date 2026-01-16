<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import Slider from "$lib/Slider.svelte";
  import {
    jsWorkerManager,
    pyWorkerManager,
    type WorkerManager,
  } from "$lib/stores/workerStore";
  import { onMount } from "svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  import { arrayColumn } from "$lib/utils";

  // Simulation constants
  const initialValues = [
    1.6999999999999997, 4.706348349506148, 3.9414515288091567,
    3.7761613271207324, 7.737821100836988, 0.5105293511676007,
    0.5000000001374878, 0.09090909090907397,
  ];
  const tEnd = 10.0;

  // Get shared workers
  const pyWorker = pyWorkerManager;
  const jsWorker = jsWorkerManager;

  // Simulation variables
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
  let ppfd = $state(100);
  let yLim = $state(8);

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

  function runSimulation() {
    backend.worker.postMessage({
      model: backend.model,
      initialValues: initialValues,
      tEnd: tEnd,
      pars: [ppfd],
      method: "LSODA",
    });
  }

  // Plot
  let lineData = $derived.by(() => {
    return {
      labels: result.time as number[],
      datasets: [
        {
          label: "ATP",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "Plastoquinone (oxidised)",
          data: arrayColumn(result.values, 1),
        },
        {
          label: "Plastocyanine (oxidised)",
          data: arrayColumn(result.values, 2),
        },
        {
          label: "Ferredoxin",
          data: arrayColumn(result.values, 3),
        },
        {
          label: "protons_lumen",
          data: arrayColumn(result.values, 4),
        },
        {
          label: "Light-harvesting complex",
          data: arrayColumn(result.values, 5),
        },
        {
          label: "PsbS (de-protonated)",
          data: arrayColumn(result.values, 6),
        },
        {
          label: "Violaxanthin",
          data: arrayColumn(result.values, 7),
        },
      ],
    };
  });
</script>

<h1>Non-photochemical quenching</h1>
<div>
  <Slider
    name="PPFD"
    bind:val={ppfd}
    callback={runSimulation}
    min="50.0"
    max="150.0"
    step="10"
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
