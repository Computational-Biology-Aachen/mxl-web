<script lang="ts">
  let { children } = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 70ch;
    padding: 2rem 0;
    margin: auto;
    background-color: var(--pico-background-color);
  }

  @media screen and (min-width: 1024px) {
    div {
      padding: 2rem;
      min-height: 512px;
      background-color: var(--pico-card-background-color);
    }
  }
</style>
