<script lang="ts">
  import { onMount } from "svelte";

  let currentTheme = "auto";
  let isDark = false;

  onMount(() => {
    // Get saved theme from localStorage or default to 'auto'
    const savedTheme = localStorage.getItem("theme") || "auto";
    setTheme(savedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (currentTheme === "auto") {
        updateTheme("auto");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    // Cleanup listener on component destroy
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  });

  function setTheme(theme: string) {
    currentTheme = theme;
    updateTheme(theme);
    localStorage.setItem("theme", theme);
  }

  function updateTheme(theme: string) {
    const html = document.documentElement;

    if (theme === "auto") {
      html.removeAttribute("data-theme");
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      // Set explicit theme
      html.setAttribute("data-theme", theme);
      isDark = theme === "dark";
    }
  }

  function toggleTheme() {
    if (currentTheme === "auto") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(systemPrefersDark ? "light" : "dark");
    } else if (currentTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  // Get appropriate icon based on current state
  $: icon = currentTheme === "auto" ? "🌓" : isDark ? "☀️" : "🌙";

  $: title =
    currentTheme === "auto"
      ? "Auto theme (click to override)"
      : isDark
        ? "Switch to light theme"
        : "Switch to dark theme";
</script>

<button on:click={toggleTheme} {title}>{icon}</button>

<style>
  button {
    text-decoration: none;
    background: none;
    border: none;
    box-shadow: none;
    outline: none;
    padding: var(--pico-nav-element-spacing-vertical)
      var(--pico-nav-element-spacing-horizontal);
  }
  button:hover {
    color: var(--pico-primary-hover);
    text-decoration: underline;
  }
</style>
