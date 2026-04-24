<script lang="ts">
  let {
    name,
    href,
    image,
  }: {
    name: string;
    href: string;
    image?: string;
  } = $props();
</script>

<a
  href={href}
  class="card"
>
  <div class="media">
    {#if image}
      <img
        src={image}
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
    display: flex;
    flex-direction: column;
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background: var(--bg-l1);
    overflow: hidden;
    color: var(--slate);
    text-decoration: none;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow:
      2px 5px 12px 0 rgba(0, 0, 0, 0.15),
      var(--shadow-primary);
    color: var(--primary);

    .fallback {
      background: linear-gradient(
        135deg,
        rgba(from var(--slate-500) r g b / 1) 0%,
        rgba(from var(--slate) r g b / 1) 100%
      );
    }
  }

  .media {
    flex-shrink: 0;
    height: 160px;
    overflow: hidden;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fallback {
    --alpha: 0.8;
    display: flex;
    justify-content: center;
    align-items: center;
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    /* background: linear-gradient(
      45deg,
      var(--primary) 0%,
      lch(from var(--primary) calc(l - 10) c h) 100%
    ); */
    background: linear-gradient(
      135deg,
      rgba(from var(--slate-500) r g b / var(--alpha)) 0%,
      rgba(from var(--slate) r g b / var(--alpha)) 100%
    );
    width: 100%;
    height: 100%;
  }

  .fallback span {
    color: rgba(255, 255, 255, 0.85);
    font-size: 3rem;
  }

  .label {
    padding: 0.75rem 1rem;
    font-weight: var(--weight-medium);
    font-size: var(--text-sm);
  }
</style>
