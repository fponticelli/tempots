import { ProvideLocation, Router } from '@tempots/ui'
import { PageLayout } from './layout/page'
import { DemoView } from './element/demo-view'
import { HtmlToTempo } from './html-to-tempo'
import { Toc } from '../model/domain'
import { tocAsMap } from '../services/toc-service'
import { SideBar } from './layout/sidebar'

export const AppRouter = (toc: Toc) => {
  const map = tocAsMap(toc)
  return Router({
    '/': () => 'Home Page',
    '/tool/html-to-tempo': () => HtmlToTempo(),
    '/page/:id': info =>
      info.$.params.$.id.map(id => {
        const page = map.pages.get(id)
        return JSON.stringify(page)
      }),
    '/library/:id': info =>
      info.$.params.$.id.map(id => {
        const library = map.libraries.get(id)
        return JSON.stringify(library)
      }),
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
