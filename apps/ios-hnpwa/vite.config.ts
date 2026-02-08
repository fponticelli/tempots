import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/main.ts',
      formats: ['iife'],
      name: 'TempoHNPWA',
      fileName: () => 'bundle.js',
    },
    outDir: 'dist',
    minify: false,
  },
})
