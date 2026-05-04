<!--
 @component
 Pulse amplitude modulation (PAM) scan
-->

<script lang="ts">
  import { onMount } from "svelte";

  import PamChart, { type PhaseRegion } from "../chartjs/PamChart.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import {
    WorkerManager,
    type SimulationError,
    type SimulationResult,
  } from "../stores/workerStore";
  import { arrayColumn } from "../utils";
  import { expandProtocol, type PamGroup } from "./protocol";
  import SimErrDisplay from "./SimErrDisplay.svelte";

  let {
    model,
    pamProtocol,
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
    pamProtocol: PamGroup[];
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

    if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    err = undefined;

    timeoutInSecondsId = setTimeout(() => {
      if (currentRequestId === requestId) {
        err = {
          message: "Simulation timed out",
          hints: ["Increase the simulation timeout via the ≡ menu"],
        };
        loading = false;
      }
    }, timeoutInSeconds * 1000);

    const protocol = expandProtocol(pamProtocol);

    const order = model.sortDependencies();
    const allDerived = new Set(order);
    const derivedSelection =
      showDerived && selectedKeys
        ? selectedKeys.filter((k) => allDerived.has(k))
        : undefined;
    const built = model.buildPython(["PPFD"], derivedSelection);

    pyWorker.postMessage({
      model: `${built}\nmodel`,
      derived: `${built}\nderived`,
      initialValues: model.resolveInitialValues(),
      names: model.getNames(),
      derivedSelection: derivedSelection ? derivedSelection : order,
      tEnd: 0,
      pars: [],
      method: method,
      requestId: requestId,
      protocol: protocol,
      calculateDerived: showDerived,
      nTimePoints: nTimePoints,
    });
  }

  let maxPFD = $derived(
    Math.max(0, ...pamProtocol.flatMap((g) => g.steps.map((s) => s.pfd))),
  );

  function stepColor(pfd: number): string {
    if (pfd === 0) return "rgba(0,0,0,0.08)";
    const ratio = maxPFD > 0 ? pfd / maxPFD : 1;
    const alpha = (0.06 + ratio * 0.24).toFixed(2);
    return `rgba(255,200,0,${alpha})`;
  }

  let phaseRegions = $derived.by(() => {
    const regions: PhaseRegion[] = [];
    let t = 0;
    for (const group of pamProtocol) {
      for (let i = 0; i < group.repetitions; i++) {
        for (const step of group.steps) {
          const end = t + step.duration;
          regions.push({ start: t, end, color: stepColor(step.pfd) });
          t = end;
        }
      }
    }
    return regions;
  });

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
    runSimulation(model);
    return () => {
      unsub();
      if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    };
  });
</script>

<div>
  {#if err}
    <SimErrDisplay err={err} />
  {:else}
    <PamChart
      data={lineData}
      loading={loading}
      yMax={yMax}
      phases={phaseRegions}
      lineDisplay={lineDisplay}
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
