import {
  aria,
  Fragment,
  html,
  useSignal,
  Signal,
  svg,
  svgAttr,
  When,
  OneOfType,
  Portal,
  attr,
} from '@tempots/dom'
import { Feed, Route, toTitle } from '../route'
import { LinkRoute } from './link-route'
import { Page } from '../types'
import { PageFeedView } from './page-feed'
import { ProfileView } from './profile'
import { NotFound } from './not-found'
import { Loading } from './loading'
import { ErrorView } from './error'
import { Article } from './article'

const Logo = () =>
  svg.svg(
    svgAttr.width(50),
    svgAttr.height(50),
    svgAttr.viewBox('0 0 50 50'),
    svg.rect(
      svgAttr.fill('#ffffff'),
      svgAttr.x(0),
      svgAttr.y(0),
      svgAttr.width(50),
      svgAttr.height(50)
    ),
    svg.g(
      svgAttr.transform('translate(9 9)'),
      svgAttr.fill('#1293D8'),
      svg.rect(svgAttr.x(0), svgAttr.y(0), svgAttr.width(8), svgAttr.height(8)),
      svg.rect(
        svgAttr.x(11),
        svgAttr.y(0),
        svgAttr.width(8),
        svgAttr.height(8)
      ),
      svg.rect(
        svgAttr.x(22),
        svgAttr.y(0),
        svgAttr.width(8),
        svgAttr.height(8)
      ),
      svg.rect(
        svgAttr.x(11),
        svgAttr.y(11),
        svgAttr.width(8),
        svgAttr.height(8)
      ),
      svg.rect(
        svgAttr.x(11),
        svgAttr.y(22),
        svgAttr.width(8),
        svgAttr.height(8)
      )
    )
  )

function HeaderLink({ route, feed }: { route: Signal<Route>; feed: Feed }) {
  const condition = route.map(r => r.type === 'FeedsRoute' && r.feed === feed)
  const whenTrue = html.span(
    aria.current('page'),
    toTitle(Route.feeds(feed, 1))
  )
  const whenFalse = LinkRoute({ route: useSignal(Route.feeds(feed, 1)) })
  return When(condition, whenTrue, whenFalse)
}

export function App(route: Signal<Route>, page: Signal<Page>) {
  const urlParams = new URLSearchParams(window.location.search)
  const base = urlParams.has('base') ? urlParams.get('base') : null
  return html.main(
    base && Portal('head', html.base(attr.href(base))),
    html.header(
      LinkRoute({
        route: useSignal(Route.root),
        className: 'logo',
        children: Fragment(aria.label('Homepage'), Logo()),
      }),
      html.nav(
        HeaderLink({ feed: Feed.top, route }),
        HeaderLink({ feed: Feed.new, route }),
        HeaderLink({ feed: Feed.ask, route }),
        HeaderLink({ feed: Feed.show, route }),
        HeaderLink({ feed: Feed.jobs, route })
      )
    ),
    html.section(
      OneOfType(page, {
        Article: p => Article(p.at('item')),
        PageFeed: PageFeedView,
        Profile: e => ProfileView({ user: e.at('user') }),
        NotFound: NotFound,
        Error: ErrorView,
        Loading: Loading,
      })
    )
  )
}
