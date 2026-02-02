<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import Slider from "$lib/Slider.svelte";
  import { onMount } from "svelte";

  function c(value: number, opacity: number = 1.0) {
    const CHART_COLORS = [
      `rgba(255, 99, 132, ${opacity})`,
      `rgba(255, 159, 64, ${opacity})`,
      `rgba(255, 205, 86, ${opacity})`,
      `rgba(75, 192, 192, ${opacity})`,
      `rgba(54, 162, 235, ${opacity})`,
      `rgba(153, 102, 255, ${opacity})`,
      `rgba(201, 203, 207, ${opacity})`,
    ];

    return CHART_COLORS[value];
  }

  let o: number = $state(210); // mbar
  let j: number = $state(124); // µmol m⁻² s⁻¹
  let tp: number = $state(15); // µmol m⁻² s⁻¹
  let yMax = 60;

  const start = 0;
  const stop = 1000;
  const n = 100;
  const step = (stop - start) / n;
  const ciVals = Array.from({ length: n }, (_, i) => 0 + step * i);
  let result = $state([{ an: 0.0, wc: 0.0, wj: 0.0, wp: 0.0 }]);

  function fvcbMinW(
    c: number,
    o: number,
    j: number,
    tp: number,
  ): { an: number; wc: number; wj: number; wp: number } {
    const vcmax = 80; // µmol m⁻² s⁻¹
    const kc = 259; // µbar
    const ko = 179; // mbar
    const ccp = 38.6; // CO2 compensation point µbar
    const rl = 1; // µmol m⁻² s⁻¹

    //  fraction of remaining glycolate carbon not returned to the chloroplast
    const alphaOld = 0; // dimensionless

    // Since we assume rm == 0
    // RuBP saturated rate of CO2 assimilation
    const wc = (c * vcmax) / (c + kc * (1 + o / ko));

    // Electron transport limited rate of CO2 assimilation
    const wj = (c * j) / (4 * c + 8 * ccp);

    //  Phosphate limited rate of CO2 assimilation
    // const wp = 3 * tp * c;
    const wp =
      c <= ccp * (1 + 3 * alphaOld)
        ? 100 // technically infinity here
        : (3 * c * tp) / (c - ccp * (1 + 3 * alphaOld));

    const vc = Math.min(wc, wj, wp);
    const an = vc * (1 - ccp / c) - rl;

    return { an: an, wc: wc, wj: wj, wp: wp };
  }

  // function fvcbMinA(
  //   ci: number,
  //   o: number,
  //   j: number,
  //   tp: number,
  // ): { a: number; ac: number; aj: number; ap: number } {
  //   const vcmax = 80; // µmol m⁻² s⁻¹
  //   const kc = 259; // µbar
  //   const ko = 179; // mbar
  //   const gammaStar = 38.6; // µbar
  //   const rd = 1; // µmol m⁻² s⁻¹

  //   // Since we assume rm == 0
  //   // RuBP saturated rate of CO2 assimilation
  //   const ac = ((ci - gammaStar) * vcmax) / (ci + kc * (1 + o / ko)) - rd;

  //   // Electron transport limited rate of CO2 assimilation
  //   const aj = ((ci - gammaStar) * j) / (4 * ci + 8 * gammaStar) - rd;

  //   //  Phosphate limited rate of CO2 assimilation
  //   const ap = 3 * tp - rd;
  //   const a = Math.min(ac, aj, ap);

  //   return { a: a, ac: ac, aj: aj, ap: ap };
  // }

  function runSimulation() {
    result = ciVals.map((ci) => {
      return fvcbMinW(ci, o, j, tp);
    });
  }

  const lineAlpha = 0.35;
  let lineData = $derived.by(() => {
    return {
      labels: ciVals,
      datasets: [
        {
          label: "An",
          data: result.map((x) => x.an) as number[],
          backgroundColor: c(3, 1.0),
          borderColor: c(3, 1.0),
        },
        {
          label: "Wc",
          data: result.map((x) => x.wc) as number[],
          backgroundColor: c(0, lineAlpha),
          borderColor: c(0, lineAlpha),
        },
        {
          label: "Wj",
          data: result.map((x) => x.wj) as number[],
          backgroundColor: c(1, lineAlpha),
          borderColor: c(1, lineAlpha),
        },
        {
          label: "Wp",
          data: result.map((x) => x.wp) as number[],
          backgroundColor: c(2, lineAlpha),
          borderColor: c(2, lineAlpha),
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
  loading={false}
/>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
