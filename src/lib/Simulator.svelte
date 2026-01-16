<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "./chartjs/lineChart.svelte";
  import Slider from "./Slider.svelte";
  import {
    jsWorkerManager,
    pyWorkerManager,
    WorkerManager,
  } from "./stores/workerStore";
  import { arrayColumn } from "./utils";

  let {
    modelJs,
    modelPy,
    pars,
    tEnd,
    variables,
    yLim = 100,
  }: {
    modelJs: string;
    modelPy: string;
    pars: {
      name: string;
      init: number;
      min: string;
      max: string;
      step: string;
      fixed?: boolean;
    }[];
    tEnd: number;
    variables: {
      name: string;
      init: number;
      min: string;
      max: string;
      step: string;
      fixed?: boolean;
    }[];
    yLim?: number;
  } = $props();

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
      backend: { worker: jsWorker, model: modelJs }, //
    },
    {
      name: "pyodide",
      backend: { worker: pyWorker, model: modelPy }, //
    },
  ]);

  let result = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });

  let localVariables = $state(variables.map((i) => i.init));
  let localPars = $state(pars.map((i) => i.init));
  let currentRequestId = $state<string | null>(null);

  function runSimulation() {
    const requestId = WorkerManager.generateRequestId();
    currentRequestId = requestId;

    backend.worker.postMessage({
      model: backend.model,
      initialValues: localVariables.slice(0, localVariables.length),
      tEnd: tEnd,
      pars: localPars.slice(0, localPars.length),
      method: "LSODA",
      requestId: requestId,
    });
  }

  function reset() {
    localVariables = variables.map((i) => i.init);
    localPars = pars.map((i) => i.init);

    runSimulation();
  }

  // Plot
  let lineData = $derived.by(() => {
    return {
      labels: result.time as number[],
      datasets: variables.map((i, idx) => {
        return {
          label: i.name,
          data: arrayColumn(result.values, idx) as number[],
        };
      }),
    };
  });

  onMount(() => {
    // Set up message handlers for this component
    const unsubscribePy = pyWorker.onMessage((data) => {
      // Only update if this message is for us
      if (data.requestId === currentRequestId) {
        result = data;
      }
    });

    const unsubscribeJs = jsWorker.onMessage((data) => {
      // Only update if this message is for us
      if (data.requestId === currentRequestId) {
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
</script>

<div class="row">
  <div>
    <label for="backend-select">Choose an integration backend:</label>
    <select id="backend-select" bind:value={backend} onchange={runSimulation}>
      {#each backends as item}
        <option value={item.backend}>
          {item.name}
        </option>
      {/each}
    </select>
  </div>
  <button onclick={reset}>Reset</button>
</div>

{#if pars.some((i) => i.fixed === undefined || !i.fixed)}
  <h3>Parameters</h3>
  <div class="grid-row">
    {#each pars as par, idx (par.name)}
      <Slider
        name={par.name}
        callback={runSimulation}
        bind:val={localPars[idx]}
        min={par.min}
        max={par.max}
        step={par.step}
      />
    {/each}
  </div>
{/if}

{#if variables.some((i) => i.fixed === undefined || !i.fixed)}
  <h3>Variables</h3>
  <div class="grid-row">
    {#each variables as { name, min, max, step, fixed }, idx}
      {#if fixed === undefined || !fixed}
        <Slider
          {name}
          callback={runSimulation}
          bind:val={localVariables[idx]}
          {min}
          {max}
          {step}
        />
      {/if}
    {/each}
  </div>
{/if}

<LineChart data={lineData} yMax={yLim} />

<style>
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
  }
</style>
