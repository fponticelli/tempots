import { attr, html, Renderable } from "@tempots/dom";

/**
 * Server timestamp showing when the page was rendered.
 */
export const ServerTimestamp = (timestamp: string): Renderable => {
  return html.div(
    attr.class("card"),
    html.h2("Server Info"),
    html.p(attr.class("timestamp"), `Server rendered at: ${timestamp}`),
  );
};
