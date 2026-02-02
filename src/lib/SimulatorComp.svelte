<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "./chartjs/lineChart.svelte";
  import Slider from "./Slider.svelte";
  import {
    pyWorkerManager,
    pyWorkerManager2,
    WorkerManager,
  } from "./stores/workerStore";
  import { arrayColumn } from "./utils";

  import Math from "$lib/Math.svelte";

  let {
    modelPy1,
    modelPy2,
    pars,
    tEnd,
    variables,
    yLim = 100,
  }: {
    modelPy1: string;
    modelPy2: string;
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

  const pyWorker1 = pyWorkerManager;
  const pyWorker2 = pyWorkerManager2;
  const backend1 = { worker: pyWorker1, model: modelPy1 };
  const backend2 = { worker: pyWorker2, model: modelPy2 };

  let loading1 = $state(true);
  let loading2 = $state(true);
  let loading = $derived(loading1 && loading2);
  let result1 = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });
  let result2 = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });

  let localVariables = $state(variables.map((i) => i.init));
  let localPars = $state(pars.map((i) => i.init));
  let currentRequestId = $state<string | null>(null);

  function runSimulation() {
    loading1 = true;
    loading2 = true;
    const requestId = WorkerManager.generateRequestId();
    currentRequestId = requestId;

    backend1.worker.postMessage({
      model: backend1.model,
      initialValues: localVariables.slice(0, localVariables.length),
      tEnd: tEnd,
      pars: localPars.slice(0, localPars.length),
      method: "LSODA",
      requestId: requestId,
    });

    backend2.worker.postMessage({
      model: backend2.model,
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
  let lineData1 = $derived.by(() => {
    return {
      labels: result1.time as number[],
      datasets: variables.map((i, idx) => {
        return {
          label: i.name,
          data: arrayColumn(result1.values, idx) as number[],
        };
      }),
    };
  });

  let lineData2 = $derived.by(() => {
    return {
      labels: result2.time as number[],
      datasets: variables.map((i, idx) => {
        return {
          label: i.name,
          data: arrayColumn(result2.values, idx) as number[],
        };
      }),
    };
  });
  onMount(() => {
    // Set up message handlers for this component
    const unsubscribePy1 = pyWorker1.onMessage((data) => {
      // Only update if this message is for us
      if (data.requestId === currentRequestId) {
        result1 = data;
        loading1 = false;
      }
    });
    const unsubscribePy2 = pyWorker2.onMessage((data) => {
      // Only update if this message is for us
      if (data.requestId === currentRequestId) {
        result2 = data;
        loading2 = false;
      }
    });
    // Initial run
    runSimulation();

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsubscribePy1();
      unsubscribePy2();
    };
  });

  let tex1 = String.raw`\begin{align*}
\frac{dx}{dt} &= \alpha x - \beta xy \\
\frac{dy}{dt} &= -\gamma y + \delta xy
\end{align*}`;

  let tex2 = String.raw`\begin{align*}
\frac{dx}{dt} &= \alpha x \left(1 - \frac{x}{K}\right) - \beta xy \\
\frac{dy}{dt} &= -\gamma y + \delta xy
\end{align*}`;
</script>

<div class="row">
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

<div class="row2">
  <div>
    <Math tex={tex1} display={true} />
    <LineChart data={lineData1} yMax={yLim} {loading} />
  </div>
  <div>
    <Math tex={tex2} display={true} />
    <LineChart data={lineData2} yMax={yLim} {loading} />
  </div>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }
  .row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    align-items: center;
  }
</style>
