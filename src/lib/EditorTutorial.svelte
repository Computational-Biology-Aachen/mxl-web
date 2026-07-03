<!--
  @component

  Guided, step-by-step overlay for the model editors. Renders as a manual
  `[popover]` so it sits in the top layer above the editor popover — and, after
  re-raising itself, above the nested equation-editor popover it drives the user
  into. Spotlights one element per step with a dimming cutout and a tooltip card.

  Start it imperatively:

  ```svelte
  <EditorTutorial bind:this={tour} steps={steps} openEqEditor={...} closeEqEditor={...} />
  <Button onclick={() => tour.start()}>Tutorial</Button>
  ```
-->
<script lang="ts">
  import { tick } from "svelte";
  import type { TutorialStep } from "./tutorial";

  let {
    steps,
    openEqEditor,
    closeEqEditor,
  }: {
    steps: TutorialStep[];
    openEqEditor: () => Promise<void> | void;
    closeEqEditor: () => void;
  } = $props();

  let el = $state<HTMLDivElement>();
  let open = $state(false);
  let index = $state(0);
  let rect = $state<DOMRect | null>(null);
  // Whether the equation-editor popover is currently open on our behalf.
  let eqOpen = false;

  export async function start(): Promise<void> {
    open = true;
    index = 0;
    eqOpen = false;
    rect = null;
    await tick();
    await goto(0);
  }

  // Move the overlay to the front of the top layer. Popovers stack in the order
  // they entered it, so after opening the equation editor we must re-enter to
  // stay on top. Hiding + showing in one task avoids a visible flash.
  function raise(): void {
    if (!el) return;
    if (el.matches(":popover-open")) el.hidePopover();
    el.showPopover();
  }

  async function measure(): Promise<void> {
    await tick();
    const target = steps[index]?.target?.() ?? null;
    if (target) {
      target.scrollIntoView({ block: "center", inline: "center" });
      await tick();
      rect = target.getBoundingClientRect();
    } else {
      rect = null;
    }
  }

  async function goto(next: number): Promise<void> {
    const step = steps[next];
    if (!step) return;

    // Reconcile the equation editor with what this step needs. Equation steps
    // re-open it every time, because advancing the tour light-dismisses the
    // popover (the card sits outside it).
    if (step.requiresEqEditor) {
      await openEqEditor();
      eqOpen = true;
    } else if (eqOpen) {
      closeEqEditor();
      eqOpen = false;
    }

    index = next;
    await step.onEnter?.();
    raise();
    await measure();
  }

  function nextStep(): void {
    if (index >= steps.length - 1) {
      finish();
    } else {
      goto(index + 1);
    }
  }

  function prevStep(): void {
    if (index > 0) goto(index - 1);
  }

  function finish(): void {
    if (eqOpen) {
      closeEqEditor();
      eqOpen = false;
    }
    if (el?.matches(":popover-open")) el.hidePopover();
    open = false;
    rect = null;
  }

  $effect(() => {
    if (!open) return;
    function onKeydown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
      } else if (event.key === "ArrowRight") {
        nextStep();
      } else if (event.key === "ArrowLeft") {
        prevStep();
      }
    }
    function onReflow(): void {
      measure();
    }
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  });

  let cardStyle = $derived.by(() => {
    if (typeof window === "undefined") return "";
    const width = Math.min(360, window.innerWidth - 32);
    if (!rect) {
      return `width:${width}px; top:50%; left:50%; transform:translate(-50%,-50%);`;
    }
    const margin = 16;
    const left = Math.max(
      margin,
      Math.min(rect.left, window.innerWidth - width - margin),
    );
    const estHeight = 220;
    const top =
      window.innerHeight - rect.bottom > estHeight + margin
        ? rect.bottom + margin
        : Math.max(margin, rect.top - margin - estHeight);
    return `width:${width}px; top:${top}px; left:${left}px;`;
  });

  let spotlightStyle = $derived(
    rect
      ? `top:${rect.top - 6}px; left:${rect.left - 6}px; width:${rect.width + 12}px; height:${rect.height + 12}px;`
      : "",
  );
</script>

{#if open}
  {@const step = steps[index]}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    popover="manual"
    bind:this={el}
    class="tour"
    onclick={finish}
  >
    {#if rect}
      <div
        class="spotlight"
        style={spotlightStyle}
      ></div>
    {:else}
      <div class="dim"></div>
    {/if}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="card"
      style={cardStyle}
      onclick={(event) => event.stopPropagation()}
    >
      <div class="card-head">
        <span class="count">{index + 1} / {steps.length}</span>
        <button
          class="quit"
          aria-label="Quit tutorial"
          onclick={finish}>✕</button
        >
      </div>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
      <div class="card-actions">
        <button
          class="ghost"
          disabled={index === 0}
          onclick={prevStep}>Back</button
        >
        <button
          class="primary"
          onclick={nextStep}
          >{index === steps.length - 1 ? "Done" : "Next"}</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .tour {
    margin: 0;
    inset: 0;
    border: none;
    background: transparent;
    padding: 0;
    width: 100vw;
    max-width: 100vw;
    height: 100vh;
    max-height: 100vh;
    overflow: visible;
  }

  .dim {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
  }

  .spotlight {
    position: fixed;
    transition:
      top 0.2s ease,
      left 0.2s ease,
      width 0.2s ease,
      height 0.2s ease;
    box-shadow:
      0 0 0 9999px rgba(15, 23, 42, 0.55),
      0 0 0 3px var(--color-accent);
    border-radius: var(--radius-md);
    pointer-events: none;
  }

  .card {
    display: flex;
    position: fixed;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: var(--shadow);
    border-radius: var(--radius-lg);
    background: var(--color-bg, #fff);
    padding: 1.25rem;
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .count {
    color: var(--slate-500);
    font-weight: 700;
    font-size: 0.75rem;
    letter-spacing: 0.06em;
  }

  .quit {
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0.25rem;
    color: var(--slate-500);
    font-size: 1rem;
    line-height: 1;
  }

  .quit:hover {
    color: var(--color-primary);
  }

  h3 {
    margin: 0;
    color: var(--color-primary);
    font-size: 1.05rem;
  }

  p {
    margin: 0;
    color: var(--slate-600, #475569);
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .card-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .card-actions button {
    cursor: pointer;
    border-radius: var(--radius-md);
    padding: 0.4rem 1rem;
    font-weight: 500;
    font-size: 0.875rem;
    font-family: var(--font-sans);
  }

  .ghost {
    border: 1px solid var(--slate-300, #cbd5e1);
    background: transparent;
    color: var(--slate-600, #475569);
  }

  .ghost:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .primary {
    border: none;
    background: var(--color-primary);
    color: var(--color-text-inverse, #fff);
  }
</style>
