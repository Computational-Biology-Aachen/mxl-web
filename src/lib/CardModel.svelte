<!--
  @component

  A linked card representing a model, showing its scheme image (or a gradient
  "biotech" placeholder) above a name label.

  ### Props

  - `name: string`
    Model name shown in the label and image `alt` text.
  - `href: string`
    Destination the whole card links to.
  - `image?: string`
    Optional scheme image URL; omitted shows the placeholder.
  - `styleVars?: { mediaHeight?: string; fallbackIconSize?: string }`
    Optional overrides for CSS custom properties.

  ### Example

  ```svelte
  <CardModel name="Poolman 2000" href="/models/poolman2000" image="/p2000.svg" />
  ```
-->
<script lang="ts">
  import { toStyleString } from "./utils";
  let {
    name,
    href,
    image,
    consortium,
    styleVars = {},
  }: {
    name: string;
    href: string;
    image?: string;
    consortium?: string;
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
</script>

<a
  href={href}
  class="card"
  style={toStyleString(cardCssVars)}
>
  {#if consortium}
    <img
      src={consortium}
      class="logo"
      alt="consortium logo"
    />
  {/if}
  <div class="media">
    {#if image}
      <img
        src={image}
        class="scheme"
        alt="{name} scheme"
      />
    {:else}
      <div class="fallback">
        <span class="material-symbols-outlined">biotech</span>
      </div>
    {/if}
  </div>
  <div class="label">
    <span>{name}</span>
  </div>
</a>

<style>
  .card {
    --card-model-media-height: 160px;
    --card-model-fallback-icon-size: 3rem;
    display: flex;
    position: relative;
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
    z-index: 100;
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

  .label {
    padding: 0.75rem 1rem;
    font-weight: var(--weight-medium);
    font-size: var(--text-sm);
  }
</style>
