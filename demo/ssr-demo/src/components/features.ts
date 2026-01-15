import { attr, html, Renderable } from "@tempots/dom";

/**
 * Features section showing SSR capabilities.
 */
export const Features = (): Renderable => {
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
