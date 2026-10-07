<script lang="ts">
  let {
    value = $bindable(),
    id,
    label = "Value",
  }: {
    value: number;
    id: string;
    label?: string;
  } = $props();

  let focused = $state(false);
  let draft = $state("");

  // Unfocused display is rounded to 6 significant digits; the stored value
  // is never touched, and focusing shows it in full.
  let shown = $derived.by(() => {
    const full = String(value);
    const short = String(Number(value.toPrecision(6)));
    return short.length < full.length ? short : full;
  });

  function commit() {
    focused = false;
    const parsed = Number(draft);
    if (draft.trim() !== "" && Number.isFinite(parsed) && parsed !== value) {
      value = parsed;
    }
  }
</script>

<input
  id={id}
  class="number"
  type="text"
  inputmode="decimal"
  aria-label={label}
  title={String(value)}
  value={focused ? draft : shown}
  onfocus={(e) => {
    draft = String(value);
    focused = true;
    e.currentTarget.select();
  }}
  oninput={(e) => (draft = e.currentTarget.value)}
  onblur={commit}
  onkeydown={(e) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      draft = String(value);
      e.currentTarget.blur();
    }
  }}
/>

<style>
  .number {
    border: var(--border-transparent);
    border-radius: var(--radius-lg);
    background-color: transparent;
    padding: 0.35rem 0.5rem;
    width: 100%;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .number:hover,
  .number:focus {
    border: var(--border-primary);
  }
</style>
