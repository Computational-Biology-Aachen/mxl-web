<script lang="ts">
  import LineChart from "$lib/chartjs/lineChart.svelte";
  import { euler } from "$lib/integrators/explicit/euler";
  import Math from "$lib/Math.svelte";
  import Slider from "$lib/Slider.svelte";

  function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
    return arr.map((x) => x[n]);
  }

  // == Parameters ====
  let r_p = $state(0.4); // intrinsic growth (Public, P)
  let r_m = $state(0.2); // intrinsic growth (Private, M)
  let alpha = $state(0.0002); // cooperation: P→C
  let beta = $state(0.0001); // competition: P↔M
  let eta = $state(0.0001); // density constraint for P
  let gamma = $state(0.0001); // density constraint for M
  let nu = $state(0.00001); // density constraint for C

  // = Initial conditions =
  let p0 = $state(1.0); // Public metabolizers (P)
  let c0 = $state(1.0); // Cheaters (C)
  let m0 = $state(1.0); // Private metabolizers (M)

  // == Simulation settings ===
  let tEnd = $state(100);
  let yLim = undefined;

  // Eq.
  // dP/dt = r_p·P − α·P·C − β·P·M − η·P^2
  // dC/dt = α·P·C − ν·C^2
  // dM/dt = r_m·M − β·M·P − γ·M^2
  const eqs = String.raw`
  \begin{align*}
    \frac{dP}{dt} &= r_p\,P - \alpha\,P\,C - \beta\,P\,M - \eta\,P^2 \\
    \frac{dC}{dt} &= \alpha\,P\,C - \nu\,C^2 \\
    \frac{dM}{dt} &= r_m\,M - \beta\,M\,P - \gamma\,M^2 \\
  \end{align*}
    `;
  function model(t: number, vars: number[], pars: number[]) {
    const [P, C, M] = vars;
    const [r_p, r_m, alpha, beta, eta, gamma, nu] = pars;

    const dPdt = r_p * P - alpha * P * C - beta * P * M - eta * P * P;
    const dCdt = alpha * P * C - nu * C * C;
    const dMdt = r_m * M - beta * M * P - gamma * M * M;

    return [dPdt, dCdt, dMdt];
  }

  let result = $derived.by(() => {
    // return rk45(model, {
    // 	initialValues: [e0, c0],
    // 	tEnd: tEnd,
    // 	pars: [mu_e, mu_c, a_e, a_c, delta_e, theta]
    // });
    return euler(model, {
      initialValues: [p0, c0, m0],
      tEnd: tEnd,
      stepSize: 0.01,
      pars: [r_p, r_m, alpha, beta, eta, gamma, nu],
    });
  });

  let lineData = $derived.by(() => {
    return {
      labels: result.time,
      datasets: [
        {
          label: "Public",
          data: arrayColumn(result.values, 0),
        },
        {
          label: "Cheaters",
          data: arrayColumn(result.values, 1),
        },
        {
          label: "Private",
          data: arrayColumn(result.values, 2),
        },
      ],
    };
  });
</script>

<h1>Tripartite population dynamics</h1>

<p>
  Dynamic model of a tripartite population of <b>P</b>ublic consumers,
  <b>C</b>heaters and <b>P</b>rivate consumers.
</p>

<h3>Model equations</h3>

<Math tex={eqs} display />

<h3>Initial conditions & settings</h3>
<div class="grid-row">
  <span>Initial conditions</span>
  <div class="inner-row">
    <Slider name="Public" bind:val={p0} min="0.0" max="10000.0" step="1" />
    <Slider name="Cheaters" bind:val={c0} min="0.0" max="10000.0" step="1" />
    <Slider name="Private" bind:val={m0} min="0.0" max="10000.0" step="1" />
    <Slider
      name="Simulate until t"
      bind:val={tEnd}
      min="1.0"
      max="10000.0"
      step="10"
    />
  </div>
</div>

<div class="grid-row">
  <span>Public (P)</span>
  <div class="inner-row">
    <Slider
      name="r_p (growth rate)"
      bind:val={r_p}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
    <Slider
      name="η (density)"
      bind:val={eta}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
  </div>
</div>

<div class="grid-row">
  <span>Cheaters (C)</span>
  <div class="inner-row">
    <Slider
      name="ν (density)"
      bind:val={nu}
      min="0.0"
      max="1.0"
      step="0.00001"
    />
  </div>
</div>
<div class="grid-row">
  <span>Private (M)</span>
  <div class="inner-row">
    <Slider
      name="r_m (growth rate)"
      bind:val={r_m}
      min="0.0"
      max="5.0"
      step="0.0001"
    />
    <Slider
      name="γ (density)"
      bind:val={gamma}
      min="0.0"
      max="5.0"
      step="0.0001"
    />
  </div>
</div>
<div class="grid-row">
  <span>Interaction</span>
  <div class="inner-row">
    <Slider
      name="α (P→C cooperation)"
      bind:val={alpha}
      min="0.0"
      max="1.0"
      step="0.0001"
    />
    <Slider
      name="β (P↔M competition)"
      bind:val={beta}
      min="0.0"
      max="1.0"
      step="0.0001"
    />
  </div>
</div>

<LineChart data={lineData} yMax={yLim} />

<style>
  span {
    font-size: 0.8rem;
    font-weight: 700;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 5rem 1fr;
  }
  .inner-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, 10rem);
    align-items: center;
    gap: 0 1rem;
  }
</style>
