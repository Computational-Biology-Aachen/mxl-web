<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import { euler } from "$lib/integrators/explicit/euler";
  import Math from "$lib/Math.svelte";
  import Slider from "$lib/Slider.svelte";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  // Parameters
  let mu_e = $state(0.4);
  let mu_c = $state(0.3);

  let a_e = $state(0.1);
  let a_c = $derived(1 - a_e);

  let K_e = $state(0.5);
  let K_c = $state(0.5);

  let delta_e = $state(0.01);
  let theta = $state(0.001);

  let r_prod = $state(0.2);
  let r_cons_e = $state(1.0);
  let r_cons_c = $state(1.0);

  // Initial conditions
  let e0 = $state(5.0);
  let c0 = $state(5.0);
  let b0 = $state(1.0);

  // Simulation settings
  let tEnd = $state(100);
  let yLim = undefined;

  // ODE model (E, C, B)
  function model(t: number, vars: number[], pars: number[]) {
    const [E, C, B] = vars;
    const [
      mu_e, mu_c, a_e, a_c, K_e, K_c, delta_e, theta, r_prod, r_cons_e, r_cons_c
    ] = pars;

    // Monod terms for growth
    const uptake_E_growth = (a_e * B) / (K_e + B);
    const uptake_C_growth = (a_c * B) / (K_c + B);

    // Consumption terms in dB/dt (as specified: K + a*B)
    const cons_term_E = mu_e * ((a_e * B) / (K_e + a_e * B)) * E;
    const cons_term_C = mu_c * ((a_c * B) / (K_c + a_c * B)) * C;

    const dEdt = mu_e * uptake_E_growth * E - delta_e * E;
    const dCdt = mu_c * uptake_C_growth * C - theta * C * C;
    const dBdt = r_prod * E - r_cons_e * cons_term_E - r_cons_c * cons_term_C;

    return [dEdt, dCdt, dBdt];
  }

  let result = $derived.by(() => {
    return euler(model, {
      initialValues: [e0, c0, b0],
      tEnd: tEnd,
      stepSize: 0.01,
      pars: [
        mu_e, mu_c, a_e, a_c, K_e, K_c, delta_e, theta, r_prod, r_cons_e, r_cons_c
      ],
    });
  });

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        { label: "E. coli (E)", data: arrayColumn(result.values, 0) },
        { label: "C. glutamicum (C)", data: arrayColumn(result.values, 1) },
        { label: "Enterobactin (B)", data: arrayColumn(result.values, 2) },
      ],
    };
  });

  const eqE = String.raw`\frac{dE}{dt}=\mu_E\,\frac{a_E\,B}{K_E+B}\,E-\delta_E\,E`;
  const eqC = String.raw`\frac{dC}{dt}=\mu_C\,\frac{a_C\,B}{K_C+B}\,C-\theta\,C^2`;
  const eqB = String.raw`\frac{dB}{dt}=r_{\text{prod}}\,E - r_{\text{cons,E}}\!\left(\mu_E\,\frac{a_E\,B}{K_E+a_E\,B}\,E\right) - r_{\text{cons,C}}\!\left(\mu_C\,\frac{a_C\,B}{K_C+a_C\,B}\,C\right)`;
</script>

<h1>Dynamic-Entrobactin</h1>
<section>
  <h3>Model equations</h3>
  <Math tex={eqE} display />
  <Math tex={eqC} display />
  <Math tex={eqB} display />
</section>

<h3>Initial conditions & settings</h3>
<div class="row">
  <Slider name="E. coli" bind:val={e0} min="0.0" max="1000.0" step="1" />
  <Slider name="C. glutamicum" bind:val={c0} min="0.0" max="1000.0" step="1" />
  <Slider name="Enterobactin (B₀)" bind:val={b0} min="0.0" max="1000.0" step="0.5" />
  <Slider name="Simulate until" bind:val={tEnd} min="1.0" max="10000.0" step="1" />
</div>

<div class="row">
  <Slider name="E. coli growth rate (μ_E)" bind:val={mu_e} min="0.0" max="2.0" step="0.01" />
  <Slider name="E. coli affinity (a_E)" bind:val={a_e} min="0.0" max="1.0" step="0.01" />
  <Slider name="C. glut growth rate (μ_C)" bind:val={mu_c} min="0.0" max="2.0" step="0.01" />
  <Slider name="C. glut affinity (a_C = 1 - a_E)" bind:val={a_c} min="0.0" max="1.0" step="0.01" disabled />
</div>

<div class="row">
  <Slider name="K_E (half-sat E)" bind:val={K_e} min="0.00000001" max="1.0" step="0.000001" />
  <Slider name="K_C (half-sat C)" bind:val={K_c} min="0.00000001" max="1.0" step="0.000001" />
  <Slider name="E production cost (δ_E)" bind:val={delta_e} min="0.0" max="1.0" step="0.000001" />
  <Slider name="C density loss (θ)" bind:val={theta} min="0.0" max="1.0" step="0.0001" />
</div>

<div class="row">
  <Slider name="B production by E (r_prod)" bind:val={r_prod} min="0.0" max="5.0" step="0.0001" />
  <Slider name="B consumption weight E (r_cons,E)" bind:val={r_cons_e} min="0.0" max="5.0" step="0.0001" />
  <Slider name="B consumption weight C (r_cons,C)" bind:val={r_cons_c} min="0.0" max="5.0" step="0.0001" />
</div>

<LineChart data={lineData} {yLim} />

<style>
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
</style>
