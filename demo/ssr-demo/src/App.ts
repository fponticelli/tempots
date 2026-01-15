import {
  Attr,
  attr,
  html,
  on,
  prop,
  Renderable,
  Signal,
  When,
} from "@tempots/dom";
import {
  ISLAND_ATTR,
  ISLAND_PROPS_ATTR,
  ISLAND_HYDRATE_ATTR,
} from "@tempots/client";

/**
 * Counter component - now an island with immediate hydration.
 */
export interface CounterProps {
  initial?: number;
  label?: string;
}

export const Counter = (props: CounterProps = {}): Renderable => {
  const { initial = 0, label = "Interactive Counter" } = props;
  const count = prop(initial);

  return html.div(
    html.h2(label),
    html.p("This counter hydrates immediately as an island:"),
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
 * Static counter placeholder for SSR - renders the same structure as Counter.
 */
const CounterIsland = (props: CounterProps = {}): Renderable => {
  const { initial = 0, label = "Interactive Counter" } = props;

  return html.div(
    attr.class("card"),
    ...createIslandAttrs("Counter", { initial, label }, "immediate"),
    html.div(
      html.h2(label),
      html.p("This counter hydrates immediately as an island:"),
      html.div(
        attr.class("counter"),
        html.button("-"),
        html.span(String(initial)),
        html.button("+"),
      ),
    ),
  );
};

/**
 * Island Counter component - only hydrated when scrolled into view.
 * This is a standalone island that can be lazily loaded.
 */
export interface IslandCounterProps {
  initial: number;
  label: string;
}

export const IslandCounter = (props: IslandCounterProps): Renderable => {
  const count = prop(props.initial);

  return html.div(
    html.h3(props.label),
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
 * Island marker helper - creates attributes for island hydration.
 * In a real app, you might use the islandMarker() function from @tempots/client.
 */
const createIslandAttrs = (
  name: string,
  props: unknown,
  strategy: string,
): Renderable[] => [
  Attr(ISLAND_ATTR, name),
  Attr(ISLAND_PROPS_ATTR, JSON.stringify(props)),
  Attr(ISLAND_HYDRATE_ATTR, strategy),
];

/**
 * Static placeholder for IslandCounter - renders the same structure without signals.
 * This is what the server renders; the client will hydrate with the real component.
 */
const IslandCounterPlaceholder = (props: IslandCounterProps): Renderable => {
  return html.div(
    html.h3(props.label),
    html.div(
      attr.class("counter"),
      html.button("-"),
      html.span(String(props.initial)),
      html.button("+"),
    ),
  );
};

/**
 * Islands demo section showing lazy hydration.
 */
const IslandsDemo = (): Renderable => {
  return html.div(
    attr.class("card islands-demo"),
    html.h2("Islands Architecture Demo"),
    html.p(
      "Islands are interactive components that hydrate independently. ",
      "They only load JavaScript when needed (e.g., when scrolled into view).",
    ),

    // Island with "visible" strategy - hydrates when scrolled into view
    html.div(
      attr.class("island-container"),
      ...createIslandAttrs(
        "IslandCounter",
        { initial: 10, label: "Visible Island (hydrates when visible)" },
        "visible",
      ),
      // Static placeholder - will be hydrated by initIslands
      IslandCounterPlaceholder({
        initial: 10,
        label: "Visible Island (hydrates when visible)",
      }),
    ),

    // Island with "idle" strategy - hydrates when browser is idle
    html.div(
      attr.class("island-container"),
      ...createIslandAttrs(
        "IslandCounter",
        { initial: 20, label: "Idle Island (hydrates on browser idle)" },
        "idle",
      ),
      IslandCounterPlaceholder({
        initial: 20,
        label: "Idle Island (hydrates on browser idle)",
      }),
    ),

    // Island with "immediate" strategy - hydrates immediately
    html.div(
      attr.class("island-container"),
      ...createIslandAttrs(
        "IslandCounter",
        { initial: 30, label: "Immediate Island (hydrates immediately)" },
        "immediate",
      ),
      IslandCounterPlaceholder({
        initial: 30,
        label: "Immediate Island (hydrates immediately)",
      }),
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
  /** Whether to show islands demo */
  showIslands?: boolean;
}

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
    CounterIsland(), // Use island version - will be hydrated by initIslands
    showIslands ? IslandsDemo() : null,
    Features(),
    ServerTimestamp(timestamp),
  );
};

export default App;
