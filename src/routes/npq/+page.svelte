<script lang="ts">
	import { rk45 } from '$lib/integrators/explicit/rk45';
	import LineChart from '$lib/plots/lineChart.svelte';
	import { model } from './model';

	function arrayColumn<T>(arr: Array<Array<T>>, n: number): Array<T> {
		return arr.map((x) => x[n]);
	}

	let ppfd = $state(100);
	let yLim = $state(8);

	let result = $derived.by(() => {
		return rk45(model, {
			initialValues: [
				1.6999999999999997, 4.706348349506148, 3.9414515288091567, 3.7761613271207324,
				7.737821100836988, 0.5105293511676007, 0.5000000001374878, 0.09090909090907397
			],
			tEnd: 50,
			pars: [ppfd]
		});
		// return euler(model, {
		// 	initialValues: [
		// 		1.6999999999999997, 4.706348349506148, 3.9414515288091567, 3.7761613271207324,
		// 		7.737821100836988, 0.5105293511676007, 0.5000000001374878, 0.09090909090907397
		// 	],
		// 	tEnd: 50,
		// 	stepSize: 0.01,
		// 	pars: [ppfd]
		// });
	});

	let lineData = $derived.by(() => {
		console.log(result.time.length);
		return {
			labels: result.time,
			datasets: [
				{
					label: 'ATP',
					data: arrayColumn(result.values, 0)
				},
				{
					label: 'Plastoquinone (oxidised)',
					data: arrayColumn(result.values, 1)
				},
				{
					label: 'Plastocyanine (oxidised)',
					data: arrayColumn(result.values, 2)
				},
				{
					label: 'Ferredoxine',
					data: arrayColumn(result.values, 3)
				},
				{
					label: 'protons_lumen',
					data: arrayColumn(result.values, 4)
				},
				{
					label: 'Light-harvesting complex',
					data: arrayColumn(result.values, 5)
				},
				{
					label: 'PsbS (de-protonated)',
					data: arrayColumn(result.values, 6)
				},
				{
					label: 'Violaxanthin',
					data: arrayColumn(result.values, 7)
				}
			]
		};
	});
</script>

<h1>Non-photochemical quenching</h1>
<p>Quick and dirty demo to get ODE integration running on the client-side.</p>

<LineChart data={lineData} {yLim} />
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
