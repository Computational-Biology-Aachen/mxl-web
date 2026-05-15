<script lang="ts">
  let {
    name,
    desc,
    href,
    image,
  }: {
    name: string;
    desc: string;
    href: string;
    image: string;
  } = $props();
</script>

<a
  href={href}
  class="card"
>
  <div class="media">
    <img
      src={image}
      alt="{name} scheme"
    />
  </div>
  <div class="label">
    <h2>{name}</h2>
    <p>{desc}</p>
  </div>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition:
      transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: var(--shadow);
    border-radius: var(--border-radius);
    background: var(--bg-l1);
    padding: 1rem 0;
    width: 20rem;
    height: 18rem;
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
    object-fit: contain;
  }

  .label {
    padding: 0.75rem 1rem;
    font-size: var(--text-sm);
  }

  h2 {
    margin-bottom: 0.25rem;
    font-size: var(--text-sm);
  }
</style>
