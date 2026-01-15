import { createRenderer } from "@tempots/server";
import { App } from "./app";

export const { render, renderStream } = createRenderer(App, {
  getData: () => ({ timestamp: new Date().toISOString() }),
});

export { App };
