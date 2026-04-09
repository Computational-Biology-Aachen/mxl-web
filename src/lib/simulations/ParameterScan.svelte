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

  function linspace(min: number, max: number, steps: number): number[] {
    if (steps <= 1) return [min];
    return Array.from(
      { length: steps },
      (_, i) => min + (i / (steps - 1)) * (max - min),
    );
  }

  let err = $state<string | undefined>(undefined);
  let scanResult = $state<ScanResult>({
    paramValues: [],
    labels: [],
    datasets: [],
  });

  // Batch tracking — plain (non-reactive) fields, safe to mutate in handlers
  let activeScanId = 0;
  const requestMap = new Map<string, { paramIdx: number; scanId: number }>();

  let completedCount = $state(0);
  let totalCount = $state(0);

  export function runScan(currentModel: ModelBuilder) {
    err = undefined;

    activeScanId++;
    const scanId = activeScanId;
    const paramValues = linspace(analysis.min, analysis.max, analysis.steps);
    const varKeys = [...currentModel.variables.keys()];

    // Zero out results immediately so the chart reflects the new scan
    scanResult = {
      paramValues,
      labels: varKeys.map(
        (k) => currentModel.variables.get(k)?.displayName ?? k,
      ),
      datasets: varKeys.map((k) => ({
        label: currentModel.variables.get(k)?.displayName ?? k,
        data: new Array(analysis.steps).fill(NaN),
      })),
    };
    completedCount = 0;
    totalCount = analysis.steps;

    paramValues.forEach((paramValue, idx) => {
      const requestId = WorkerManager.generateRequestId();
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
          .map((val) => val.value)
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
      if (!data.requestId) return;
      const entry = requestMap.get(data.requestId);
      if (!entry) return;
      requestMap.delete(data.requestId);

      if (entry.scanId !== activeScanId) return; // stale batch

      if (data.message !== undefined) {
        err = data.message;
        return;
      }

      // Last time point = steady-state approximation; update this param index immediately
      const lastValues: number[] = data.values[data.values.length - 1];
      scanResult.datasets.forEach((dataset, varIdx) => {
        dataset.data[entry.paramIdx] = lastValues[varIdx];
      });
      completedCount++;
    });

    runScan(model);

    return () => {
      unsub();
    };
  });
</script>

<div id="chart">
  {#if err}
    <span>{err}</span>
  {:else}
    {#if completedCount < totalCount}
      <div class="loading-container">
        <div class="spinner"></div>
        <span class="counter"
          >{completedCount} / {totalCount} simulations finished</span
        >
      </div>
    {/if}
    <LineChart
      data={lineData}
      loading={false}
      xMin={analysis.min}
      yMax={analysis.yMax}
      xLabel={analysis.parameter}
      yLabel="Steady-state value"
    />
  {/if}
</div>

<style>
  #chart {
    width: 100%;
  }

  .counter {
    color: var(--color-text-muted, #888);
    font-size: 0.85rem;
  }

  .loading-container {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 1rem;
    height: 40px;
  }

  .spinner {
    animation: spin 1s linear infinite;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: currentColor;
    border-radius: var(--round);
    width: 40px;
    height: 40px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
