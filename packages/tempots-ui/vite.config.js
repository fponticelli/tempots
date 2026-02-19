import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ['src'] })],
  test: {
    ...configDefaults,
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,ts}'],
      exclude: [
        ...configDefaults.coverage.exclude,
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
          branches: 75,
          functions: 80,
          lines: 80,
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
      name: '@tempots/ui',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['@tempots/dom', '@tempots/std', '@floating-ui/dom'],
      output: {
        extend: true,
      },
    },
  },
})
