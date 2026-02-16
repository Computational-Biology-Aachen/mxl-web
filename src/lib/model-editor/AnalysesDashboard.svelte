<script lang="ts">
  import { base } from "$app/paths";
  import type { Analyses, Analysis } from "$lib";
  import DynBoxRow from "$lib/DynBoxRow.svelte";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { ModelBuilder } from "$lib/model-editor/model";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";
  import type { Snippet } from "svelte";
  import Popover from "../Popover.svelte";
  import AnalysisEditor from "./AnalysisEditor.svelte";
  import ModelEditor from "./ModelEditor.svelte";

  let {
    children,
    name,
    initModel,
    analyses,
  }: {
    name: string;
    initModel: () => ModelBuilder;
    analyses: Analyses;
    children?: Snippet;
  } = $props();

  let model = $derived(initModel());

  let simulatorRefs = $state<Record<number, Simulator | undefined>>({});
  let analysisById = $derived.by(() => {
    const map = new Map<number, Analysis>();
    for (const analysis of analyses) {
      map.set(analysis.id, analysis);
    }
    return map;
  });

  function runAllSimulations() {
    for (const [id, simulator] of Object.entries(simulatorRefs)) {
      simulator?.runSimulation(model);
    }
  }

  let parSliders = $derived.by(() => {
    return model.parameters
      .entries()
      .filter((k) => k[1].slider !== undefined)
      .map(([name, par]) => {
        return {
          name: name,
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
      .map(([name, par]) => {
        return {
          name: name,
          init: par.value,
          min: par.slider!.min,
          max: par.slider!.max,
          step: par.slider!.step,
        };
      })
      .toArray();
  });
</script>

<div class="topbar">
  <div class="breadcrumbs">
    <a class="light" href="{base}/">Models</a>
    <span class="light">/</span>
    <span class="bold">{name}</span>
  </div>
  <div class="row">
    <button
      onclick={() => {
        model = initModel();
        runAllSimulations();
      }}>Reset</button
    >
    <button popovertarget="model-editor">Edit model</button>
  </div>
</div>

{#if children}
  {@render children()}
{/if}

<div class="heading">
  <Icon>function</Icon>
  <h3>Model Equations</h3>
</div>
<Math tex={model.buildTex()} display />

{#if parSliders.length > 0}
  <div class="heading">
    <Icon>tune</Icon>
    <h3>Simulation parameters</h3>
  </div>
  <div class="grid-row">
    {#each parSliders as par (par.name)}
      <Slider
        name={par.name}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.parameters.get(par.name)!.value;
          },
          (val) => {
            let old = model.parameters.get(par.name)!;

            model.parameters = model.parameters.set(par.name, {
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
  <div class="heading">
    <Icon>tune</Icon>
    <h3>Initial conditions</h3>
  </div>
  <div class="grid-row">
    {#each varSliders as { name, min, max, step }}
      <Slider
        {name}
        callback={runAllSimulations}
        bind:val={
          () => {
            return model.variables.get(name)!.value;
          },
          (val) => {
            let old = model.variables.get(name)!;
            model.variables = model.variables.set(name, { ...old, value: val });
          }
        }
        {min}
        {max}
        {step}
      />
    {/each}
  </div>
{/if}

<DynBoxRow
  items={analyses}
  onAdd={(box) => {
    const newAnalysis = {
      id: box.id,
      idx: analyses.length,
      title: "New",
      span: box.span,
      simulator: undefined,
      tEnd: 10,
      yMax: undefined,
    };
    analyses = [...analyses, newAnalysis];
    return analyses.length - 1;
  }}
  onRemove={(box) => {
    analyses = analyses.filter((a) => a.id !== box.id);
    delete simulatorRefs[box.id];
    simulatorRefs = { ...simulatorRefs };
  }}
>
  {#snippet children({ box })}
    {@const analysis = analysisById.get(box.id)}
    {#if analysis}
      <Simulator
        bind:this={simulatorRefs[box.id]}
        {model}
        tEnd={analysis.tEnd}
      />
    {/if}
  {/snippet}
</DynBoxRow>

<Popover size="lg" popovertarget={`model-editor`}>
  <ModelEditor
    parent={model}
    popovertarget={`model-editor`}
    onSave={(edited) => {
      model = edited;
      runAllSimulations();
    }}
  />
</Popover>

{#each analyses as analysis, idx}
  <Popover size="sm" popovertarget={`analysis-editor-${idx}`}>
    <AnalysisEditor
      parent={analysis}
      onSave={({ tEnd, yMax }) => {
        console.log(`New simulation options: tEnd:${tEnd}, yMax: ${yMax}`);
        analyses[idx] = { ...analysis, tEnd: tEnd, yMax: yMax };
        analyses = analyses.slice();
        simulatorRefs[analysis.id]?.runSimulation(model);
      }}
      popovertarget={`analysis-editor-${idx}`}
    />
  </Popover>
{/each}

<style>
  .topbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .breadcrumbs {
    display: flex;
    gap: 0.5rem;
    font-size: var(--text-sm);
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
  }
  .heading {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    align-items: center;
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background-color: var(--bg-l1);
    padding: 1.5rem;
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
  button {
    cursor: pointer;
    border: none;
    border-radius: var(--border-radius);
    background-color: var(--primary);
    padding: 0 1rem;
    min-width: 1rem;
    height: 2rem;
    color: white;
    font-weight: var(--weight-bold);
    font-size: 0.875rem;
    line-height: 1.25rem;
    letter-spacing: 0.025em;
  }
  button:hover {
    background-color: lch(from var(--primary) calc(l - 20) c h);
  }
</style>
