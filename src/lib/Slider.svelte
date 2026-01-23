<script lang="ts">
  let {
    name,
    val: finalValue = $bindable(),
    min,
    max,
    step,
    callback,
  }: {
    val: number;
    min: string;
    max: string;
    step: string;
    name: string;
    callback?: () => void;
  } = $props();

  let liveVal = $state(finalValue);

  let dragging = false;

  function startDrag() {
    dragging = true;
  }

  function stopDrag() {
    dragging = false;
    finalValue = liveVal;
    console.log(`New slider value: ${liveVal}`);
    if (callback) callback();
  }
</script>

<label>
  <span>{name}: {liveVal}</span>
  <input
    type="range"
    {min}
    {max}
    {step}
    bind:value={liveVal}
    onmousedown={startDrag}
    onmouseup={stopDrag}
    ontouchstart={startDrag}
    ontouchend={stopDrag}
  />
</label>

<style>
  span {
    font-size: 0.8rem;
  }
  label {
    padding: 0 0.5rem;
  }
</style>
