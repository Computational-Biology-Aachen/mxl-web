<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";

  import Slider from "$lib/Slider.svelte";
  import { onMount } from "svelte";

  let o: number = $state(210);
  let j: number = $state(124);
  let tp: number = $state(15);
  let yMax = 60;

  const start = 0;
  const stop = 1000;
  const n = 100;
  const step = (stop - start) / n;
  const ciVals = Array.from({ length: n }, (_, i) => 0 + step * i);
  let result = $state([{ a: 0.0, ac: 0.0, aj: 0.0, ap: 0.0 }]);

  function fvcb(
    ci: number,
    o: number,
    j: number,
    tp: number,
  ): { a: number; ac: number; aj: number; ap: number } {
    const vcmax = 80; // µmol m⁻² s⁻¹
    const kc = 259; // µbar
    const ko = 179; // mbar
    const gammaStar = 38.6; // µbar
    const rd = 1; // µmol m⁻² s⁻¹

    // Since we assume rm == 0
    // RuBP saturated rate of CO2 assimilation
    const ac = ((ci - gammaStar) * vcmax) / (ci + kc * (1 + o / ko)) - rd;

    // Electron transport limited rate of CO2 assimilation
    const aj = ((ci - gammaStar) * j) / (4 * ci + 8 * gammaStar) - rd;

    //  Phosphate limited rate of CO2 assimilation
    const ap = 3 * tp - rd;
    const a = Math.min(ac, aj, ap);

    return { a: a, ac: ac, aj: aj, ap: ap };
  }

  function runSimulation() {
    result = ciVals.map((ci) => {
      return fvcb(ci, o, j, tp);
    });
  }

  let lineData = $derived.by(() => {
    return {
      labels: ciVals,
      datasets: [
        {
          label: "a",
          data: result.map((x) => x.a) as number[],
        },
        {
          label: "ac",
          data: result.map((x) => x.ac) as number[],
        },
        {
          label: "aj",
          data: result.map((x) => x.aj) as number[],
        },
        {
          label: "ap",
          data: result.map((x) => x.ap) as number[],
        },
      ],
    };
  });

  onMount(() => {
    runSimulation();
  });
</script>

<h1>FvCB</h1>
<p>
  The FvCB model, also known as the Farquhar, von Caemmerer, and Berry model, is
  a widely used theoretical framework in plant biology, first conceptualized in
  1980. It provides a simplistic view of C3 photosynthesis and is named after
  its primary contributors: Graham D. Farquhar, Susanne von Caemmerer, and
  Joseph A. Berry. The model focuses on the carbon fixation stage of
  photosynthesis and describes carbon assimilation (A) by dividing it into three
  categories: the RuBisCO limited rate (Ac), the electron transport limited rate
  (Aj), and the triphosphate limited rate (Ap). These three components can be
  calculated using equations with measurable biochemical parameters. The minimum
  value of these three components is declared to showcase our A in specific
  conditions.
</p>

<div>
  <Slider
    name="Chloroplast O₂ partial pressure / mbar"
    bind:val={o}
    callback={runSimulation}
    min="100"
    max="500"
    step="1"
  />
  <Slider
    name="Electron transport rate (J) / µmol m⁻² s⁻¹"
    bind:val={j}
    callback={runSimulation}
    min="50"
    max="300"
    step="1"
  />
  <Slider
    name="Inorganic phosphate supply rate (Tₚ) / µmol m⁻² s⁻¹"
    bind:val={tp}
    callback={runSimulation}
    min="5"
    max="50"
    step="1"
  />
</div>
<LineChart
  data={lineData}
  {yMax}
  xLabel="Intercellular CO₂ / µbar"
  yLabel="CO₂ Assimilation / µmol m⁻² s⁻¹"
/>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
