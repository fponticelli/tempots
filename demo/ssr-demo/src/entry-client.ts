import { hydrate, initIslands } from "@tempots/client";
import { prop, untracked } from "@tempots/dom";
import { App, IslandCounter } from "./App";

/**
 * Client-side entry point.
 * Hydrates the server-rendered HTML with client-side interactivity.
 * Also initializes islands with lazy hydration.
 */
const container = document.getElementById("app");

if (container) {
  // Create a signal to track hydration status (untracked since it's at module level)
  const hydrated = untracked(() => prop(false));

  // Get the timestamp from the server-rendered content (if available)
  // For simplicity, we'll use a new timestamp on client
  const timestamp = new Date().toISOString();

  // Hydrate the main app (full hydration)
  const cleanup = hydrate(
    App({ timestamp, hydrated, showIslands: true }),
    container,
  );

  // Initialize islands - they will hydrate based on their strategy
  // (visible, idle, immediate, media)
  const islandCleanup = initIslands({
    // Cast is needed because IslandRegistry uses unknown props
    IslandCounter: IslandCounter as (
      props: unknown,
    ) => ReturnType<typeof IslandCounter>,
  });

  // Mark as hydrated
  hydrated.set(true);

  console.log("[Tempo] App hydrated successfully!");
  console.log("[Tempo] Islands initialized with lazy hydration strategies");

  // Optional: cleanup on hot module replacement
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanup();
      islandCleanup();
      hydrated.dispose();
    });
  }
} else {
  console.error("[Tempo] Could not find #app container");
}
