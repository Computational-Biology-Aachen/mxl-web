<script lang="ts">
  import { base } from "$app/paths";
  import type {
    Analyses,
    ParameterScanAnalysis,
    SimulationAnalysis,
  } from "$lib";
  import ModelEditButton from "$lib/buttons/ModelEditButton.svelte";
  import ResetButton from "$lib/buttons/ResetButton.svelte";
  import DynBoxRow from "$lib/DynBoxRow.svelte";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import Pair from "$lib/Pair.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import ParameterScanSimulator from "$lib/simulations/ParameterScan.svelte";
  import Simulator from "$lib/simulations/TimeCourse.svelte";
  import Slider from "$lib/Slider.svelte";
  import type { Snippet } from "svelte";
  import Popover from "../Popover.svelte";
  import AnalysisEditor from "./AnalysisEditor.svelte";
  import ModelEditor from "./ModelEditor.svelte";
  import { defaultValue } from "./modelUtils";
  import ParameterScanEditor from "./ParameterScanEditor.svelte";

  let {
    children,
    name,
    initModel,
    analyses = $bindable(),
  }: {
    name: string;
    initModel: () => ModelBuilder;
    analyses: Analyses;
    children?: Snippet;
  } = $props();

  let model = $derived(initModel());

  let simulatorRefs = $state<Record<number, Simulator | undefined>>({});
  let scannerRefs = $state<Record<number, ParameterScanSimulator | undefined>>(
    {},
  );

  let analysisById = $derived.by(() => {
    const map = new Map<number, Analyses[number]>();
    for (const analysis of analyses) {
      map.set(analysis.id, analysis);
    }
    return map;
  });

  function runAllSimulations() {
    for (const simulator of Object.values(simulatorRefs)) {
      simulator?.runSimulation(model);
    }
    for (const scanner of Object.values(scannerRefs)) {
      scanner?.runScan(model);
    }
  }

  let parSliders = $derived.by(() => {
    return model.parameters
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([id, par]) => {
        return {
          id: id,
          name: par.displayName,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });

  let varSliders = $derived.by(() => {
    return model.variables
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([id, par]) => {
        return {
          id: id,
          name: par.displayName,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });

  function addParameterScan() {
    const newId = analyses.length;
    const firstParam = [...model.parameters.keys()][0] ?? "";
    const newScan: ParameterScanAnalysis = {
      type: "parameterScan",
      id: newId,
      idx: analyses.length,
      title: `Parameter Scan`,
      span: 3,
      parameter: firstParam,
      min: 0,
      max: 1,
      steps: 20,
      tEnd: 1000,
      xMin: undefined,
      yMax: undefined,
      timeoutInSeconds: 120,
    };
    analyses = [...analyses, newScan];
  }
</script>

<RowApart>
  <Pair>
    <a
      class="light"
      style="font-size: var(--text-sm);"
      href="{base}/">Models</a
    >
    <span
      class="light"
      style="font-size: var(--text-sm);">/</span
    >
    <span
      class="bold"
      style="font-size: var(--text-sm);">{name}</span
    >
  </Pair>
  <Pair justify="end">
    <ResetButton
      onclick={() => {
        model = initModel();
        runAllSimulations();
      }}
    />
    <ModelEditButton popovertarget="model-editor" />
  </Pair>
</RowApart>

{#if children}
  {@render children()}
{/if}

<Pair>
  <Icon>function</Icon>
  <h3>Model Equations</h3>
</Pair>

<Math
  tex={model.buildTex()}
  display
/>

{#if parSliders.length > 0}
  <Pair>
    <Icon>tune</Icon>
    <h3>Simulation parameters</h3>
  </Pair>
  <div class="grid-row">
    {#each parSliders as par (par.id)}
      <Slider
        name={defaultValue(par.name, par.id)}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.parameters.get(par.id)!.value;
          },
          (val) => {
            let old = model.parameters.get(par.id)!;

            model.parameters = model.parameters.set(par.id, {
              ...old,
              value: val,
            });
          }
        }
        min={par.min}
        max={par.max}
        step={par.step}
      />
    {/each}
  </div>
{/if}

{#if varSliders.length > 0}
  <Pair>
    <Icon>tune</Icon>
    <h3>Initial conditions</h3>
  </Pair>
  <div class="grid-row">
    {#each varSliders as vari (vari.id)}
      <Slider
        name={defaultValue(vari.name, vari.id)}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.variables.get(vari.id)!.value;
          },
          (val) => {
            let old = model.variables.get(vari.id)!;
            model.variables = model.variables.set(vari.id, {
              ...old,
              value: val,
            });
          }
        }
        min={vari.min}
        max={vari.max}
        step={vari.step}
      />
    {/each}
  </div>
{/if}

<Pair>
  <Icon>analytics</Icon>
  <h3>Analyses</h3>
</Pair>

<DynBoxRow
  items={analyses}
  onAdd={(box) => {
    const newAnalysis: SimulationAnalysis = {
      type: "simulation",
      id: box.id,
      idx: analyses.length,
      title: "New",
      span: box.span,
      tEnd: 10,
      yMax: undefined,
      xMin: undefined,
      timeoutInSeconds: 20,
    };
    analyses = [...analyses, newAnalysis];
    return analyses.length - 1;
  }}
  onRemove={(box) => {
    analyses = analyses.filter((a) => a.id !== box.id);
    delete simulatorRefs[box.id];
    simulatorRefs = { ...simulatorRefs };
    delete scannerRefs[box.id];
    scannerRefs = { ...scannerRefs };
  }}
>
  {#snippet children({ box })}
    {@const analysis = analysisById.get(box.id)}
    {#if analysis}
      {#if analysis.type === "simulation"}
        <Simulator
          bind:this={simulatorRefs[box.id]}
          model={model}
          tEnd={analysis.tEnd}
          yMax={analysis.yMax}
          timeoutInSeconds={analysis.timeoutInSeconds}
        />
      {:else if analysis.type === "parameterScan"}
        <ParameterScanSimulator
          bind:this={scannerRefs[box.id]}
          model={model}
          analysis={analysis}
          tEnd={analysis.tEnd}
        />
      {/if}
    {/if}
  {/snippet}
</DynBoxRow>

<Popover
  size="lg"
  popovertarget={`model-editor`}
>
  <ModelEditor
    parent={model}
    popovertarget={`model-editor`}
    onSave={(edited) => {
      model = edited;
      runAllSimulations();
    }}
  />
</Popover>

{#each analyses as analysis}
  <Popover
    size="sm"
    popovertarget={`analysis-editor-${analysis.id}`}
  >
    {#if analysis.type === "simulation"}
      <AnalysisEditor
        parent={analysis}
        onSave={({ tEnd, yMax, title, timeoutInSeconds }) => {
          analyses = analyses.map((a) =>
            a.id === analysis.id
              ? { ...a, tEnd, yMax, title, timeoutInSeconds }
              : a,
          ) as Analyses;
          simulatorRefs[analysis.id]?.runSimulation(model);
        }}
        popovertarget={`analysis-editor-${analysis.id}`}
      />
    {:else if analysis.type === "parameterScan"}
      <ParameterScanEditor
        parent={analysis}
        model={model}
        onSave={(updated) => {
          analyses = analyses.map((a) =>
            a.id === analysis.id ? updated : a,
          ) as Analyses;
          scannerRefs[analysis.id]?.runScan(model);
        }}
        popovertarget={`analysis-editor-${analysis.id}`}
      />
    {/if}
  </Popover>
{/each}

<style>
  .grid-row {
    display: flex;
    flex-direction: column;
    align-items: inherit;
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background-color: var(--bg-l1);
    padding: 1.5rem;

    @media (min-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      align-items: center;
    }
  }
  .bold {
    font-weight: 600;
  }
  .light {
    color: var(--slate-400);
    font-weight: 400;
  }
  a.light:hover {
    color: var(--primary);
  }
</style>
