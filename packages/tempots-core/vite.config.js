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
        // Export-only module with no business logic
        'src/index.ts',
        // Build scripts
        'scripts/**',
      ],
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@tempots/core',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        extend: true
      }
    },
  },
})

