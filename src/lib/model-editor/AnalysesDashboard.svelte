<script lang="ts">
  import { base } from "$app/paths";
  import type { Analyses, Analysis } from "$lib";
  import ModelEditButton from "$lib/buttons/ModelEditButton.svelte";
  import ResetButton from "$lib/buttons/ResetButton.svelte";
  import DynBoxRow from "$lib/DynBoxRow.svelte";
  import Icon from "$lib/Icon.svelte";
  import Math from "$lib/Math.svelte";
  import { ModelBuilder } from "$lib/model-editor/modelBuilder";
  import Pair from "$lib/Pair.svelte";
  import RowApart from "$lib/RowApart.svelte";
  import Simulator from "$lib/Simulator.svelte";
  import Slider from "$lib/Slider.svelte";
  import type { Snippet } from "svelte";
  import Popover from "../Popover.svelte";
  import AnalysisEditor from "./AnalysisEditor.svelte";
  import ModelEditor from "./ModelEditor.svelte";
  import { defaultValue } from "./modelUtils";

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
      timeoutInSeconds: 20,
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
        model={model}
        tEnd={analysis.tEnd}
        yMax={analysis.yMax}
        timeoutInSeconds={analysis.timeoutInSeconds}
      />
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

{#each analyses as analysis, idx}
  <Popover
    size="sm"
    popovertarget={`analysis-editor-${idx}`}
  >
    <AnalysisEditor
      parent={analyses[idx]}
      onSave={({ tEnd, yMax, title, timeoutInSeconds }) => {
        console.log(
          `New simulation options: tEnd:${tEnd}, yMax: ${yMax}, title: ${title}`,
        );
        analyses[idx] = {
          ...analysis,
          tEnd: tEnd,
          yMax: yMax,
          title: title,
          timeoutInSeconds: timeoutInSeconds,
        };
        analyses = analyses.slice();
        simulatorRefs[analysis.id]?.runSimulation(model);
      }}
      popovertarget={`analysis-editor-${idx}`}
    />
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
