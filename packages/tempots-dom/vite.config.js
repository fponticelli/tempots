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
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@tempots/dom',
      formats: ['es', 'cjs'],
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        extend: true
      }
    },
  },
})