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
    rolldownOptions: {
      output: {
        strictExecutionOrder: true,
        codeSplitting: {
          groups: [
            {
              name: "monaco",
              test: /node_modules[\\/]monaco-editor[\\/]/,
              maxSize: 1_000_000,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
});
