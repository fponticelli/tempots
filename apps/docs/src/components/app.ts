import { ProvideLocation, Router } from '@tempots/ui'
import { PageLayout } from './layout/page'
import { DemoView } from './element/demo-view'
import { HtmlToTempo } from './html-to-tempo'
import { Toc } from '../model/domain'
import { tocAsMap } from '../services/toc-service'
import { SideBar } from './layout/sidebar'
import { LibraryView } from './element/library-view'
import { PageView } from './element/page-view'
import { ToolsView } from './element/tools-view'
import { LibrariesView } from './element/libraries-view'
import { DemosView } from './element/demos-view'
import { HomeView } from './element/home-view'

export const AppRouter = (toc: Toc) => {
  const map = tocAsMap(toc)
  return Router({
    '/': () => HomeView(),
    '/tools': () => ToolsView(),
    '/tool/html-to-tempo': () => HtmlToTempo(),
    '/page/:id': info =>
      PageView(info.$.params.$.id.map(id => map.pages.get(id)!)),
    '/libraries': () => LibrariesView(toc.libraries),
    '/library/:id': info =>
      LibraryView(info.$.params.$.id.map(id => map.libraries.get(id)!)),
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
