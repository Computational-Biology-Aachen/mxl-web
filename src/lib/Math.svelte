<script lang="ts">
  import katex from "katex";
  import "katex/dist/katex.min.css";

  let { tex, display }: { tex: string; display: boolean } = $props();

  let el: HTMLElement;

  $effect(() => {
    if (!el) return;
    katex.render(tex, el, {
      displayMode: display,
      throwOnError: false,
      trust: true,
      output: "htmlAndMathml",
    });
  });
</script>

<span bind:this={el}></span>
