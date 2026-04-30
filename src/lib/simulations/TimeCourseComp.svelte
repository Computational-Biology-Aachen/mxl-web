<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "../chartjs/LineChart.svelte";
  import Slider from "../Slider.svelte";

  import { arrayColumn } from "../utils";

  import Math from "$lib/Math.svelte";
  import { pyWorkerPool } from "$lib/stores/workerPool";
  import { WorkerManager } from "../stores/workerStore";

  const pyWorker = pyWorkerPool;

  let {
    modelPy1,
    modelPy2,
    pars,
    tEnd,
    variables,
    method,
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
    method: string;
  } = $props();

  let loading1 = $state(true);
  let loading2 = $state(true);
  let loading = $derived(loading1 || loading2);
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
  let currentRequestId1 = $state<string | null>(null);
  let currentRequestId2 = $state<string | null>(null);

  function runSimulation() {
    loading1 = true;
    loading2 = true;
    const requestId1 = WorkerManager.generateRequestId();
    const requestId2 = WorkerManager.generateRequestId();
    currentRequestId1 = requestId1;
    currentRequestId2 = requestId2;

    pyWorker.postMessage({
      model: modelPy1,
      derived: "",
      initialValues: localVariables.slice(0, localVariables.length),
      tEnd: tEnd,
      pars: localPars.slice(0, localPars.length),
      method: method,
      requestId: requestId1,
      nTimePoints: 100,
      calculateDerived: false,
    });

    pyWorker.postMessage({
      model: modelPy2,
      derived: "",
      initialValues: localVariables.slice(0, localVariables.length),
      tEnd: tEnd,
      pars: localPars.slice(0, localPars.length),
      method: method,
      requestId: requestId2,
      nTimePoints: 100,
      calculateDerived: false,
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
    const unsubscribePy = pyWorker.onMessage((data) => {
      if (data.requestId === currentRequestId1) {
        result1 = data;
        loading1 = false;
      } else if (data.requestId === currentRequestId2) {
        result2 = data;
        loading2 = false;
      }
    });

    // Initial run
    runSimulation();

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsubscribePy();
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
          name={name}
          callback={runSimulation}
          bind:val={localVariables[idx]}
          min={min}
          max={max}
          step={step}
        />
      {/if}
    {/each}
  </div>
{/if}

<div class="row2">
  <div>
    <Math
      tex={tex1}
      display={true}
    />
    <LineChart
      data={lineData1}
      yMax={yLim}
      loading={loading}
      lineDisplay="current"
    />
  </div>
  <div>
    <Math
      tex={tex2}
      display={true}
    />
    <LineChart
      data={lineData2}
      yMax={yLim}
      loading={loading}
      lineDisplay="current"
    />
  </div>
</div>

<style>
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
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
