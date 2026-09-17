<!-- CopyButton.svelte -->
<script>
  import { Button, Icon } from "@computational-biology-aachen/design";

  // Accept the explicit text as a prop
  let { text = "" } = $props();

  // Track the copied state for visual feedback
  let copied = $state(false);

  async function handleCopy() {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      copied = true;

      // Reset the button text after 2 seconds
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  }
</script>

<Button
  variant="primary"
  onclick={handleCopy}
>
  <Icon color="inherit">content_copy</Icon>
  {copied ? "Copied!" : "Copy"}
</Button>
