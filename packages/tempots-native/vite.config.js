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
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
  build: {
    minify: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: '@tempots/native',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['@tempots/core', '@tempots/render'],
      output: {
        extend: true,
        globals: {
          '@tempots/core': 'tempots-core',
          '@tempots/render': 'tempots-render',
        },
      },
    },
  },
})
