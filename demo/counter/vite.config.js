/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import { tempo } from '@tempots/vite'

export default defineConfig({
  base: '',
  plugins: [tempo({ devtools: true })],
})
