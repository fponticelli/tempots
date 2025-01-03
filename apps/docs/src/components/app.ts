import { ProvideLocation, Router } from '@tempots/ui'
import { PageLayout } from './layout/page-layout'
import { DemoView } from './element/demo-view'
import { HtmlToTempo } from './html-to-tempo'
import { Library, Toc } from '../model/domain'
import { tocAsMap } from '../services/toc-service'
import { SideBar } from './layout/sidebar'
import { LibraryView } from './element/library-view'
import { PageView } from './element/page-view'
import { ToolsView } from './element/tools-view'
import { LibrariesView } from './element/libraries-view'
import { DemosView } from './element/demos-view'
import { HomeView } from './element/home-view'

function mapPathToLibraryPageURL(path: string) {
  if (path.startsWith('/library/')) {
    path = path.slice('/library/'.length)
  }
  if (path.endsWith('.html')) {
    path = path.slice(0, -5)
  }
  if (path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  const parts = path.split('.')
  const lib = parts.shift()!.substring('tempots-'.length)
  const sub = parts.length === 0 ? undefined : parts.join('.')
  return [lib, sub]
}

export const AppRouter = (toc: Toc) => {
  const map = tocAsMap(toc)
  return Router({
    '/': () => HomeView(map.pages.get('index')!),
    '/tools.html': () => ToolsView(),
    '/tool/html-to-tempo.html': () => HtmlToTempo(),
    '/page/:id': info =>
      PageView(info.$.params.$.id.map(id => map.pages.get(id.slice(0, -5))!)),
    '/libraries.html': () => LibrariesView(toc.libraries),
    '/library/:id': info => {
      const url = info.$.path.map(mapPathToLibraryPageURL)
      return LibraryView(
        url.map(([id, path]): { library: Library; path?: string } => ({
          library: map.libraries.get(`tempots-${id}`)!,
          path,
        }))
      )
    },
    '/demos.html': () => DemosView(toc.demos),
    '/demo/:id': info =>
      DemoView(
        info.$.params.$.id
          .map(id => id.slice(0, -5))
          .map(id => ({ id, ...map.demos.get(id)! }))
      ),
    '/*': () => '404 Not Found',
  })
}

export function App(toc: Toc) {
  return ProvideLocation(
    PageLayout({
      sidebar: SideBar(toc),
      main: AppRouter(toc),
    })
  )
}
