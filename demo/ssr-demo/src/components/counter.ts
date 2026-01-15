import { attr, html, on, prop, Renderable } from "@tempots/dom";
import { createIslandAttrs } from "../utils/island-attrs";

/**
 * Counter component options.
 */
export interface CounterOptions {
  initial?: number;
  label?: string;
}

/**
 * Interactive Counter component - used for client-side hydration.
 * Accepts `unknown` for island registry compatibility; casts internally.
 */
export const Counter = (options: unknown): Renderable => {
  const { initial = 0, label = "Interactive Counter" } =
    (options ?? {}) as CounterOptions;
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
 * This is what the server renders; the client will hydrate with the real component.
 */
export const CounterIsland = (options: CounterOptions = {}): Renderable => {
  const { initial = 0, label = "Interactive Counter" } = options;

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
