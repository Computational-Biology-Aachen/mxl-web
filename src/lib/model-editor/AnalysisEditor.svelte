<script lang="ts">
  import Icon from "$lib/Icon.svelte";
  import { untrack } from "svelte";

  type Analysis = {
    tEnd: number;
    yMax: number | undefined;
  };

  let {
    parent,
    onSave,
    popovertarget,
  }: {
    parent: Analysis;
    onSave: (options: Analysis) => void;
    popovertarget: string;
  } = $props();

  let tEnd = $derived(parent.tEnd);
  let yMax: number = $derived(parent.yMax || 10);
  let yMaxAuto: boolean = $derived(untrack(() => yMax) ? false : true);
</script>

<section>
  <div class="apart">
    <h2>Edit analysis</h2>
    <button
      onclick={() => onSave({ tEnd, yMax: yMaxAuto ? undefined : yMax })}
      popovertargetaction="hide"
      {popovertarget}
    >
      <Icon fontSize="lg" color="inherit">play_arrow</Icon>
      Save
    </button>
  </div>
  <div>
    <label for="final-time">Simulate until:</label>
    <input id="final-time" type="number" bind:value={tEnd} />
  </div>
  <h3>Plot options</h3>
  <div>
    <label for="ymax-val">yMax:</label>
    {#if !yMaxAuto}
      <input id="ymax-val" type="number" bind:value={yMax} />
    {/if}
    <label for="ymax-auto">Auto?</label>
    <input id="ymax-auto" type="checkbox" bind:checked={yMaxAuto} />
  </div>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;

    div {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
      width: 100%;
    }

    .apart {
      justify-content: space-between;
    }

    input {
      border: 1px solid rgba(120, 120, 120, 0.6);
      border-radius: 0.5rem;
      padding: 0 0.5rem;
    }
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      box-shadow: var(--shadow-primary);
      border: none;
      border-radius: 0.5rem;
      background-color: var(--primary);
      width: 8rem;
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
  }
</style>
