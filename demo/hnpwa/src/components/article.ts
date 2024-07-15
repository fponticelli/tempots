import { attr, Ensure, html } from '@tempots/dom'
import { HTMLTitle } from '@tempots/ui'
import type { Signal } from '@tempots/dom'
import { Item } from '../types'
import { ItemFooter, ItemMainLink } from './page-feed'
import { Comments } from './comments'

export const Article = (item: Signal<Item>) => {
  return html.article(
    HTMLTitle(item.at('title').map(v => `HNPWA • ${v}`)),
    html.section(
      ItemMainLink(item),
      Ensure(item.at('domain'), domain =>
        html.span(attr.class('domain'), domain)
      ),
      ItemFooter(item)
    ),
    Ensure(item.at('content'), content => html.div(attr.innerHTML(content))),
    Ensure(item.at('comments'), comments =>
      html.section(attr.class('comments-view'), Comments({ items: comments }))
    )
  )
}
