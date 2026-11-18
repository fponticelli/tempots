import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [dts({ include: ['src'], insertTypesEntry: true })],
  test: {
    ...configDefaults,
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/types/**',
        'src/vite-env.d.ts',
        'scripts/**',
        'dist/**',
        'docs/**',
        '**/*.d.ts',
        'vite.config.js',
        'eslint.config.js',
      ],
      thresholds: {
        // Lower thresholds since plugin hooks require integration testing with Vite
        global: {
          statements: 10,
          branches: 20,
          functions: 20,
          lines: 10,
        },
      },
      skipFull: false,
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: '@tempots/vite',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['@tempots/dom', '@tempots/server', 'vite', 'node:fs', 'node:path', 'node:url'],
      output: {
        extend: true,
      },
    },
  },
})
