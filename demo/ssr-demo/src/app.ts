import { attr, html, Renderable, Signal } from "@tempots/dom";
import {
  CounterIsland,
  Features,
  HydrationStatus,
  IslandsDemo,
  ServerTimestamp,
} from "./components";

/**
 * Main App component options.
 */
export interface AppOptions {
  /** Server render timestamp */
  timestamp?: string;
  /** Whether the app has been hydrated */
  hydrated?: Signal<boolean>;
  /** Whether to show islands demo */
  showIslands?: boolean;
}

/**
 * Main App component.
 */
export const App = ({
    timestamp = new Date().toISOString(),
    hydrated,
    showIslands = true,
  }: AppOptions = {}): Renderable => {

  return html.div(
    attr.class("container"),
    html.header(
      html.h1("Tempo SSR Demo"),
      html.p(
        attr.class("subtitle"),
        "Server-Side Rendering with Hydration & Islands",
      ),
    ),
    hydrated ? HydrationStatus(hydrated) : null,
    CounterIsland(),
    showIslands ? IslandsDemo() : null,
    Features(),
    ServerTimestamp(timestamp),
  );
};

// Re-export components for convenience
export { Counter, IslandCounter } from "./components";
export type { CounterOptions, IslandCounterOptions } from "./components";

export default App;
