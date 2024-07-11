import { ProvideLocation, Router } from '@tempots/ui'
import { PageLayout } from './layout/page'
import { DemoView } from './element/demo-view'
import { HtmlToTempo } from './html-to-tempo'

export const AppRouter = () =>
  Router({
    '/': () => 'Home Page',
    '/tool/html-to-tempo': () => HtmlToTempo(),
    '/page/:id': info => info.$.params.$.id.map(id => `Page ${id}`),
    '/library/:id': info => info.$.params.$.id.map(id => `Library ${id}`),
    '/demo/:id': info => DemoView(info.$.params.$.id),
    '/*': () => '404 Not Found',
  })

export function App() {
  return ProvideLocation(
    PageLayout({
      main: AppRouter(),
    })
  )
}
