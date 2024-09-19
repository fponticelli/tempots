// vite.config.js
import fs from "fs";
import path from "path";
import { configDefaults } from "file:///Users/franco/projects/tempo/node_modules/vitest/dist/config.js";
import { defineConfig } from "file:///Users/franco/projects/tempo/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/franco/projects/tempo/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
import tsconfigPaths from "file:///Users/franco/projects/tempo/node_modules/vite-tsconfig-paths/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/franco/projects/tempo/packages/tempots-color";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtY29sb3JcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9mcmFuY28vcHJvamVjdHMvdGVtcG8vcGFja2FnZXMvdGVtcG90cy1jb2xvci92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZnJhbmNvL3Byb2plY3RzL3RlbXBvL3BhY2thZ2VzL3RlbXBvdHMtY29sb3Ivdml0ZS5jb25maWcuanNcIjtpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgY29uZmlnRGVmYXVsdHMgfSBmcm9tICd2aXRlc3QvY29uZmlnJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuXG5mdW5jdGlvbiB1cGRhdGVQYWNrYWdlSlNPTkV4cG9ydHNBbmRUeXBlcyhwYWNrYWdlRmlsZSwgbmFtZXMsIHByZWZpeCA9IG51bGwpIHtcbiAgY29uc3QgZXhwb3J0cyA9IHtcbiAgICAnLic6IHtcbiAgICAgIGltcG9ydDogcHJlZml4ID8gYC4vJHtwcmVmaXh9L2luZGV4LmpzYCA6ICcuL2luZGV4LmpzJyxcbiAgICAgIHJlcXVpcmU6IHByZWZpeCA/IGAuLyR7cHJlZml4fS9pbmRleC5janNgIDogJy4vaW5kZXguY2pzJyxcbiAgICB9LFxuICB9XG4gIGNvbnN0IHR5cGVzID0ge1xuICAgICcuJzogW3ByZWZpeCA/IGAuLyR7cHJlZml4fS9pbmRleC5kLnRzYCA6ICcuL2luZGV4LmQudHMnXSxcbiAgfVxuICBmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHtcbiAgICBpZiAobmFtZSA9PT0gJ2luZGV4Jykge1xuICAgICAgY29udGludWVcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwcmVmaXggPyBgJHtwcmVmaXh9LyR7bmFtZX1gIDogbmFtZVxuICAgIGV4cG9ydHNbYC4vJHtuYW1lfWBdID0ge1xuICAgICAgaW1wb3J0OiBgLi8ke3ZhbHVlfS5qc2AsXG4gICAgICByZXF1aXJlOiBgLi8ke3ZhbHVlfS5janNgLFxuICAgIH1cbiAgICB0eXBlc1tuYW1lXSA9IFtgLi8ke3ZhbHVlfS5kLnRzYF1cbiAgfVxuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHBhY2thZ2VGaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pXG4gIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGNvbnRlbnQpXG4gIGpzb24uZXhwb3J0cyA9IGV4cG9ydHNcbiAganNvbi50eXBlc1ZlcnNpb25zID0ge1xuICAgICcqJzogdHlwZXMsXG4gIH1cbiAgZnMud3JpdGVGaWxlU3luYyhwYWNrYWdlRmlsZSwgSlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMikpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRXhwb3J0cyhuYW1lcykge1xuICBjb25zdCBjd2QgPSBwcm9jZXNzLmN3ZCgpXG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UuanNvbicpXG4gIGNvbnN0IHBhY2thZ2VMaWJKc29uID0gcGF0aC5qb2luKGN3ZCwgJ3BhY2thZ2UubGliLmpzb24nKVxuICB1cGRhdGVQYWNrYWdlSlNPTkV4cG9ydHNBbmRUeXBlcyhwYWNrYWdlSnNvbiwgbmFtZXMsICdkaXN0JylcbiAgdXBkYXRlUGFja2FnZUpTT05FeHBvcnRzQW5kVHlwZXMocGFja2FnZUxpYkpzb24sIG5hbWVzKVxufVxuXG5jb25zdCBuYW1lcyA9IGZzLnJlYWRkaXJTeW5jKHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJykpXG4gIC5maWx0ZXIoKGZpbGUpID0+IGZpbGUuZW5kc1dpdGgoJy50cycpICYmICFmaWxlLmVuZHNXaXRoKCcuZC50cycpKVxuICAubWFwKChmaWxlKSA9PiBmaWxlLnJlcGxhY2UoL1xcLnRzJC8sICcnKSlcblxud3JpdGVFeHBvcnRzKG5hbWVzKVxuXG5jb25zdCBmaWxlcyA9IFtcbiAgcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnaW5kZXgudHMnKSxcbiAgLi4ubmFtZXMubWFwKChmaWxlKSA9PiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycsIGAke2ZpbGV9LnRzYCkpXG5dXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFt0c2NvbmZpZ1BhdGhzKCksIGR0cyh7IGluY2x1ZGU6IFsnc3JjJ10gfSldLFxuICB0ZXN0OiB7XG4gICAgLi4uY29uZmlnRGVmYXVsdHMsXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBmaWxlcyxcbiAgICAgIG5hbWU6ICdAdGVtcG90cy9jb2xvcicsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGV4dGVuZDogdHJ1ZVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyVSxPQUFPLFFBQVE7QUFDMVYsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxtQkFBbUI7QUFOMUIsSUFBTSxt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
