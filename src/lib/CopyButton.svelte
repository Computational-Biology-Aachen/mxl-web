<!-- CopyButton.svelte -->
<script lang="ts">
  import { Button, Icon } from "@computational-biology-aachen/design";

  let { text = "" }: { text?: string } = $props();

  let copied = $state(false);
  let status = $state("");
  let timer: ReturnType<typeof setTimeout> | undefined;

  async function handleCopy() {
    if (!text) return;
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
      status = "Copied to clipboard";
    } catch (error) {
      console.error("Failed to copy text: ", error);
      status = "Copying failed";
    }
    timer = setTimeout(() => {
      copied = false;
      status = "";
    }, 2000);
  }

  $effect(() => () => clearTimeout(timer));
</script>

<Button
  variant="primary"
  onclick={handleCopy}
>
  <Icon color="inherit">content_copy</Icon>
  {copied ? "Copied!" : "Copy"}
</Button>
<span
  class="visually-hidden"
  role="status">{status}</span
>

<style>
  .visually-hidden {
    position: absolute;
    clip-path: inset(50%);
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;
  }
</style>
