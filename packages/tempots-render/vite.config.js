import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [dts({ include: ['src'] })],
  test: {
    ...configDefaults,
    globals: true,
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/index.ts',
        'scripts/**',
      ],
    },
  },
  build: {
    minify: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: '@tempots/render',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['@tempots/core'],
      output: {
        extend: true,
        globals: {
          '@tempots/core': 'tempots-core',
        },
      },
    },
  },
})
