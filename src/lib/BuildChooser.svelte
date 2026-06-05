<script lang="ts">
  import { base } from "$app/paths";
  import { Popover } from "@computational-biology-aachen/design";

  let el: HTMLDivElement | null | undefined = $state();
</script>

<Popover
  size="sm"
  popovertarget="build-chooser"
  bind:el={el}
>
  <div class="build-chooser">
    <hgroup>
      <h3>Build your own model</h3>
      <p>Choose how you want to define your system.</p>
    </hgroup>
    <div class="card-row">
      <a
        href="{base}/new/ode"
        class="model-card"
        onclick={() => el?.hidePopover()}
      >
        <figure
          class="graphic"
          aria-hidden="true"
        >
          <!-- Time-series trajectory representing dx/dt = f(x,t) -->
          <svg
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="14"
              y1="64"
              x2="14"
              y2="8"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <line
              x1="14"
              y1="64"
              x2="106"
              y2="64"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <polyline
              points="11,11 14,8 17,11"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <polyline
              points="103,61 106,64 103,67"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M16,58 C28,58 32,14 54,22 S80,50 104,28"
              stroke="var(--color-primary)"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <text
              x="5"
              y="12"
              font-size="11"
              fill="currentColor"
              font-style="italic"
              font-family="serif">x</text
            >
            <text
              x="100"
              y="76"
              font-size="11"
              fill="currentColor"
              font-style="italic">t</text
            >
          </svg>
        </figure>
        <h4>ODE model</h4>
        <p>Write <em>dx/dt</em> directly</p>
      </a>

      <a
        href="{base}/new/kinetic"
        class="model-card"
        onclick={() => el?.hidePopover()}
      >
        <figure
          class="graphic"
          aria-hidden="true"
        >
          <!-- Reaction network A → B representing N·v stoichiometry -->
          <svg
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="22"
              cy="36"
              r="14"
              stroke="var(--color-primary)"
              stroke-width="1.5"
            />
            <text
              x="22"
              y="41"
              text-anchor="middle"
              font-size="14"
              fill="currentColor">A</text
            >
            <line
              x1="36"
              y1="36"
              x2="80"
              y2="36"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <polyline
              points="77,33 80,36 77,39"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <text
              x="58"
              y="29"
              text-anchor="middle"
              font-size="10"
              fill="currentColor"
              font-style="italic">v(A)</text
            >
            <text
              x="34"
              y="59"
              font-size="9"
              fill="var(--color-primary)"
              font-weight="600">−1</text
            >
            <text
              x="80"
              y="59"
              font-size="9"
              fill="var(--color-accent)"
              font-weight="600">+1</text
            >
            <circle
              cx="96"
              cy="36"
              r="14"
              stroke="var(--color-accent)"
              stroke-width="1.5"
            />
            <text
              x="96"
              y="41"
              text-anchor="middle"
              font-size="14"
              fill="currentColor">B</text
            >
          </svg>
        </figure>
        <h4>Kinetic model</h4>
        <p>Reactions &amp; stoichiometry</p>
      </a>
    </div>
  </div>
</Popover>

<style>
  .build-chooser {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .card-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 36rem) {
    .card-row {
      grid-template-columns: 1fr;
    }
  }

  .model-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-top-color 0.2s ease;
    box-shadow: var(--shadow-sm);
    border: var(--border);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    padding: 1.25rem;
    color: inherit;
    text-decoration: none;
  }

  .model-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-primary);
  }

  .graphic {
    margin: 0;
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--color-primary) 6%, transparent);
    padding: 0.5rem;
    color: var(--color-text-muted);
  }

  .graphic svg {
    display: block;
    width: 100%;
    height: auto;
  }

  .model-card h4 {
    margin: 0;
    font-weight: 600;
    font-size: 1rem;
  }

  .model-card p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
</style>
