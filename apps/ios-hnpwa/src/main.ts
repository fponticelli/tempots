import { createNavigator, renderNative } from '@tempots/native'
import { Route, Feed, loadRoute } from './route'
import { Page } from './types'
import { deepEqual } from './utils/equals'
import { App } from './components/app'

const nav = createNavigator(Route.feeds(Feed.top, 1), deepEqual)

const page = nav.route
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe(v => v, Page.notFound)

renderNative(App(nav, page))
