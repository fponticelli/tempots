import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ['src'], insertTypesEntry: true })],
  test: {
    ...configDefaults,
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          disableJavaScriptFileLoading: true,
          disableJavaScriptEvaluation: false,
          disableCSSFileLoading: true,
          enableFileSystemHttpRequests: false,
        },
      },
    },
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
          statements: 97,
          branches: 98,
          functions: 98,
          lines: 97,
        },
      },
      skipFull: false,
    },
  },
  build: {
    minify: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@tempots/dom',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
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
