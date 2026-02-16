import {
  view,
  nativeStyle,
  Pressable,
  When,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal } from '@tempots/core'
import type { Navigator } from '@tempots/native'
import { Feed, Route, feedToTitle } from '../route'
import { styles } from '../styles'

const HeaderTab = (
  nav: Navigator<Route>,
  feed: Feed,
  currentRoute: Signal<Route>
): NativeRenderable => {
  const isActive = currentRoute.map(
    r => r.type === 'FeedsRoute' && r.feed === feed
  )
  return When(
    isActive,
    () =>
      view.View(
        nativeStyle.style(styles.headerTab),
        view.Text(feedToTitle(feed), nativeStyle.style(styles.headerTabActive))
      ),
    () =>
      Pressable(
        () => nav.navigate(Route.feeds(feed, 1)),
        {},
        view.Text(feedToTitle(feed), nativeStyle.style(styles.headerTabText)),
        nativeStyle.style(styles.headerTab)
      )
  )
}

export const Header = (nav: Navigator<Route>): NativeRenderable =>
  view.View(
    nativeStyle.style(styles.header),
    // Back button (shown when can go back)
    When(
      nav.canGoBack,
      () =>
        Pressable(
          () => nav.back(),
          {},
          view.Text('<', nativeStyle.style(styles.backButtonText)),
          nativeStyle.style(styles.backButton)
        )
    ),
    // Logo
    Pressable(
      () => nav.navigate(Route.feeds(Feed.top, 1)),
      {},
      view.View(
        nativeStyle.style(styles.headerLogo),
        view.Text('Y', nativeStyle.style(styles.headerLogoText))
      )
    ),
    // Feed tabs
    HeaderTab(nav, Feed.top, nav.route),
    HeaderTab(nav, Feed.new, nav.route),
    HeaderTab(nav, Feed.ask, nav.route),
    HeaderTab(nav, Feed.show, nav.route),
    HeaderTab(nav, Feed.jobs, nav.route)
  )
