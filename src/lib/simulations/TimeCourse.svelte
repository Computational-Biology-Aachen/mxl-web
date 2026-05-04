<!--
 @component
 Time course (simulation over time)
-->

<script lang="ts">
  import { onMount } from "svelte";
  import LineChart from "../chartjs/LineChart.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import {
    WorkerManager,
    type SimulationError,
    type SimulationResult,
  } from "../stores/workerStore";
  import { arrayColumn } from "../utils";
  import SimErrDisplay from "./SimErrDisplay.svelte";

  let {
    model,
    tEnd,
    yMax,
    timeoutInSeconds,
    method,
    showDerived = false,
    selectedKeys = undefined,
    normalizedKeys = undefined,
    nTimePoints,
    lineDisplay,
  }: {
    model: ModelBuilder;
    tEnd: number;
    yMax?: number | undefined;
    timeoutInSeconds: number;
    method: string;
    showDerived?: boolean;
    selectedKeys?: string[];
    normalizedKeys?: string[];
    nTimePoints: number;
    lineDisplay: "current" | "last" | "first";
  } = $props();

  const pyWorker = pyWorkerPool;

  let loading = $state(true);
  let err: SimulationError | undefined = $state(undefined);
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
        err = {
          message: "Simulation timed out",
          hints: ["Increase the simulation timeout via the ≡ menu"],
        };
        loading = false;
      }
    }, timeoutInSeconds * 1000);

    const order = model.sortDependencies();
    const allDerived = new Set(order);
    const derivedSelection =
      showDerived && selectedKeys
        ? selectedKeys.filter((k) => allDerived.has(k))
        : undefined;
    const built = model.buildPython([], derivedSelection);
    pyWorker.postMessage({
      model: `${built}\nmodel`,
      derived: `${built}\nderived`,
      initialValues: model.resolveInitialValues(),
      names: model.getNames(),
      derivedSelection: derivedSelection ? derivedSelection : order,
      tEnd: tEnd,
      pars: [],
      method: method,
      requestId: requestId,
      calculateDerived: showDerived,
      nTimePoints: nTimePoints,
    });
  }

  function normalizeToMax(data: number[]): number[] {
    const max = Math.max(...data);
    if (max === 0 || !isFinite(max)) return data;
    return data.map((v) => v / max);
  }

  function maybeNormalize(key: string, data: number[]): number[] {
    return normalizedKeys?.includes(key) ? normalizeToMax(data) : data;
  }
  function maybeRename(key: string): string {
    return normalizedKeys?.includes(key) ? `Norm(${key})` : key;
  }

  let lineData = $derived.by(() => {
    const nVars = model.variables.size;
    const visible = (key: string) =>
      !selectedKeys || selectedKeys.includes(key);

    const varDatasets = [...model.variables.keys()]
      .map((name, idx) => ({ name, idx }))
      .filter(({ name }) => visible(name))
      .map(({ name, idx }) => ({
        label: maybeRename(model.variables.get(name)?.displayName ?? name),
        data: maybeNormalize(name, arrayColumn(result.values, idx) as number[]),
      }));

    if (!showDerived)
      return { labels: result.time as number[], datasets: varDatasets };

    const allDerived = model.sortDependencies();
    const activeDerived = selectedKeys
      ? allDerived.filter((k) => selectedKeys.includes(k))
      : allDerived;

    const derivedDatasets = activeDerived.map((name, i) => ({
      label: maybeRename(
        model.assignments.get(name)?.displayName ??
          model.reactions.get(name)?.displayName ??
          name,
      ),
      data: maybeNormalize(
        name,
        arrayColumn(result.values, nVars + i) as number[],
      ),
    }));

    return {
      labels: result.time as number[],
      datasets: [...varDatasets, ...derivedDatasets],
    };
  });

  function handleResults(data: SimulationResult) {
    if (data.requestId === currentRequestId) {
      // Clear the timeoutInSeconds since we got a response
      if (timeoutInSecondsId) {
        clearTimeout(timeoutInSecondsId);
        timeoutInSecondsId = null;
      }

      if (data.err !== undefined) {
        err = data.err;
        loading = false;
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
    <SimErrDisplay err={err} />
  {:else}
    <LineChart
      data={lineData}
      loading={loading}
      yMax={yMax}
      lineDisplay={lineDisplay}
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
