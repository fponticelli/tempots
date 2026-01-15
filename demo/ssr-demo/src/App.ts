import { attr, html, on, prop, Renderable, Signal, When } from "@tempots/dom";

/**
 * Counter component demonstrating client-side interactivity after hydration.
 */
const Counter = (): Renderable => {
  const count = prop(0);

  return html.div(
    attr.class("card"),
    html.h2("Interactive Counter"),
    html.p("This counter is interactive after hydration:"),
    html.div(
      attr.class("counter"),
      html.button(
        on.click(() => count.update((c) => c - 1)),
        "-",
      ),
      html.span(count.map(String)),
      html.button(
        on.click(() => count.update((c) => c + 1)),
        "+",
      ),
    ),
  );
};

/**
 * Features section showing SSR capabilities.
 */
const Features = (): Renderable => {
  return html.div(
    attr.class("card"),
    html.h2("SSR Features"),
    html.div(
      attr.class("features"),
      html.div(
        attr.class("feature"),
        html.h3("Streaming"),
        html.p("Progressive HTML delivery for fast TTFB"),
      ),
      html.div(
        attr.class("feature"),
        html.h3("Hydration"),
        html.p("Seamless client-side interactivity"),
      ),
      html.div(
        attr.class("feature"),
        html.h3("Signals"),
        html.p("Reactive state with automatic cleanup"),
      ),
      html.div(
        attr.class("feature"),
        html.h3("TypeScript"),
        html.p("Full type safety end-to-end"),
      ),
    ),
  );
};

/**
 * Hydration status indicator.
 */
const HydrationStatus = (hydrated: Signal<boolean>): Renderable => {
  return When(
    hydrated,
    () =>
      html.div(
        attr.class("hydration-status"),
        "✓ Client hydrated successfully!",
      ),
    () => html.div(attr.class("ssr-only"), "⏳ Waiting for hydration..."),
  );
};

/**
 * Server timestamp showing when the page was rendered.
 */
const ServerTimestamp = (timestamp: string): Renderable => {
  return html.div(
    attr.class("card"),
    html.h2("Server Info"),
    html.p(attr.class("timestamp"), `Server rendered at: ${timestamp}`),
  );
};

/**
 * Main App component.
 */
export interface AppProps {
  /** Server render timestamp */
  timestamp?: string;
  /** Whether the app has been hydrated */
  hydrated?: Signal<boolean>;
}

export const App = (props: AppProps = {}): Renderable => {
  const { timestamp = new Date().toISOString(), hydrated } = props;

  return html.div(
    attr.class("container"),
    html.header(
      html.h1("Tempo SSR Demo"),
      html.p(attr.class("subtitle"), "Server-Side Rendering with Hydration"),
    ),
    hydrated ? HydrationStatus(hydrated) : null,
    Counter(),
    Features(),
    ServerTimestamp(timestamp),
  );
};

export default App;
