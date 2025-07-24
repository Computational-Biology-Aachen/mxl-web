<script lang="ts">
  import { faGithub } from "@fortawesome/free-brands-svg-icons";
  import { faBars } from "@fortawesome/free-solid-svg-icons";
  import Fa from "svelte-fa";
  import { MediaQuery } from "svelte/reactivity";
  import ThemeSwitcher from "./ThemeSwitcher.svelte";

  const small = new MediaQuery("max-width: 800px");
  let { children } = $props();
</script>

<nav>
  <ul>
    {#if small.current}
      <ThemeSwitcher />
      <li>
        <a href="https://github.com/Computational-Biology-Aachen/mxl-web"
          ><Fa icon={faGithub} /></a
        >
      </li>
      <details class="dropdown">
        <summary> <Fa icon={faBars} /> </summary>
        <ul dir="rtl">
          {@render children()}
        </ul>
      </details>
    {:else}
      {@render children()}
      <a href="https://github.com/Computational-Biology-Aachen/mxl-web"
        ><Fa icon={faGithub} /></a
      >
      <ThemeSwitcher />
    {/if}
  </ul>
</nav>

<style>
  nav {
    min-height: 4rem;
    justify-content: flex-end;
    align-items: center;
  }
</style>
