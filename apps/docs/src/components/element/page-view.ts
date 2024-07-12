import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage } from '../../services/page-service'

export function PageView(page: Signal<Page>) {
  return html.div(
    attr.class('w-full h-full overflow-auto px-4 prose'),
    html.div(attr.innerHTML(page.$.path.mapAsync(fetchPage, 'loading...')))
  )
}
