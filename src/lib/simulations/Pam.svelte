<!--
 @component
 Pulse amplitude modulation (PAM) scan
-->

<script lang="ts">
  import { onMount } from "svelte";

  import PamChart, { type PhaseRegion } from "../chartjs/PamChart.svelte";
  import type { ModelBuilder } from "../model-editor/modelBuilder";
  import { pyWorkerPool } from "../stores/workerPool";
  import { WorkerManager, type WorkerMessage } from "../stores/workerStore";
  import { arrayColumn } from "../utils";
  import { type PamPhase, expandProtocol } from "./protocol";

  let {
    model,
    pamProtocol,
    yMax,
    timeoutInSeconds,
    method,
    showDerived = false,
    selectedKeys = undefined,
    nTimePoints,
  }: {
    model: ModelBuilder;
    pamProtocol: PamPhase[];
    yMax?: number | undefined;
    timeoutInSeconds: number;
    method: string;
    showDerived?: boolean;
    selectedKeys?: string[];
    nTimePoints: number;
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

    if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    err = undefined;

    timeoutInSecondsId = setTimeout(() => {
      if (currentRequestId === requestId) {
        err = "Simulation timed out";
        loading = false;
      }
    }, timeoutInSeconds * 1000);

    const protocol = expandProtocol(pamProtocol);

    const built = model.buildPython(["PPFD"]);

    pyWorker.postMessage({
      model: `${built}\nmodel`,
      derived: `${built}\nderived`,
      initialValues: model.variables
        .values()
        .map((val) => val.value)
        .toArray(),
      tEnd: 0,
      pars: [],
      method: method,
      requestId: requestId,
      protocol: protocol,
      calculateDerived: showDerived,
      nTimePoints: nTimePoints,
    });
  }

  let maxBackgroundPFD = $derived(
    Math.max(0, ...pamProtocol.map((p) => p.backgroundPFD)),
  );

  function backgroundPfdColor(pfd: number): string {
    if (pfd === 0) return "rgba(0,0,0,0.08)";
    const ratio = maxBackgroundPFD > 0 ? pfd / maxBackgroundPFD : 1;
    const alpha = (0.06 + ratio * 0.24).toFixed(2);
    return `rgba(255,200,0,${alpha})`;
  }

  const pulseColor = "rgba(255,100,0,0.35)";

  let phaseRegions = $derived.by(() => {
    const regions: PhaseRegion[] = [];
    let t = 0;
    for (const phase of pamProtocol) {
      for (let i = 0; i < phase.repetitions; i++) {
        const bgEnd = t + phase.backgroundLength;
        regions.push({
          start: t,
          end: bgEnd,
          color: backgroundPfdColor(phase.backgroundPFD),
        });
        t = bgEnd;
        if (phase.pulseLength > 0) {
          const pulseEnd = t + phase.pulseLength;
          regions.push({ start: t, end: pulseEnd, color: pulseColor });
          t = pulseEnd;
        }
      }
    }
    return regions;
  });

  let lineData = $derived.by(() => {
    const nVars = model.variables.size;
    const visible = (key: string) =>
      !selectedKeys || selectedKeys.includes(key);

    const varDatasets = [...model.variables.keys()]
      .map((name, idx) => ({ name, idx }))
      .filter(({ name }) => visible(name))
      .map(({ name, idx }) => ({
        label: model.variables.get(name)?.displayName ?? name,
        data: arrayColumn(result.values, idx) as number[],
      }));

    if (!showDerived)
      return { labels: result.time as number[], datasets: varDatasets };

    const derivedDatasets = model
      .sortDependencies()
      .map((name, i) => ({ name, i }))
      .filter(({ name }) => visible(name))
      .map(({ name, i }) => ({
        label:
          model.assignments.get(name)?.displayName ??
          model.reactions.get(name)?.displayName ??
          name,
        data: arrayColumn(result.values, nVars + i) as number[],
      }));

    return {
      labels: result.time as number[],
      datasets: [...varDatasets, ...derivedDatasets],
    };
  });

  function handleResults(data: WorkerMessage) {
    if (data.requestId === currentRequestId) {
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
    runSimulation(model);
    return () => {
      unsub();
      if (timeoutInSecondsId) clearTimeout(timeoutInSecondsId);
    };
  });
</script>

<div>
  {#if err}
    <span>{err}</span>
  {:else}
    <PamChart
      data={lineData}
      loading={loading}
      yMax={yMax}
      phases={phaseRegions}
    />
  {/if}
</div>

<style>
  div {
    width: 100%;
  }
</style>
