import { attr, html, Renderable, Signal } from "@tempots/dom";
import {
  CounterIsland,
  Features,
  HydrationStatus,
  IslandsDemo,
  ServerTimestamp,
} from "./components";

/**
 * Main App component props.
 */
export interface AppProps {
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
export const App = (props: AppProps = {}): Renderable => {
  const {
    timestamp = new Date().toISOString(),
    hydrated,
    showIslands = true,
  } = props;

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
export type { CounterProps, IslandCounterProps } from "./components";

export default App;
