import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [dts({ include: ['src'], insertTypesEntry: true })],
  test: {
    ...configDefaults,
    environment: 'happy-dom',
    // Let Happy DOM supply its Window storage even on Node versions that
    // expose an experimental storage global without a configured backing file.
    execArgv: process.allowedNodeEnvironmentFlags.has('--no-experimental-webstorage')
      ? ['--no-experimental-webstorage']
      : [],
    environmentOptions: {
      happyDOM: {
        settings: {
          disableJavaScriptFileLoading: true,
          enableJavaScriptEvaluation: false,
          enableCSSFileLoading: false,
          enableIframePageLoading: true,
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
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: '@tempots/dom',
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
