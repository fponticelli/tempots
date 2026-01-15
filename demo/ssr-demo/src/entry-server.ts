import { renderToString, renderToStream } from "@tempots/server";
import { App } from "./App";

/**
 * Server-side render function.
 * Called by the Express server to render the app to HTML.
 */
export async function render(url: string): Promise<string> {
  void url; // URL can be used for routing in future
  const timestamp = new Date().toISOString();

  const html = await renderToString(App({ timestamp }), {
    generatePlaceholders: true, // Enable hydration markers
  });

  return html;
}

/**
 * Streaming render function for progressive HTML delivery.
 */
export function renderStream(url: string) {
  void url; // URL can be used for routing in future
  const timestamp = new Date().toISOString();

  return renderToStream(App({ timestamp }), {
    generatePlaceholders: true,
  });
}

export { App };
