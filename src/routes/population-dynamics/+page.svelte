<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import { euler } from "$lib/integrators/explicit/euler";
  import Math from "$lib/Math.svelte";
  import Slider from "$lib/Slider.svelte";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  let mu_e = $state(0.4);
  let mu_c = $state(0.3);
  let a_e = $state(6.0);
  let a_c = $derived(10 - a_e);
  //let delta_e = $state(0.01);
  let theta = $state(0.001);

  // Initial conditions
  let e0 = $state(5.0);
  let c0 = $state(5.0);

  // Simulation settings
  let tEnd = $state(100);
  let yLim = undefined;

  function model(t: number, vars: number[], pars: number[]) {
    const [e, c] = vars;
    const [mu_e, mu_c, a_e, a_c, theta] = pars;

    // Rates
    const v0 = e * a_e * mu_e;
  

    const dEdt = v0 ;
    const dCdt = c * a_c * mu_c - c * theta * c;
    return [dEdt, dCdt];
  }

  let result = $derived.by(() => {
    // return rk45(model, {
    // 	initialValues: [e0, c0],
    // 	tEnd: tEnd,
    // 	pars: [mu_e, mu_c, a_e, a_c, delta_e, theta]
    // });
    return euler(model, {
      initialValues: [e0, c0],
      tEnd: tEnd,
      stepSize: 0.01,
      pars: [mu_e, mu_c, a_e, a_c, theta],
    });
  });

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        {
          label: "E. coli",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "C. glutamicum",
          data: arrayColumn(result.values, 1),
        },
      ],
    };
  });
  const eqE = String.raw`\frac{dE}{dt} = E\,a_e\,\mu_e`;
  const eqC = String.raw`\frac{dC}{dt} = C\,a_c\,\mu_c - \theta\,C^2`;
</script>

<h1>Population dynamics</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqE} display />
  <Math tex={eqC} display />
</section>

<h3>Initial conditions & settings</h3>
<div class="row">
  <Slider name="E. coli" bind:val={e0} min="0.0" max="1000.0" step="1" />
  <Slider name="C. glutamicum" bind:val={c0} min="0.0" max="1000.0" step="1" />
  <Slider
    name="Simulate until"
    bind:val={tEnd}
    min="1.0"
    max="10000.0"
    step="1"
  />
</div>
<div class="row">
  <Slider
    name="E. coli growth rate"
    bind:val={mu_e}
    min="0.0"
    max="1.0"
    step="0.05"
  />
  <Slider
    name="E. coli affinity"
    bind:val={a_e}
    min="0.0"
    max="10.0"
    step="0.5"
  />
  <Slider
    name="C. glut growth rate"
    bind:val={mu_c}
    min="0.0"
    max="1.0"
    step="0.05"
  />  
  <Slider
    name="C. glut affinity"
    bind:val={a_c}
    min="0.0"
    max="10.0"
    step="0.5" 
  />
  <Slider
    name="C. glut density loss"
    bind:val={theta}
    min="0.0"
    max="1.0"
    step="0.05"
  />
</div>
<LineChart data={lineData} yMax={yLim} />

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
