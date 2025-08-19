<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import type { Integration } from "$lib/integrators";
  import { kvaerno45 } from "$lib/integrators/implicit/kvaerno45";
  import type { Protocol } from "$lib/simulations/pam";
  import { pam } from "$lib/simulations/pam";
  import { model } from "./model";

  type LineData = {
    labels: number[];
    datasets: {
      label: string;
      data: any;
    }[];
  };

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  function mapResults(result: Integration): LineData {
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
  }

  // Line chart
  let ppfd = $state(100);
  let yLim = $state(8);
  let result = $derived.by(() => {
    return kvaerno45(model, {
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
  });
  let lineData = $derived.by(() => {
    return mapResults(result);
  });

  // PAM chart
  let pulsePpfd = $state(1500);
  let protocol: Protocol = $derived.by(() => {
    return [
      { tEnd: 4, pars: [100] },
      { tEnd: 5, pars: [pulsePpfd] },
      { tEnd: 14, pars: [100] },
      { tEnd: 15, pars: [pulsePpfd] },
      { tEnd: 24, pars: [100] },
      { tEnd: 25, pars: [pulsePpfd] },
      { tEnd: 34, pars: [100] },
    ];
  });
  let pamResult: Integration = $derived.by(() => {
    return pam(model, protocol, kvaerno45, {
      initialValues: [
        1.6999999999999997, 4.706348349506148, 3.9414515288091567,
        3.7761613271207324, 7.737821100836988, 0.5105293511676007,
        0.5000000001374878, 0.09090909090907397,
      ],
      tEnd: 0, // FIXME: change interface to remove this
      pars: [ppfd],
      rtol: 1e-4,
      atol: 1e-4,
    });
  });
  let pamData: LineData = $derived.by(() => mapResults(pamResult));
</script>

<h1>Non-photochemical quenching</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<LineChart data={lineData} {yLim} />
<div>
  <label>
    <span>PPFD: {ppfd}</span>
    <input type="range" bind:value={ppfd} min="50.0" max="100.0" step="10" />
  </label>
</div>

<h2>PAM Simulation</h2>

<LineChart data={pamData} />
<div>
  <label>
    <span>Pulse PPFD: {pulsePpfd}</span>
    <input
      type="range"
      bind:value={pulsePpfd}
      min="1000.0"
      max="2000.0"
      step="100"
    />
  </label>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
