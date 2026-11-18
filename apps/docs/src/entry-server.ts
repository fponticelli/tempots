import { createRenderer } from '@tempots/server'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { App } from './components/app'
import type { Toc } from './model/domain'
import {
  libraryFromRoute,
  libraryOverviewKey,
  pageContentFile,
  pagePathFromRoute,
} from './services/content-paths'
import type { PageSnapshot } from './services/page-service'

const publicDir = resolve(process.cwd(), 'public')
const toc: Toc = JSON.parse(
  readFileSync(resolve(publicDir, 'toc.json'), 'utf8')
)

function contentKeyForRoute(pathname: string): string | undefined {
  const page = pagePathFromRoute(pathname)
  if (page !== undefined && toc.pages.some(entry => entry.path === page))
    return page

  const library = libraryFromRoute(pathname)
  if (library === undefined || library.apiPath !== undefined) return
  if (
    toc.libraries.some(
      entry => entry.name === library.name && entry.hasOverview
    )
  ) {
    return libraryOverviewKey(library.name)
  }
}

const renderer = createRenderer(
  ({ initialPage }: { initialPage: PageSnapshot | undefined }) =>
    App(toc, initialPage),
  {
    selector: '#app',
    hydrate: false,
    async getData(url) {
      const path = contentKeyForRoute(new URL(url).pathname)
      if (path === undefined) return { initialPage: undefined }
      const html = await readFile(
        resolve(publicDir, pageContentFile(path)),
        'utf8'
      )
      return { initialPage: { path, html } }
    },
  }
)

/** Renders a fully populated docs route for the Vite static build. */
export function render(url: string): Promise<string> {
  return renderer.render(new URL(url, 'https://tempo-ts.com').href)
}

export { App }
