<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "../chartjs/LineChart.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import { WorkerManager, type WorkerMessage } from "../stores/workerStore";
  import { arrayColumn } from "../utils";

  let {
    model,
    tEnd,
    yMax,
    timeoutInSeconds,
    method,
    showDerived = false,
  }: {
    model: ModelBuilder;
    tEnd: number;
    yMax?: number | undefined;
    timeoutInSeconds: number;
    method: string;
    showDerived?: boolean;
  } = $props();

  const pyWorker = pyWorkerPool;

  let loading = $state(true);
  let err: string | undefined = $state(undefined);
  let result = $state<{ time: number[]; values: number[][] }>({
    time: [],
    values: [],
  });

  let currentRequestId = $state<string | null>(null);
  let timeoutInSecondsId = $state<ReturnType<typeof setTimeout> | null>(null);

  export function runSimulation(model: ModelBuilder) {
    loading = true;
    const requestId = WorkerManager.generateRequestId();
    currentRequestId = requestId;

    // Clear any existing timeoutInSeconds
    if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    err = undefined;

    // Set a timeoutInSeconds for the request
    timeoutInSecondsId = setTimeout(() => {
      if (currentRequestId === requestId) {
        err = "Simulation timed out";
        loading = false;
      }
    }, timeoutInSeconds * 1000);

    const built = model.buildPython([]);

    pyWorker.postMessage({
      model: `${built}\nmodel`,
      derived: `${built}\nderived`,
      initialValues: model.variables
        .values()
        .map((val) => {
          return val.value;
        })
        .toArray(),
      tEnd: tEnd,
      pars: [],
      method: method,
      requestId: requestId,
      calculateDerived: showDerived,
    });
  }

  let lineData = $derived.by(() => {
    const nVars = model.variables.size;
    const varDatasets = model.variables
      .keys()
      .map((name, idx) => ({
        label: model.variables.get(name)?.displayName ?? name,
        data: arrayColumn(result.values, idx) as number[],
      }))
      .toArray();

    if (!showDerived)
      return { labels: result.time as number[], datasets: varDatasets };

    const derivedDatasets = model.sortDependencies().map((name, i) => {
      const label =
        model.assignments.get(name)?.displayName ??
        model.reactions.get(name)?.displayName ??
        name;
      return { label, data: arrayColumn(result.values, nVars + i) as number[] };
    });

    return {
      labels: result.time as number[],
      datasets: [...varDatasets, ...derivedDatasets],
    };
  });

  function handleResults(data: WorkerMessage) {
    if (data.requestId === currentRequestId) {
      // Clear the timeoutInSeconds since we got a response
      if (timeoutInSecondsId) {
        clearTimeout(timeoutInSecondsId);
        timeoutInSecondsId = null;
      }

      if (data.message !== undefined) {
        err = data.message;
      } else {
        result = { time: data.time, values: data.values };
        loading = false;
      }
    }
  }

  onMount(() => {
    const unsub = pyWorker.onMessage(handleResults);

    // Initial run
    runSimulation(model);

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsub();
      // Clean up any pending timeoutInSeconds
      if (timeoutInSecondsId) {
        clearTimeout(timeoutInSecondsId);
      }
    };
  });
</script>

<div>
  {#if err}
    <span>{err}</span>
  {:else}
    <LineChart
      data={lineData}
      loading={loading}
      yMax={yMax}
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
