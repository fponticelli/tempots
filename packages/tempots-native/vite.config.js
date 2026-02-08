import { configDefaults } from 'vitest/config'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), dts({ include: ['src'] })],
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
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@tempots/native',
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
