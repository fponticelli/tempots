import {
  view,
  nativeStyle,
  OneOfType,
  type NativeRenderable,
} from '@tempots/native'
import type { Signal } from '@tempots/core'
import type { Navigator } from '@tempots/native'
import type { Page } from '../types'
import type { Route } from '../route'
import { styles } from '../styles'
import { Header } from './header'
import { FeedList } from './feed-list'
import { ArticleView } from './article'
import { ProfileView } from './profile'
import { Loading } from './loading'
import { ErrorView } from './error'
import { NotFoundView } from './not-found'

export const App = (
  nav: Navigator<Route>,
  page: Signal<Page>
): NativeRenderable =>
  view.SafeAreaView(
    nativeStyle.style(styles.root),
    Header(nav),
    view.View(
      nativeStyle.style({ flex: 1 }),
      OneOfType(page, {
        PageFeed: p => FeedList(nav, p),
        Article: p => ArticleView(nav, p.$.item),
        Profile: p => ProfileView(p.$.user),
        Loading: () => Loading(),
        Error: ErrorView,
        NotFound: () => NotFoundView(),
      })
    )
  )
