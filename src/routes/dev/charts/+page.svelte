<script lang="ts">
  import LineChart from "$lib/chartjs/LineChart.svelte";

  type LineData = {
    labels: number[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  let data: LineData = {
    labels: [0, 1, 2, 3, 4, 5, 6],
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };
  let yMax = $state(100);
  $inspect(yMax);
</script>

<LineChart
  data={data}
  yMax={yMax}
  loading={false}
/>

<button
  onclick={() => {
    yMax = yMax / 2;
  }}>Half</button
>
<button
  onclick={() => {
    yMax = 100;
  }}>Reset</button
>
