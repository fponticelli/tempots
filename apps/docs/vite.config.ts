import { defineConfig } from "vite";
import { tempo } from "@tempots/vite";

export default defineConfig({
  plugins: [
    tempo({
      mode: "ssg",
      ssrEntry: "src/entry-server.ts",
      routes: "crawl",
      container: "#app",
      hydrate: true,
    }),
  ],
  build: {
    sourcemap: true,
  },
});
