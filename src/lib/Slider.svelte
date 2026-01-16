<script lang="ts">
  let {
    name,
    val: finalValue = $bindable(),
    min,
    max,
    step,
    disabled = false,
    callback,
  }: {
    val: number;
    min: string;
    max: string;
    step: string;
    name: string;
    disabled?: boolean;
    callback?: () => void;
  } = $props();

  let liveVal = $state(finalValue);
  let dragging = false;

  // Sync liveVal with finalValue when not dragging (external updates like reset)
  $effect(() => {
    if (!dragging) {
      liveVal = finalValue;
    }
  });

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
    {disabled}
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
