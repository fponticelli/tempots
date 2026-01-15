import { initIslands, ISLAND_ATTR } from "@tempots/client";
import { BrowserContext } from "@tempots/dom";
import { App, Counter, IslandCounter } from "./App";

/**
 * Client-side entry point.
 *
 * Supports two modes:
 * 1. SSR mode (pnpm dev:ssr): Server renders HTML with island markers,
 *    client just initializes islands for interactivity.
 * 2. Client-only mode (pnpm dev): No server rendering, client renders
 *    the full app directly.
 */
const container = document.getElementById("app");

if (container) {
  // Check if we have SSR content (look for island markers or substantial content)
  const hasSSRContent = container.querySelector(`[${ISLAND_ATTR}]`) !== null;

  let cleanup: () => void;

  if (hasSSRContent) {
    // SSR mode: Just initialize islands, don't re-render the app
    cleanup = initIslands({
      Counter: Counter as (props: unknown) => ReturnType<typeof Counter>,
      IslandCounter: IslandCounter as (
        props: unknown,
      ) => ReturnType<typeof IslandCounter>,
    });

    console.log("[Tempo] SSR mode: Islands initialized!");
    console.log(
      "[Tempo] Static content stays static, only islands are interactive",
    );
  } else {
    // Client-only mode: Render the full app
    console.log("[Tempo] Client-only mode: Rendering app...");

    const ctx = new BrowserContext(
      document,
      container,
      undefined,
      {},
    );

    const clear = App().render(ctx);

    // Then initialize any islands that were rendered
    const islandCleanup = initIslands({
      Counter: Counter as (props: unknown) => ReturnType<typeof Counter>,
      IslandCounter: IslandCounter as (
        props: unknown,
      ) => ReturnType<typeof IslandCounter>,
    });

    cleanup = () => {
      islandCleanup();
      clear(true);
    };

    console.log("[Tempo] App rendered and islands initialized!");
  }

  // Optional: cleanup on hot module replacement
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cleanup();
    });
  }
} else {
  console.error("[Tempo] Could not find #app container");
}
