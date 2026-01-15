import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
  },
  ssr: {
    // Externalize dependencies for SSR build
    external: ['@tempots/dom', '@tempots/server', '@tempots/client'],
  },
})
