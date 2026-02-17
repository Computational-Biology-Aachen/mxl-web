<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "./chartjs/LineChart.svelte";
  import type { ModelBuilder } from "./model-editor/modelBuilder";
  import { pyWorkerManager, WorkerManager } from "./stores/workerStore";
  import { arrayColumn } from "./utils";

  let {
    model,
    tEnd,
    yMax,
  }: {
    model: ModelBuilder;
    tEnd: number;
    yMax?: number | undefined;
  } = $props();

  const pyWorker = pyWorkerManager;

  let loading = $state(true);
  let result = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });

  let currentRequestId = $state<string | null>(null);

  export function runSimulation(model: ModelBuilder) {
    loading = true;
    const requestId = WorkerManager.generateRequestId();
    currentRequestId = requestId;

    pyWorker.postMessage({
      model: `${model.buildPython([])}\nmodel`,
      initialValues: model.variables
        .values()
        .map((val) => {
          return val.value;
        })
        .toArray(),
      tEnd: tEnd,
      pars: [],
      method: "LSODA",
      requestId: requestId,
    });
  }

  // Plot
  let lineData = $derived.by(() => {
    return {
      labels: result.time as number[],
      datasets: model.variables
        .keys()
        .map((name, idx) => {
          return {
            label: name,
            data: arrayColumn(result.values, idx) as number[],
          };
        })
        .toArray(),
    };
  });

  onMount(() => {
    const unsubscribePy = pyWorker.onMessage((data) => {
      if (data.requestId === currentRequestId) {
        result = data;
        loading = false;
      }
    });

    // Initial run
    runSimulation(model);

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsubscribePy();
    };
  });
</script>

<div>
  <LineChart
    data={lineData}
    loading={loading}
    yMax={yMax}
  />
</div>

<style>
  div {
    width: 100%;
  }
</style>
