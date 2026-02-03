<script lang="ts">
  import katex from "katex";
  import "katex/dist/katex.min.css";

  let {
    tex,
    display,
    fontSize = "1rem",
  }: { fontSize?: string; tex: string; display: boolean } = $props();

  let el: HTMLElement;

  $effect(() => {
    if (!el) return;
    katex.render(tex, el, {
      displayMode: display,
      throwOnError: false,
      trust: true,
      output: "html",
    });
  });
</script>

<span
  bind:this={el}
  style:font-size={fontSize}
  style:margin="0"
  style:padding="0"
></span>

<style>
  span {
    display: inline-block;
    padding: 0;
    margin: 0;
    /* transform-origin: left; */
    /* transform: scale(0.75); */
  }
</style>
