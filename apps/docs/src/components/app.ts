import { Location, RootRouter } from '@tempots/ui'
import { PageLayout } from './layout/page-layout'
import { DemoView } from './element/demo-view'
import { HtmlToTempo } from './html-to-tempo'
import type { Toc } from '../model/domain'
import { libraryFromRoute, pagePathFromRoute } from '../services/content-paths'
import type { PageSnapshot } from '../services/page-service'
import { tocAsMap } from '../services/toc-service'
import { SideBar } from './layout/sidebar'
import { LibraryView } from './element/library-view'
import { PageView } from './element/page-view'
import { ToolsView } from './element/tools-view'
import { LibrariesView } from './element/libraries-view'
import { DemosView } from './element/demos-view'
import { HomeView } from './element/home-view'
import { Ensure, Fragment, OnDispose, Provide, Use } from '@tempots/dom'
import { NavigationService } from '@tempots/ui'

export const AppRouter = (toc: Toc, initialPage?: PageSnapshot) => {
  const map = tocAsMap(toc)
  return RootRouter({
    '/': () => HomeView(map.pages.get('index')!, initialPage),
    '/tools.html': () => ToolsView(),
    '/tool/html-to-tempo.html': () => HtmlToTempo(),
    '/page/:id': info =>
      Ensure(
        info.$.path.map(path => map.pages.get(pagePathFromRoute(path) ?? '')),
        page => PageView(page, initialPage),
        () => '404 Not Found'
      ),
    '/libraries.html': () => LibrariesView(toc.libraries),
    '/library/:id': info =>
      Ensure(
        info.$.path.map(path => {
          const route = libraryFromRoute(path)
          if (!route) return
          const library = map.libraries.get(route.name)
          return library ? { library, path: route.apiPath } : undefined
        }),
        library => LibraryView(library, initialPage),
        () => '404 Not Found'
      ),
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

export function App(toc: Toc, initialPage?: PageSnapshot) {
  return Provide(Location, {}, () =>
    Use(Location, handle => {
      return Fragment(
        OnDispose(NavigationService.attach(handle)),
        PageLayout({
          sidebar: SideBar(toc),
          main: AppRouter(toc, initialPage),
        })
      )
    })
  )
}
