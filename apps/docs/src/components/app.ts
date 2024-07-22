import { ProvideLocation, Router } from '@tempots/ui'
import { PageLayout } from './layout/page'
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
  console.log('mapPathToLibraryPageURL', path)
  if (path.startsWith('/library/')) {
    path = path.slice('/library/'.length)
  }
  const parts = path.split('/')
  const lib = parts.shift()!.substring('tempots-'.length)
  return [lib, parts.join('.')]
}

export const AppRouter = (toc: Toc) => {
  const map = tocAsMap(toc)
  return Router({
    '/': () => HomeView(map.pages.get('index')!),
    '/tools': () => ToolsView(),
    '/tool/html-to-tempo': () => HtmlToTempo(),
    '/page/:id': info =>
      PageView(info.$.params.$.id.map(id => map.pages.get(id)!)),
    '/libraries': () => LibrariesView(toc.libraries),
    '/library/:id': info => {
      const id = info.$.params.$.id
      return LibraryView(
        id.map((id): { library: Library; path?: string } => ({
          library: map.libraries.get(id)!,
        }))
      )
    },
    '/library/*': info => {
      const url = info.$.path.map(mapPathToLibraryPageURL)
      return LibraryView(
        url.map(([id, path]): { library: Library; path?: string } => ({
          library: map.libraries.get(`tempots-${id}`)!,
          path,
        }))
      )
    },
    '/demos': () => DemosView(toc.demos),
    '/demo/:id': info =>
      DemoView(info.$.params.$.id.map(id => ({ id, ...map.demos.get(id)! }))),
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
