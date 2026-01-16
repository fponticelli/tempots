import "./index.css";
import "highlight.js/styles/atom-one-dark-reasonable.css";

import { render } from "@tempots/dom";
import { App } from "./components/app";
import { fetchToc } from "./services/toc-service";

async function main() {
  const toc = await fetchToc();
  const container = document.getElementById("app");

  if (!container) {
    console.error("[Docs] Could not find #app container");
    return;
  }

  // Clear any SSR content and render fresh
  // SSG provides fast initial HTML for SEO, client takes over for interactivity
  container.innerHTML = "";
  render(App(toc), container);
}

main();
