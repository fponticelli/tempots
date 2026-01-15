import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ['src'], insertTypesEntry: true })],
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
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@tempots/vite',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['@tempots/dom', '@tempots/server', 'vite', 'node:fs', 'node:path', 'node:url'],
      output: {
        extend: true,
      },
    },
  },
})
