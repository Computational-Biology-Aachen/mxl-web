<script lang="ts">
  import ThemeSwitcher from "$lib/ThemeSwitcher.svelte";
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
  import Fa from "svelte-fa";
  import { MediaQuery } from "svelte/reactivity";

  const small = new MediaQuery("max-width: 800px");
  let { children } = $props();
</script>

<nav>
  <ul>
    <ThemeSwitcher />
    <li>
      <a href="https://github.com/Computational-Biology-Aachen/mxl-web"
        ><Fa icon={faGithub} /></a
      >
    </li>
    <details class="dropdown">
      <summary> models </summary>
      <ul dir="rtl">
        {@render children()}
      </ul>
    </details>
  </ul>
</nav>

<style>
  nav {
    min-height: 4rem;
    justify-content: flex-end;
    align-items: center;
  }
</style>
