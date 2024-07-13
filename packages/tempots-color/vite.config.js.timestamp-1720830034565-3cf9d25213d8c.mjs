// vite.config.js
import fs from "fs";
import path from "path";
import { configDefaults } from "file:///Users/franco/projects/tempo/node_modules/vitest/dist/config.js";
import { defineConfig } from "file:///Users/franco/projects/tempo/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/franco/projects/tempo/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import tsconfigPaths from "file:///Users/franco/projects/tempo/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/franco/projects/tempo/packages/tempots-color";
function updateExportsAndTypesVersions(packageFile, names2, prefix = null) {
  const exports = {};
  const types = {};
  for (const name of names2) {
    const value = prefix ? `${prefix}/${name}` : name;
    exports[`./${name}`] = {
      import: `./${value}.js`,
      require: `./${value}.cjs`
    };
    types[name] = [`./${value}.d.ts`];
  }
  const content = fs.readFileSync(packageFile, { encoding: "utf-8" });
  const json = JSON.parse(content);
  json.exports = exports;
  json.typesVersions = {
    "*": types
  };
  fs.writeFileSync(packageFile, JSON.stringify(json, null, 2));
}
function writeExports(names2) {
  const cwd = process.cwd();
  const packageJson = path.join(cwd, "package.json");
  const packageLibJson = path.join(cwd, "package.lib.json");
  updateExportsAndTypesVersions(packageJson, names2, "dist");
  updateExportsAndTypesVersions(packageLibJson, names2);
}
function witeTypedocJson(names2) {
  const cwd = process.cwd();
  const typedocJson = path.join(cwd, "typedoc.json");
  const content = fs.readFileSync(typedocJson, { encoding: "utf-8" });
  const json = JSON.parse(content);
  json.entryPoints = names2.map((name) => `src/${name}.ts`);
  fs.writeFileSync(typedocJson, JSON.stringify(json, null, 2));
}
var names = fs.readdirSync(resolve(__vite_injected_original_dirname, "src")).filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts")).map((file) => file.replace(/\.ts$/, ""));
writeExports(names);
witeTypedocJson(names);
var files = names.map((file) => resolve(__vite_injected_original_dirname, "src", `${file}.ts`));
var vite_config_default = defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ["src"] })],
  test: {
    ...configDefaults,
    globals: true
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: files,
      name: "@tempots/color",
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      output: {
        extend: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtY29sb3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9mcmFuY28vcHJvamVjdHMvdGVtcG8vcGFja2FnZXMvdGVtcG90cy1jb2xvci92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtY29sb3Ivdml0ZS5jb25maWcuanNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG5mdW5jdGlvbiB1cGRhdGVFeHBvcnRzQW5kVHlwZXNWZXJzaW9ucyhwYWNrYWdlRmlsZSwgbmFtZXMsIHByZWZpeCA9IG51bGwpIHtcbiAgY29uc3QgZXhwb3J0cyA9IHt9XG4gIGNvbnN0IHR5cGVzID0ge31cbiAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7bmFtZX1gIDogbmFtZVxuICAgIGV4cG9ydHNbYC4vJHtuYW1lfWBdID0ge1xuICAgICAgaW1wb3J0OiBgLi8ke3ZhbHVlfS5qc2AsXG4gICAgICByZXF1aXJlOiBgLi8ke3ZhbHVlfS5janNgLFxuICAgIH1cbiAgICB0eXBlc1tuYW1lXSA9IFtgLi8ke3ZhbHVlfS5kLnRzYF1cbiAgfVxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VGaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pXG4gIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpXG4gIGpzb24uZXhwb3J0cyA9IGV4cG9ydHNcbiAganNvbi50eXBlc1ZlcnNpb25zID0ge1xuICAgICcqJzogdHlwZXMsXG4gIH1cbiAgZnMud3JpdGVGaWxlU3luYyhwYWNrYWdlRmlsZSwgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRXhwb3J0cyhuYW1lcykge1xuICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UuanNvbicpXG4gIGNvbnN0IHBhY2thZ2VMaWJKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UubGliLmpzb24nKVxuICB1cGRhdGVFeHBvcnRzQW5kVHlwZXNWZXJzaW9ucyhwYWNrYWdlSnNvbiwgbmFtZXMsICdkaXN0JylcbiAgdXBkYXRlRXhwb3J0c0FuZFR5cGVzVmVyc2lvbnMocGFja2FnZUxpYkpzb24sIG5hbWVzKVxufVxuXG5mdW5jdGlvbiB3aXRlVHlwZWRvY0pzb24obmFtZXMpIHtcbiAgY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKVxuICBjb25zdCB0eXBlZG9jSnNvbiA9IHBhdGguam9pbihjd2QsICd0eXBlZG9jLmpzb24nKVxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHR5cGVkb2NKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pXG4gIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpXG4gIGpzb24uZW50cnlQb2ludHMgPSBuYW1lcy5tYXAoKG5hbWUpID0+IGBzcmMvJHtuYW1lfS50c2ApXG4gIGZzLndyaXRlRmlsZVN5bmModHlwZWRvY0pzb24sIEpTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpKVxufVxuXG5jb25zdCBuYW1lcyA9IGZzLnJlYWRkaXJTeW5jKHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykpXG4gIC5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZW5kc1dpdGgoJy50cycpICYmICFmaWxlLmVuZHNXaXRoKCcuZC50cycpKVxuICAubWFwKChmaWxlKSA9PiBmaWxlLnJlcGxhY2UoL1xcLnRzJC8sICcnKSlcblxud3JpdGVFeHBvcnRzKG5hbWVzKVxud2l0ZVR5cGVkb2NKc29uKG5hbWVzKVxuXG5jb25zdCBmaWxlcyA9IG5hbWVzLm1hcCgoZmlsZSkgPT4gcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCBgJHtmaWxlfS50c2ApKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdHNjb25maWdQYXRocygpLCBkdHMoeyBpbmNsdWRlOiBbJ3NyYyddIH0pXSxcbiAgdGVzdDoge1xuICAgIC4uLmNvbmZpZ0RlZmF1bHRzLFxuICAgIGdsb2JhbHM6IHRydWUsXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogZmlsZXMsXG4gICAgICBuYW1lOiAnQHRlbXBvdHMvY29sb3InLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBleHRlbmQ6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsT0FBTyxRQUFRO0FBQzFWLE9BQU8sVUFBVTtBQUNqQixTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFD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
