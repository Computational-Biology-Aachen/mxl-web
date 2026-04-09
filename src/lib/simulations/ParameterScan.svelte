<script lang="ts">
  import type { ParameterScanAnalysis } from "$lib";
  import LineChart from "$lib/chartjs/LineChart.svelte";
  import { onMount } from "svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import { WorkerManager } from "../stores/workerStore";

  let {
    model,
    analysis,
    tEnd,
  }: {
    model: ModelBuilder;
    analysis: ParameterScanAnalysis;
    tEnd: number;
  } = $props();

  type ScanResult = {
    paramValues: number[];
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };

  let loading = $state(true);
  let err = $state<string | undefined>(undefined);
  let scanResult = $state<ScanResult>({
    paramValues: [],
    labels: [],
    datasets: [],
  });

  // Batch tracking — plain (non-reactive) fields, safe to mutate in handlers
  let activeScanId = 0;
  let pendingCount = 0;
  let completedCount = 0;
  let activeResults: (number[] | null)[] = [];
  let activeParamValues: number[] = [];
  let activeScanModel: ModelBuilder | null = null;
  const requestMap = new Map<string, { paramIdx: number; scanId: number }>();

  function linspace(min: number, max: number, steps: number): number[] {
    if (steps <= 1) return [min];
    return Array.from(
      { length: steps },
      (_, i) => min + (i / (steps - 1)) * (max - min),
    );
  }

  function finalizeScan(model: ModelBuilder) {
    const paramValues = activeParamValues;
    const varKeys = [...model.variables.keys()];
    const varResults: number[][] = varKeys.map((_, varIdx) =>
      activeResults.map((r) => (r ? r[varIdx] : NaN)),
    );

    scanResult = {
      paramValues,
      labels: varKeys.map((k) => model.variables.get(k)?.displayName ?? k),
      datasets: [
        ...varKeys.map((k, i) => ({
          label: model.variables.get(k)?.displayName ?? k,
          data: varResults[i],
        })),
      ],
    };
    loading = false;
    console.log("Finishing finalizing");
  }

  export function runScan(currentModel: ModelBuilder) {
    loading = true;
    err = undefined;

    activeScanId++;
    console.log(`Running scan with id ${activeScanId}`);
    const scanId = activeScanId;
    const paramValues = linspace(analysis.min, analysis.max, analysis.steps);
    console.log(`paramValues`, paramValues);
    activeParamValues = paramValues;
    activeResults = new Array(analysis.steps).fill(null);
    activeScanModel = currentModel;
    pendingCount = analysis.steps;
    completedCount = 0;

    paramValues.forEach((paramValue, idx) => {
      const requestId = WorkerManager.generateRequestId();
      console.log("Running worker with id", requestId);
      requestMap.set(requestId, { paramIdx: idx, scanId });

      const clonedModel = currentModel.clone();
      clonedModel.updateParameter(analysis.parameter, {
        ...clonedModel.parameters.get(analysis.parameter),
        value: paramValue,
      });
      pyWorkerPool.postMessage({
        model: `${clonedModel.buildPython([])}\nmodel`,
        initialValues: model.variables
          .values()
          .map((val) => {
            return val.value;
          })
          .toArray(),
        tEnd: tEnd,
        pars: [],
        requestId,
      });
    });
  }

  let lineData = $derived.by(() => {
    if (!scanResult) return { labels: [], datasets: [] };
    return {
      labels: scanResult.paramValues as number[],
      datasets: scanResult.datasets,
    };
  });

  onMount(() => {
    const unsub = pyWorkerPool.onMessage((data) => {
      console.log("Message", data);
      if (!data.requestId) return;
      const entry = requestMap.get(data.requestId);
      if (!entry) return;
      requestMap.delete(data.requestId);

      if (entry.scanId !== activeScanId) {
        console.log("Stale batch with id", entry.scanId);
        return; // stale batch
      }

      if (data.message !== undefined) {
        err = data.message;
        loading = false;
        return;
      }

      // Last time point = steady-state approximation
      const lastValues = data.values[data.values.length - 1];
      activeResults[entry.paramIdx] = lastValues;
      completedCount++;
      console.log(`completedCount`, completedCount / pendingCount);

      if (completedCount === pendingCount && activeScanModel) {
        console.log("Finalizing");
        finalizeScan(activeScanModel);
      }
    });

    runScan(model);

    return () => {
      unsub();
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
      xMin={analysis.min}
      yMax={analysis.yMax}
      // xLabel={analysis.parameter}
      // yLabel="Steady-state value"
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
