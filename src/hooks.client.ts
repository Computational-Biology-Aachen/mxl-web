// Recover automatically when a client already has an old deploy loaded and its
// hashed chunk/asset URLs 404 against the current (fully-replaced) GitHub Pages build.
window.addEventListener("vite:preloadError", () => {
  const key = "reloaded-after-preload-error";
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage blocked: reload once anyway; a fresh load fetches the current
    // chunk URLs, so this can't loop.
  }
  location.reload();
});
