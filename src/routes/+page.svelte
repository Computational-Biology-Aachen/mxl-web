<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import { euler } from "$lib/integrators/explicit";
  import { wa_lotka_volterra } from "$lib/pkg/wa_integrate";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  let alpha = $state(0.1);
  let beta = $state(0.02);
  let gamma = $state(0.4);
  let delta = $state(0.02);

  let yLim = $state(100);

  function lotka_volterra(t: number, vars: number[], pars: number[]) {
    let [prey, pred] = vars;
    let [alpha, beta, gamma, delta] = pars;
    let dxdt = alpha * prey - beta * prey * pred;
    let dydt = -gamma * pred + delta * prey * pred;
    return [dxdt, dydt];
  }

  let result = $derived.by(() => {
    let tStart = Date.now();
    let res = euler(lotka_volterra, {
      initialValues: [10.0, 10.0],
      tEnd: 100,
      stepSize: 0.01,
      pars: [alpha, beta, gamma, delta],
    });
    console.log(`Javascript Integration took ${Date.now() - tStart} ms`);
    return res;
  });
  let result2 = $derived.by(() => {
    let tStart = Date.now();
    let res = wa_lotka_volterra([10.0, 10.0], [alpha, beta, gamma, delta]);
    console.log(`WebAssembly Integration took ${Date.now() - tStart} ms`);
    return res;
  });

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        {
          label: "Prey",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "Predator",
          data: arrayColumn(result.values, 1),
        },
      ],
    };
  });
  let lineData2 = $derived.by(() => {
    return {
      labels: result2.time,
      datasets: [
        {
          label: "Prey",
          data: arrayColumn(result2.values, 0),
        },
        {
          label: "Predator",
          data: arrayColumn(result2.values, 1),
        },
      ],
    };
  });
</script>

<h1>MxL web</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<LineChart data={lineData} {yLim} />
<LineChart data={lineData2} {yLim} />
<div>
  <label>
    <span>Alpha</span>
    <input type="number" bind:value={alpha} min="0.01" max="1.0" step="0.05" />
  </label>
  <label>
    <span>Beta</span>
    <input type="number" bind:value={beta} min="0.01" max="1.0" step="0.05" />
  </label>
  <label>
    <span>Gamma</span>
    <input type="number" bind:value={gamma} min="0.01" max="1.0" step="0.05" />
  </label>
  <label>
    <span>Delta</span>
    <input type="number" bind:value={delta} min="0.01" max="1.0" step="0.001" />
  </label>
</div>

<style>
  div {
    display: flex;
    flex-direction: row;
  }
</style>
