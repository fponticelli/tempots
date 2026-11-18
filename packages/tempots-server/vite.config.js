import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [dts({ include: ['src'], insertTypesEntry: true })],
  test: {
    ...configDefaults,
    environment: 'node',
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
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
      skipFull: false,
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: '@tempots/server',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['@tempots/core', '@tempots/dom', 'stream'],
      output: {
        extend: true,
      },
    },
  },
})
