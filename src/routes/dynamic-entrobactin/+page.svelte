<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import Math from "$lib/Math.svelte";
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
  let mu_e = $state(0.4);
  let mu_c = $state(0.3);
  let a_e = $state(6.0);
  let a_c = $derived(10 - a_e);
  let K_e = $state(0.5);
  let K_c = $state(0.5);
  let theta = $state(0.001);
  let r_prod = $state(0.2);
  let r_cons_e = $state(1.0);
  let r_cons_c = $state(1.0);
  // Initial conditions
  let e0 = $state(5.0);
  let c0 = $state(5.0);
  let b0 = $state(1.0);
  // Simulation settings
  let tEnd = $state(100);
  let yMax = undefined;

  function runSimulation() {
    backend.worker.postMessage({
      model: backend.model,
      initialValues: [e0, c0, b0],
      tEnd: tEnd,
      pars: [mu_e, mu_c, a_e, a_c, K_e, K_c, theta, r_prod, r_cons_e, r_cons_c],
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
      labels: result.time,
      datasets: [
        { label: "E. coli (E)", data: arrayColumn(result.values, 0) },
        { label: "C. glutamicum (C)", data: arrayColumn(result.values, 1) },
        { label: "Enterobactin (B)", data: arrayColumn(result.values, 2) },
      ],
    };
  });

  const eqE = String.raw`\frac{dE}{dt}=\mu_E\,\frac{a_E\,B}{K_E+B}\,E-\delta_E\,E`;
  const eqC = String.raw`\frac{dC}{dt}=\mu_C\,\frac{a_C\,B}{K_C+B}\,C-\theta\,C^2`;
  const eqB = String.raw`\frac{dB}{dt}=r_{\text{prod}}\,E - r_{\text{cons,E}}\!\left(\mu_E\,\frac{a_E\,B}{K_E+a_E\,B}\,E\right) - r_{\text{cons,C}}\!\left(\mu_C\,\frac{a_C\,B}{K_C+a_C\,B}\,C\right)`;
</script>

<h1>Dynamic-Entrobactin</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqE} display />
  <Math tex={eqC} display />
  <Math tex={eqB} display />
</section>

<h3>Initial conditions & settings</h3>
<div class="row">
  <Slider
    name="E. coli"
    bind:val={e0}
    callback={runSimulation}
    min="0.0"
    max="1000.0"
    step="1"
  />
  <Slider
    name="C. glutamicum"
    bind:val={c0}
    callback={runSimulation}
    min="0.0"
    max="1000.0"
    step="1"
  />
  <Slider
    name="Enterobactin (B₀)"
    callback={runSimulation}
    bind:val={b0}
    min="0.0"
    max="1000.0"
    step="0.5"
  />
  <Slider
    name="Simulate until"
    callback={runSimulation}
    bind:val={tEnd}
    min="1.0"
    max="10000.0"
    step="1"
  />
</div>

<div class="row">
  <Slider
    name="E. coli growth rate (μ_E)"
    bind:val={mu_e}
    callback={runSimulation}
    min="0.0"
    max="2.0"
    step="0.01"
  />
  <Slider
    name="E. coli affinity (a_E)"
    bind:val={a_e}
    callback={runSimulation}
    min="0.0"
    max="10.0"
    step="0.1"
  />
  <Slider
    name="C. glut growth rate (μ_C)"
    bind:val={mu_c}
    callback={runSimulation}
    min="0.0"
    max="2.0"
    step="0.01"
  />
  <Slider
    name="C. glut affinity (a_C = 1 - a_E)"
    bind:val={a_c}
    callback={runSimulation}
    min="0.0"
    max="1.0"
    step="0.01"
    disabled
  />
</div>

<div class="row">
  <Slider
    name="K_E (half-sat E)"
    bind:val={K_e}
    callback={runSimulation}
    min="0.00000001"
    max="1.0"
    step="0.000001"
  />
  <Slider
    name="K_C (half-sat C)"
    bind:val={K_c}
    callback={runSimulation}
    min="0.00000001"
    max="1.0"
    step="0.000001"
  />
  <Slider
    name="C density loss (θ)"
    bind:val={theta}
    callback={runSimulation}
    min="0.0"
    max="1.0"
    step="0.0001"
  />
</div>

<div class="row">
  <Slider
    name="B production by E (r_prod)"
    bind:val={r_prod}
    callback={runSimulation}
    min="0.0"
    max="5.0"
    step="0.0001"
  />
  <Slider
    name="B consumption weight E (r_cons,E)"
    bind:val={r_cons_e}
    callback={runSimulation}
    min="0.0"
    max="5.0"
    step="0.0001"
  />
  <Slider
    name="B consumption weight C (r_cons,C)"
    bind:val={r_cons_c}
    callback={runSimulation}
    min="0.0"
    max="5.0"
    step="0.0001"
  />
</div>

<LineChart data={lineData} {yMax} />

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
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
