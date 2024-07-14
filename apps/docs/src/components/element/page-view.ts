import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage } from '../../services/page-service'
import { EmbedHTML } from './embed-html'

export function PageView(page: Signal<Page>) {
  return html.div(
    attr.class('w-full h-full print:overflow-visible overflow-auto p-2'),
    html.div(
      attr.class('px-4'),
      html.div(EmbedHTML(page.$.path.mapAsync(fetchPage, 'loading...')))
    )
  )
}
