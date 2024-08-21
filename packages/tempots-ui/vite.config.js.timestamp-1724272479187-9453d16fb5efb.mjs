// vite.config.js
import { configDefaults } from "file:///Users/franco/projects/tempo/node_modules/vitest/dist/config.js";
import { defineConfig } from "file:///Users/franco/projects/tempo/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/franco/projects/tempo/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import tsconfigPaths from "file:///Users/franco/projects/tempo/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/franco/projects/tempo/packages/tempots-ui";
var vite_config_default = defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ["src"] })],
  test: {
    ...configDefaults,
    environment: "happy-dom",
    globals: true
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "@tempots/ui",
      formats: ["es", "cjs"],
      fileName: "index"
    },
    rollupOptions: {
      external: ["@tempots/dom", "@tempots/std"],
      output: {
        extend: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtdWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9mcmFuY28vcHJvamVjdHMvdGVtcG8vcGFja2FnZXMvdGVtcG90cy11aS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtdWkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBjb25maWdEZWZhdWx0cyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt0c2NvbmZpZ1BhdGhzKCksIGR0cyh7IGluY2x1ZGU6IFsnc3JjJ10gfSldLFxuICB0ZXN0OiB7XG4gICAgLi4uY29uZmlnRGVmYXVsdHMsXG4gICAgZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICdAdGVtcG90cy91aScsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWydAdGVtcG90cy9kb20nLCAnQHRlbXBvdHMvc3RkJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZXh0ZW5kOiB0cnVlXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtVLFNBQVMsc0JBQXNCO0FBQ2pXLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxtQkFBbUI7QUFKMUIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLGNBQWMsR0FBRyxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFBQSxFQUNwRCxNQUFNO0FBQUEsSUFDSixHQUFHO0FBQUEsSUFDSCxhQUFhO0FBQUEsSUFDYixTQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLElBQ2YsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVTtBQUFBLElBQ1o7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxnQkFBZ0IsY0FBYztBQUFBLE1BQ3pDLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxNQUNWO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
