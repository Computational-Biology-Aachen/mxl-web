<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import { kvaerno45 } from "$lib/integrators/implicit/kvaerno45";
  import { wa_npq } from "$lib/pkg/wa_integrate";
  import { model } from "./model";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  let ppfd = $state(100);
  let yLim = $state(8);

  let result = $derived.by(() => {
    let tStart = Date.now();
    let res = kvaerno45(model, {
      initialValues: [
        1.6999999999999997, 4.706348349506148, 3.9414515288091567,
        3.7761613271207324, 7.737821100836988, 0.5105293511676007,
        0.5000000001374878, 0.09090909090907397,
      ],
      tEnd: 50,
      pars: [ppfd],
      rtol: 1e-4,
      atol: 1e-4,
    });
    console.log(`Javascript Integration took ${Date.now() - tStart} ms`);
    return res;
  });
  let result2 = $derived.by(() => {
    let tStart = Date.now();
    let res = wa_npq(
      [
        1.6999999999999997, 4.706348349506148, 3.9414515288091567,
        3.7761613271207324, 7.737821100836988, 0.5105293511676007,
        0.5000000001374878, 0.09090909090907397,
      ],
      [ppfd],
    );
    console.log(`WebAssembly Integration took ${Date.now() - tStart} ms`);
    return res;
  });

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        {
          label: "ATP",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "Plastoquinone (oxidised)",
          data: arrayColumn(result.values, 1),
        },
        {
          label: "Plastocyanine (oxidised)",
          data: arrayColumn(result.values, 2),
        },
        {
          label: "Ferredoxine",
          data: arrayColumn(result.values, 3),
        },
        {
          label: "protons_lumen",
          data: arrayColumn(result.values, 4),
        },
        {
          label: "Light-harvesting complex",
          data: arrayColumn(result.values, 5),
        },
        {
          label: "PsbS (de-protonated)",
          data: arrayColumn(result.values, 6),
        },
        {
          label: "Violaxanthin",
          data: arrayColumn(result.values, 7),
        },
      ],
    };
  });

  let lineData2 = $derived.by(() => {
    return {
      labels: result2.time,
      datasets: [
        {
          label: "ATP",
          data: arrayColumn(result2.values, 0),
        },
        {
          label: "Plastoquinone (oxidised)",
          data: arrayColumn(result2.values, 1),
        },
        {
          label: "Plastocyanine (oxidised)",
          data: arrayColumn(result2.values, 2),
        },
        {
          label: "Ferredoxine",
          data: arrayColumn(result2.values, 3),
        },
        {
          label: "protons_lumen",
          data: arrayColumn(result2.values, 4),
        },
        {
          label: "Light-harvesting complex",
          data: arrayColumn(result2.values, 5),
        },
        {
          label: "PsbS (de-protonated)",
          data: arrayColumn(result2.values, 6),
        },
        {
          label: "Violaxanthin",
          data: arrayColumn(result2.values, 7),
        },
      ],
    };
  });
</script>

<h1>Non-photochemical quenching</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<LineChart data={lineData} {yLim} />
<LineChart data={lineData2} {yLim} />
<div>
  <label>
    <span>PPFD</span>
    <input type="range" bind:value={ppfd} min="10.0" max="100.0" step="10" />
  </label>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
