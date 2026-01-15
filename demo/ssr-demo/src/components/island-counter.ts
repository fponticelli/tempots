import { attr, html, on, prop, Renderable } from "@tempots/dom";

/**
 * Island Counter component options.
 */
export interface IslandCounterOptions {
  initial: number;
  label: string;
}

/**
 * Island Counter component - only hydrated based on strategy (visible, idle, etc.).
 * This is a standalone island that can be lazily loaded.
 * Accepts `unknown` for island registry compatibility; casts internally.
 */
export const IslandCounter = (options: unknown): Renderable => {
  const { initial, label } = options as IslandCounterOptions;
  const count = prop(initial);

  return html.div(
    html.h3(label),
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
 * Static placeholder for IslandCounter - renders the same structure without signals.
 * This is what the server renders; the client will hydrate with the real component.
 */
export const IslandCounterPlaceholder = (
  options: IslandCounterOptions,
): Renderable => {
  return html.div(
    html.h3(options.label),
    html.div(
      attr.class("counter"),
      html.button("-"),
      html.span(String(options.initial)),
      html.button("+"),
    ),
  );
};
