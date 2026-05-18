<script lang="ts">
  import { onMount } from "svelte";

  type Logo = { src: string; href: string; alt: string; height?: string };

  interface Props {
    logos: Logo[];
    max?: number;
    maxMd?: number;
    maxSm?: number;
    speed?: number;
  }

  let { logos, max = 5, maxMd = 3, maxSm = 2, speed = 40 }: Props = $props();

  let containerWidth = $state(1200);

  const threshold = $derived(
    containerWidth < 768 ? maxSm : containerWidth < 1024 ? maxMd : max,
  );
  const scrolling = $derived(logos.length > threshold);
  const duration = $derived((logos.length * 150) / speed);
  const doubled = $derived([...logos, ...logos]);

  let container: HTMLDivElement | undefined = $state();

  onMount(() => {
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      containerWidth = entry.contentRect.width;
    });
    observer.observe(container);
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={container}
  class="logo-bar"
  class:scrolling={scrolling}
  style={scrolling ? `--duration: ${duration}s` : ""}
>
  {#if scrolling}
    <div class="track">
      {#each doubled as logo}
        <a href={logo.href}>
          <img
            class="logo"
            src={logo.src}
            alt={logo.alt}
            style="height: {logo.height ?? '5rem'}"
          />
        </a>
      {/each}
    </div>
  {:else}
    {#each logos as logo}
      <a href={logo.href}>
        <img
          class="logo"
          src={logo.src}
          alt={logo.alt}
          style="height: {logo.height ?? '5rem'}"
        />
      </a>
    {/each}
  {/if}
</div>

<style>
  .logo-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
    height: 6rem;
  }

  .logo-bar.scrolling {
    position: relative;
    justify-content: flex-start;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 10%,
      black 90%,
      transparent
    );
    overflow: hidden;
  }

  .track {
    display: flex;
    align-items: center;
    gap: 3rem;
    animation: marquee var(--duration, 20s) linear infinite;
    width: max-content;
  }

  .track:hover {
    animation-play-state: paused;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .logo {
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    height: 5rem;
  }

  .logo:hover {
    transform: translateY(-3px);
  }
</style>
