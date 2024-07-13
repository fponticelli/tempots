import { attr, html, Signal } from '@tempots/dom'
import { Page } from '../../model/domain'
import { fetchPage } from '../../services/page-service'
import { Styles } from '../styles'

export function PageView(page: Signal<Page>) {
  return html.div(
    attr.class('h-full overflow-auto p-4 px-4'),
    attr.class(Styles.prose),
    html.div(attr.innerHTML(page.$.path.mapAsync(fetchPage, 'loading...')))
  )
}
