import { attr, html, on, prop, Renderable } from "@tempots/dom";

/**
 * Island Counter component props.
 */
export interface IslandCounterProps {
  initial: number;
  label: string;
}

/**
 * Island Counter component - only hydrated based on strategy (visible, idle, etc.).
 * This is a standalone island that can be lazily loaded.
 */
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
 * Static placeholder for IslandCounter - renders the same structure without signals.
 * This is what the server renders; the client will hydrate with the real component.
 */
export const IslandCounterPlaceholder = (
  props: IslandCounterProps,
): Renderable => {
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
