import { hydrate } from "@tempots/client";
import { prop, untracked } from "@tempots/dom";
import { App } from "./App";

/**
 * Client-side entry point.
 * Hydrates the server-rendered HTML with client-side interactivity.
 */
const container = document.getElementById("app");

if (container) {
  // Create a signal to track hydration status (untracked since it's at module level)
  const hydrated = untracked(() => prop(false));

  // Get the timestamp from the server-rendered content (if available)
  // For simplicity, we'll use a new timestamp on client
  const timestamp = new Date().toISOString();

  // Hydrate the app
  const cleanup = hydrate(App({ timestamp, hydrated }), container);

  // Mark as hydrated
  hydrated.set(true);

  console.log("[Tempo] App hydrated successfully!");

  // Optional: cleanup on hot module replacement
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanup();
      hydrated.dispose();
    });
  }
} else {
  console.error("[Tempo] Could not find #app container");
}
