<script lang="ts">
  import type { ParameterScanAnalysis } from "$lib";
  import LineChart from "$lib/chartjs/LineChart.svelte";
  import { onMount } from "svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import { WorkerManager, type WorkerMessage } from "../stores/workerStore";

  let {
    model,
    analysis,
    tEnd,
    tolerance = 1e-6,
    method,
    showDerived = false,
    selectedKeys = undefined,
    nTimePoints,
  }: {
    model: ModelBuilder;
    analysis: ParameterScanAnalysis;
    tEnd: number;
    tolerance?: number;
    method: string;
    showDerived?: boolean;
    selectedKeys?: string[];
    nTimePoints: number;
  } = $props();

  type ScanResult = {
    paramValues: number[];
    labels: string[];
    keys: string[];
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
    keys: [],
    datasets: [],
  });

  // Batch tracking — plain (non-reactive) fields, safe to mutate in handlers
  let activeScanId = 0;
  const requestMap = new Map<string, { paramIdx: number; scanId: number }>();

  let completedCount = $state(0);
  let failedCount = $state(0);
  let totalCount = $state(0);

  export function runScan(currentModel: ModelBuilder) {
    err = undefined;

    activeScanId++;
    const scanId = activeScanId;
    const paramValues = linspace(analysis.min, analysis.max, analysis.steps);
    const varKeys = [...currentModel.variables.keys()];
    const derivedKeys = showDerived ? currentModel.sortDependencies() : [];

    const allKeys = [...varKeys, ...derivedKeys];
    const allLabels = allKeys.map((k) => {
      return (
        currentModel.variables.get(k)?.displayName ??
        currentModel.assignments.get(k)?.displayName ??
        currentModel.reactions.get(k)?.displayName ??
        k
      );
    });

    // Zero out results immediately so the chart reflects the new scan
    scanResult = {
      paramValues,
      labels: allLabels,
      keys: allKeys,
      datasets: allLabels.map((label) => ({
        label,
        data: new Array(analysis.steps).fill(NaN),
      })),
    };
    completedCount = 0;
    failedCount = 0;
    totalCount = analysis.steps;

    paramValues.forEach((paramValue, idx) => {
      const requestId = WorkerManager.generateRequestId();
      requestMap.set(requestId, { paramIdx: idx, scanId });

      const clonedModel = currentModel.clone();
      clonedModel.updateParameter(analysis.parameter, {
        ...clonedModel.parameters.get(analysis.parameter),
        value: paramValue,
      });
      const built = clonedModel.buildPython([]);
      pyWorkerPool.postMessage({
        model: `${built}\nmodel`,
        derived: `${built}\nderived`,
        initialValues: model.variables
          .values()
          .map((val) => val.value)
          .toArray(),
        tEnd: tEnd,
        pars: [],
        requestId,
        method: method,
        calculateDerived: showDerived,
        nTimePoints: 2,
      });
    });
  }

  function handleResults(data: WorkerMessage) {
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
    const prevValues: number[] = data.values[data.values.length - 2];
    const nVars = model.variables.size;
    // Convergence check uses only state variables (not derived)
    const norm2 = Math.sqrt(
      lastValues
        .slice(0, nVars)
        .reduce((sum, v, i) => sum + (v - prevValues[i]) ** 2, 0),
    );
    const converged = norm2 < tolerance;
    const resultValues = converged ? lastValues : lastValues.map(() => NaN);
    if (!converged) failedCount++;
    scanResult.datasets.forEach((dataset, varIdx) => {
      dataset.data[entry.paramIdx] = resultValues[varIdx];
    });
    completedCount++;
  }

  let lineData = $derived.by(() => {
    if (!scanResult) return { labels: [], datasets: [] };
    const visible = (key: string) =>
      !selectedKeys || selectedKeys.includes(key);
    return {
      labels: scanResult.paramValues as number[],
      datasets: scanResult.datasets.filter((_, i) =>
        visible(scanResult.keys[i]),
      ),
    };
  });

  onMount(() => {
    const unsub = pyWorkerPool.onMessage(handleResults);

    // Initial run
    runScan(model);

    // Cleanup handlers (workers are shared so don't terminate them)
    return () => {
      unsub();
    };
  });
</script>

<div id="chart">
  {#if err}
    <span>{err}</span>
  {:else}
    {#if completedCount < totalCount || failedCount > 0}
      <div class="loading-container">
        {#if completedCount < totalCount}
          <div class="spinner"></div>
        {/if}
        <span class="counter">
          {completedCount} / {totalCount} finished
          {#if failedCount > 0}
            &nbsp;&middot;&nbsp;<span class="failed"
              >{failedCount} did not converge</span
            >
          {/if}
        </span>
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

  .failed {
    color: var(--color-warning, #e07b00);
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
