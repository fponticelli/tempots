import { attr, html, Renderable } from "@tempots/dom";
import { createIslandAttrs } from "../utils/island-attrs";
import { IslandCounterPlaceholder } from "./island-counter";

/**
 * Islands demo section showing lazy hydration with different strategies.
 */
export const IslandsDemo = (): Renderable => {
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
