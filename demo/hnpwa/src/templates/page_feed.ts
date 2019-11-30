import { footer, section, ul, li, aside, span, a, div, h2 } from '@tempo/dom/lib/html'
import { iterate } from '@tempo/dom/lib/iterate'
import { fragment } from '@tempo/dom/lib/fragment'
import { PageFeed, Item, External } from '../state'
import { Action } from '../action'
import { match, matchBool } from '@tempo/dom/lib/match'
import { mapState } from '@tempo/dom/lib/map'
import { Route } from '../route'
import { linkRoute } from './link_route'
import { paginationTemplate } from './pagination'

export const itemUrlTemplate = match<['url', 'kind'], Item, Action>(['url', 'kind'], {
  External: linkRoute<Item & { url: External }>(
    { route: item => Route.externalRoute(item.url.path) },
    h2({}, (item: Item) => item.title)
  ),
  Internal: linkRoute(
    { route: item => Route.item(item.id) },
    h2({}, (item: Item) => item.title)
  ),
  None: h2({}, (item: Item) => item.title)
})

export const listItemUrlTemplate = match<['url', 'kind'], Item, Action>(['url', 'kind'], {
  External: linkRoute<Item & { url: External }>(
    { route: item => Route.externalRoute(item.url.path) },
    (item: Item) => item.title
  ),
  Internal: linkRoute({ route: item => Route.item(item.id) }, (item: Item) => item.title),
  None: (item: Item) => item.title
})

export const itemFooterTemplate = footer<Item, Action>(
  {},
  matchBool({
    condition: item => item.type === 'job',
    true: item => item.time_ago,
    false: fragment(
      item => String(item.points),
      ' points by ',
      linkRoute({ route: item => Route.user(item.user) }),
      ' ',
      item => item.time_ago,
      ' ',
      linkRoute({ route: item => Route.item(item.id) }, item => String(item.comments_count), ' comments')
    )
  })
)

const listItemTemplate = li<[Item, PageFeed, number], Action>(
  {},
  aside({}, ([_i, page, index]) => String((page.page - 1) * 30 + index + 1)),
  div(
    {},
    mapState(
      { map: ([item]) => item },
      listItemUrlTemplate,
      span({ attrs: { className: 'domain' } }, item => item.domain, itemFooterTemplate)
    )
  )
)

export const pageFeedTemplate = section<PageFeed, Action>(
  {
    attrs: { className: 'list-view' }
  },
  ul({}, iterate({ getArray: state => state.items }, listItemTemplate)),
  mapState(
    {
      map: state => ({ feed: state.feed, page: state.page })
    },
    paginationTemplate
  )
)
