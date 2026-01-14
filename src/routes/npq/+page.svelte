<script lang="ts">
  import { browser } from "$app/environment";
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import Slider from "$lib/Slider.svelte";
  import { onMount } from "svelte";
  import { modelJs } from "./modelJs";
  import { modelPy } from "./modelPy";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  // Simulation constants
  const initialValues = [
    1.6999999999999997, 4.706348349506148, 3.9414515288091567,
    3.7761613271207324, 7.737821100836988, 0.5105293511676007,
    0.5000000001374878, 0.09090909090907397,
  ];
  const tEnd = 10.0;

  // Simulation variables
  let backend: { worker: Worker | null; model: string } = $state({
    worker: null,
    model: "",
  });

  let pyWorker: Worker | null = null;
  let jsWorker: Worker | null = null;

  let backends: Array<{
    name: string;
    backend: { worker: Worker | null; model: string };
  }> = $state([]);

  let result = $state({ time: [], values: [] });
  let ppfd = $state(100);
  let yLim = $state(8);

  onMount(() => {
    // worker only in browser
    if (!browser) return;

    pyWorker = new Worker(
      new URL("$lib/workers/pyWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    pyWorker.onmessage = (e: MessageEvent) => {
      result = e.data;
    };
    pyWorker.onerror = (e: ErrorEvent) => {
      console.log(e);
    };

    jsWorker = new Worker(
      new URL("$lib/workers/jsWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );
    jsWorker.onmessage = (e: MessageEvent) => {
      result = e.data;
    };
    jsWorker.onerror = (e: ErrorEvent) => {
      console.log(e);
    };
    jsWorker;

    backends = [
      {
        name: "native",
        backend: { worker: jsWorker, model: modelJs.toString() },
      },
      { name: "pyodide", backend: { worker: pyWorker, model: modelPy } },
    ];

    // Set default backend
    backend = backends[1].backend;

    // Initial run
    runSimulation();

    // Cleanup
    return () => {
      pyWorker?.terminate();
      jsWorker?.terminate();
    };
  });

  function runSimulation() {
    backend.worker?.postMessage({
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
  <select
    bind:value={backend}
    onchange={() => {
      runSimulation();
    }}
  >
    <option value="" disabled selected>backend</option>
    {#each backends as item}
      <option value={item.backend}>
        {item.name}
      </option>
    {/each}
  </select>
</div>
<LineChart data={lineData} yMax={yLim} />

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
