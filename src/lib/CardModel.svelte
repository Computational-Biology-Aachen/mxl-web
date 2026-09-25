<!--
  @component

  A linked card representing a model: its scheme image (or a gradient
  "biotech" placeholder), name, citation, a short description and chips for
  the model type and biological systems.

  ### Props

  - `model: ModelMeta`
    The model to display; see `models.ts`.
  - `href: string`
    Destination the whole card links to.
  - `styleVars?: { mediaHeight?: string; fallbackIconSize?: string }`
    Optional overrides for CSS custom properties.

  ### Example

  ```svelte
  <CardModel model={models[0]} href="/models/lotka-volterra" />
  ```
-->
<script lang="ts">
  import Chip from "./Chip.svelte";
  import { systemLabels, typeLabels, type ModelMeta } from "./models";
  import { toStyleString } from "./utils";

  const typeIcons: Record<ModelMeta["type"], string> = {
    ode: "timeline",
    "steady-state": "equalizer",
  };

  let {
    model,
    href,
    styleVars = {},
  }: {
    model: ModelMeta;
    href: string;
    styleVars?: {
      mediaHeight?: string;
      fallbackIconSize?: string;
    };
  } = $props();

  let cardCssVars = $derived({
    ...(styleVars.mediaHeight
      ? { "--card-model-media-height": styleVars.mediaHeight }
      : {}),
    ...(styleVars.fallbackIconSize
      ? { "--card-model-fallback-icon-size": styleVars.fallbackIconSize }
      : {}),
  });

  const citation = $derived(
    [model.authors, model.year && `(${model.year})`].filter(Boolean).join(" "),
  );
</script>

<a
  href={href}
  class="card"
  style={toStyleString(cardCssVars)}
>
  <div class="media">
    {#if model.image}
      <img
        src={model.image}
        class="scheme"
        alt="{model.name} scheme"
      />
    {:else}
      <div class="fallback">
        <span class="material-symbols-outlined">biotech</span>
      </div>
    {/if}
    {#if model.consortium}
      <img
        src={model.consortium}
        class="logo"
        alt="consortium logo"
      />
    {/if}
  </div>
  <div class="body">
    <div class="heading">
      <span class="name">{model.name}</span>
      {#if citation}
        <span class="citation">{citation}</span>
      {/if}
    </div>
    <p class="description">{model.description}</p>
    <div class="chips">
      <Chip
        label={typeLabels[model.type]}
        icon={typeIcons[model.type]}
      />
      {#each model.systems as system (system)}
        <Chip label={systemLabels[system]} />
      {/each}
    </div>
  </div>
</a>

<style>
  .card {
    --card-model-media-height: 160px;
    --card-model-fallback-icon-size: 3rem;
    display: flex;
    flex-direction: column;
    transition:
      transform var(--transition),
      box-shadow var(--transition);
    box-shadow: var(--shadow-md);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    overflow: hidden;
    color: var(--slate);
    text-decoration: none;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow:
      2px 5px 12px 0 rgba(0, 0, 0, 0.15),
      var(--shadow-primary);
    color: var(--color-primary);

    .fallback {
      background: linear-gradient(
        135deg,
        rgba(from var(--slate-300) r g b / 1) 0%,
        rgba(from var(--slate-500) r g b / 1) 100%
      );
    }
  }

  .media {
    position: relative;
    flex-shrink: 0;
    height: var(--card-model-media-height);
    overflow: hidden;
  }

  img.scheme {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  img.logo {
    display: block;
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 60px;
  }

  .fallback {
    --alpha: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
      transform var(--transition),
      box-shadow var(--transition);
    background: linear-gradient(
      135deg,
      rgba(from var(--slate-300) r g b / var(--alpha)) 0%,
      rgba(from var(--slate-500) r g b / var(--alpha)) 100%
    );
    width: 100%;
    height: 100%;
  }

  .fallback span {
    color: rgba(255, 255, 255, 0.85);
    font-size: var(--card-model-fallback-icon-size);
  }

  .body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4) var(--space-4);
  }

  .heading {
    display: flex;
    flex-direction: column;
  }

  .name {
    font-weight: var(--weight-bold);
    font-size: var(--text-h2);
  }

  .citation {
    color: var(--color-text-muted);
    font-size: var(--text-sm);
  }

  .description {
    display: -webkit-box;
    margin: 0;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
    color: var(--color-text);
    font-size: var(--text-sm);
    -webkit-box-orient: vertical;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    margin-top: auto;
    padding-top: var(--space-1);
  }
</style>
