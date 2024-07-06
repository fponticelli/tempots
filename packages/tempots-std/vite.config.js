import fs from 'fs'
import path from 'path'
import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

function updateExportsAndTypesVersions(packageFile, names, prefix = null) {
  const exports = {}
  const types = {}
  for (const name of names) {
    const value = prefix ? `${prefix}/${name}` : name
    exports[`./${name}`] = {
      import: `./${value}.js`,
      require: `./${value}.cjs`,
    }
    types[name] = [`./${value}.d.ts`]
  }
  const content = fs.readFileSync(packageFile, { encoding: 'utf-8' })
  const json = JSON.parse(content)
  json.exports = exports
  json.typesVersions = {
    '*': types,
  }
  fs.writeFileSync(packageFile, JSON.stringify(json, null, 2))
}

function writeExports(names) {
  const cwd = process.cwd()
  const packageJson = path.join(cwd, 'package.json')
  const packageLibJson = path.join(cwd, 'package.lib.json')
  updateExportsAndTypesVersions(packageJson, names, 'dist')
  updateExportsAndTypesVersions(packageLibJson, names)
}

const names = fs.readdirSync(resolve(__dirname, 'src'))
  .filter((file) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .map((file) => file.replace(/\.ts$/, ''))

writeExports(names)

const files = names.map((file) => resolve(__dirname, 'src', `${file}.ts`))

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ['src'] })],
  test: {
    ...configDefaults,
    globals: true,
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: files,
      name: '@tempots/std',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        extend: true
      }
    },
  },
})
