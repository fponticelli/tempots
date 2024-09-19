// vite.config.js
import fs from "fs";
import path from "path";
import { configDefaults } from "file:///Users/franco/projects/tempo/node_modules/vitest/dist/config.js";
import { defineConfig } from "file:///Users/franco/projects/tempo/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/franco/projects/tempo/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import tsconfigPaths from "file:///Users/franco/projects/tempo/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/franco/projects/tempo/packages/tempots-std";
function updatePackageJSONExportsAndTypes(packageFile, names2, prefix = null) {
  const exports = {
    ".": {
      import: prefix ? `./${prefix}/index.js` : "./index.js",
      require: prefix ? `./${prefix}/index.cjs` : "./index.cjs"
    }
  };
  const types = {
    ".": [prefix ? `./${prefix}/index.d.ts` : "./index.d.ts"]
  };
  for (const name of names2) {
    if (name === "index") {
      continue;
    }
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
  updatePackageJSONExportsAndTypes(packageJson, names2, "dist");
  updatePackageJSONExportsAndTypes(packageLibJson, names2);
}
var names = fs.readdirSync(resolve(__vite_injected_original_dirname, "src")).filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts")).map((file) => file.replace(/\.ts$/, ""));
writeExports(names);
var files = [
  resolve(__vite_injected_original_dirname, "src", "index.ts"),
  ...names.map((file) => resolve(__vite_injected_original_dirname, "src", `${file}.ts`))
];
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
      name: "@tempots/std",
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtc3RkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtc3RkL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9mcmFuY28vcHJvamVjdHMvdGVtcG8vcGFja2FnZXMvdGVtcG90cy1zdGQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG5mdW5jdGlvbiB1cGRhdGVQYWNrYWdlSlNPTkV4cG9ydHNBbmRUeXBlcyhwYWNrYWdlRmlsZSwgbmFtZXMsIHByZWZpeCA9IG51bGwpIHtcbiAgY29uc3QgZXhwb3J0cyA9IHtcbiAgICAnLic6IHtcbiAgICAgIGltcG9ydDogcHJlZml4ID8gYC4vJHtwcmVmaXh9L2luZGV4LmpzYCA6ICcuL2luZGV4LmpzJyxcbiAgICAgIHJlcXVpcmU6IHByZWZpeCA/IGAuLyR7cHJlZml4fS9pbmRleC5janNgIDogJy4vaW5kZXguY2pzJyxcbiAgICB9LFxuICB9XG4gIGNvbnN0IHR5cGVzID0ge1xuICAgICcuJzogW3ByZWZpeCA/IGAuLyR7cHJlZml4fS9pbmRleC5kLnRzYCA6ICcuL2luZGV4LmQudHMnXSxcbiAgfVxuICBmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2luZGV4Jykge1xuICAgICAgY29udGludWVcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7bmFtZX1gIDogbmFtZVxuICAgIGV4cG9ydHNbYC4vJHtuYW1lfWBdID0ge1xuICAgICAgaW1wb3J0OiBgLi8ke3ZhbHVlfS5qc2AsXG4gICAgICByZXF1aXJlOiBgLi8ke3ZhbHVlfS5janNgLFxuICAgIH1cbiAgICB0eXBlc1tuYW1lXSA9IFtgLi8ke3ZhbHVlfS5kLnRzYF1cbiAgfVxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VGaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pXG4gIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpXG4gIGpzb24uZXhwb3J0cyA9IGV4cG9ydHNcbiAganNvbi50eXBlc1ZlcnNpb25zID0ge1xuICAgICcqJzogdHlwZXMsXG4gIH1cbiAgZnMud3JpdGVGaWxlU3luYyhwYWNrYWdlRmlsZSwgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRXhwb3J0cyhuYW1lcykge1xuICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UuanNvbicpXG4gIGNvbnN0IHBhY2thZ2VMaWJKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UubGliLmpzb24nKVxuICB1cGRhdGVQYWNrYWdlSlNPTkV4cG9ydHNBbmRUeXBlcyhwYWNrYWdlSnNvbiwgbmFtZXMsICdkaXN0JylcbiAgdXBkYXRlUGFja2FnZUpTT05FeHBvcnRzQW5kVHlwZXMocGFja2FnZUxpYkpzb24sIG5hbWVzKVxufVxuXG5jb25zdCBuYW1lcyA9IGZzLnJlYWRkaXJTeW5jKHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykpXG4gIC5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZW5kc1dpdGgoJy50cycpICYmICFmaWxlLmVuZHNXaXRoKCcuZC50cycpKVxuICAubWFwKChmaWxlKSA9PiBmaWxlLnJlcGxhY2UoL1xcLnRzJC8sICcnKSlcblxud3JpdGVFeHBvcnRzKG5hbWVzKVxuXG5jb25zdCBmaWxlcyA9IFtcbiAgcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnaW5kZXgudHMnKSxcbiAgLi4ubmFtZXMubWFwKChmaWxlKSA9PiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycsIGAke2ZpbGV9LnRzYCkpXG5dXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt0c2NvbmZpZ1BhdGhzKCksIGR0cyh7IGluY2x1ZGU6IFsnc3JjJ10gfSldLFxuICB0ZXN0OiB7XG4gICAgLi4uY29uZmlnRGVmYXVsdHMsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBmaWxlcyxcbiAgICAgIG5hbWU6ICdAdGVtcG90cy9zdGQnLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnXSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBleHRlbmQ6IHRydWVcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVUsT0FBTyxRQUFRO0FBQ3BWLE9BQU8sVUFBVTtBQUNqQixTQUFTLHNCQUFzQjtBQUMvQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBQ3hCLE9BQU8sbUJBQW1CO0FBTjFCLElBQU0sbUNBQW1DO0FBUXpDLFNBQVMsaUNBQWlDLGFBQWFBLFFBQU8sU0FBUyxNQUFNO0FBQzNFLFFBQU0sVUFBVTtBQUFBLElBQ2QsS0FBSztBQUFBLE1BQ0gsUUFBUSxTQUFTLEtBQUssTUFBTSxjQUFjO0FBQUEsTUFDMUMsU0FBUyxTQUFTLEtBQUssTUFBTSxlQUFlO0FBQUEsSUFDOUM7QUFBQSxFQUNGO0FBQ0EsUUFBTSxRQUFRO0FBQUEsSUFDWixLQUFLLENBQUMsU0FBUyxLQUFLLE1BQU0sZ0JBQWdCLGNBQWM7QUFBQSxFQUMxRDtBQUNBLGFBQVcsUUFBUUEsUUFBTztBQUN4QixRQUFJLFNBQVMsU0FBUztBQUNwQjtBQUFBLElBQ0Y7QUFDQSxVQUFNLFFBQVEsU0FBUyxHQUFHLE1BQU0sSUFBSSxJQUFJLEtBQUs7QUFDN0MsWUFBUSxLQUFLLElBQUksRUFBRSxJQUFJO0FBQUEsTUFDckIsUUFBUSxLQUFLLEtBQUs7QUFBQSxNQUNsQixTQUFTLEtBQUssS0FBSztBQUFBLElBQ3JCO0FBQ0EsVUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssT0FBTztBQUFBLEVBQ2xDO0FBQ0EsUUFBTSxVQUFVLEdBQUcsYUFBYSxhQUFhLEVBQUUsVUFBVSxRQUFRLENBQUM7QUFDbEUsUUFBTSxPQUFPLEtBQUssTUFBTSxPQUFPO0FBQy9CLE9BQUssVUFBVTtBQUNmLE9BQUssZ0JBQWdCO0FBQUEsSUFDbkIsS0FBSztBQUFBLEVBQ1A7QUFDQSxLQUFHLGNBQWMsYUFBYSxLQUFLLFVBQVUsTUFBTSxNQUFNLENBQUMsQ0FBQztBQUM3RDtBQUVBLFNBQVMsYUFBYUEsUUFBTztBQUMzQixRQUFNLE1BQU0sUUFBUSxJQUFJO0FBQ3hCLFFBQU0sY0FBYyxLQUFLLEtBQUssS0FBSyxjQUFjO0FBQ2pELFFBQU0saUJBQWlCLEtBQUssS0FBSyxLQUFLLGtCQUFrQjtBQUN4RCxtQ0FBaUMsYUFBYUEsUUFBTyxNQUFNO0FBQzNELG1DQUFpQyxnQkFBZ0JBLE1BQUs7QUFDeEQ7QUFFQSxJQUFNLFFBQVEsR0FBRyxZQUFZLFFBQVEsa0NBQVcsS0FBSyxDQUFDLEVBQ25ELE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUyxLQUFLLEtBQUssQ0FBQyxLQUFLLFNBQVMsT0FBTyxDQUFDLEVBQ2hFLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxTQUFTLEVBQUUsQ0FBQztBQUUxQyxhQUFhLEtBQUs7QUFFbEIsSUFBTSxRQUFRO0FBQUEsRUFDWixRQUFRLGtDQUFXLE9BQU8sVUFBVTtBQUFBLEVBQ3BDLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxRQUFRLGtDQUFXLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQztBQUNoRTtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQUEsRUFDcEQsTUFBTTtBQUFBLElBQ0osR0FBRztBQUFBLElBQ0gsU0FBUztBQUFBLEVBQ1g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxJQUNmLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxJQUN2QjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbIm5hbWVzIl0KfQo=
