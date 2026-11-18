import { createRenderer } from '@tempots/server'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { App } from './components/app'
import type { Toc } from './model/domain'
import { pagePathFromRoute, type PageSnapshot } from './services/page-service'

const publicDir = resolve(process.cwd(), 'public')
const toc: Toc = JSON.parse(
  readFileSync(resolve(publicDir, 'toc.json'), 'utf8')
)

const renderer = createRenderer(
  ({ initialPage }: { initialPage: PageSnapshot | undefined }) =>
    App(toc, initialPage),
  {
    selector: '#app',
    hydrate: false,
    async getData(url) {
      const path = pagePathFromRoute(new URL(url).pathname)
      const page = toc.pages.find(page => page.path === path)
      if (!page) return { initialPage: undefined }

      const html = await readFile(
        resolve(publicDir, 'pages', `${page.path}.html`),
        'utf8'
      )
      return { initialPage: { path: page.path, html } }
    },
  }
)

/** Renders a fully populated docs route for the Vite static build. */
export function render(url: string): Promise<string> {
  return renderer.render(new URL(url, 'https://tempo-ts.com').href)
}

export { App }
