import { initIslands } from "@tempots/client";
import { Counter, IslandCounter } from "./App";

/**
 * Client-side entry point.
 *
 * This demo uses Islands Architecture - no full-app hydration!
 * Only the interactive islands are hydrated, static content stays static.
 */
const container = document.getElementById("app");

if (container) {
  // Initialize all islands - they will hydrate based on their strategy
  // (visible, idle, immediate, media)
  const cleanup = initIslands({
    // Register all island components
    // Cast is needed because IslandRegistry uses unknown props
    Counter: Counter as (props: unknown) => ReturnType<typeof Counter>,
    IslandCounter: IslandCounter as (
      props: unknown,
    ) => ReturnType<typeof IslandCounter>,
  });

  console.log("[Tempo] Islands initialized!");
  console.log(
    "[Tempo] Static content stays static, only islands are interactive",
  );

  // Optional: cleanup on hot module replacement
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanup();
    });
  }
} else {
  console.error("[Tempo] Could not find #app container");
}
