import { attr, html, Renderable, Signal, When } from "@tempots/dom";

/**
 * Hydration status indicator.
 * Shows different messages based on whether the app has been hydrated.
 */
export const HydrationStatus = (hydrated: Signal<boolean>): Renderable => {
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
