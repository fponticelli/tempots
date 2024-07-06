import { If, Match, Signal } from '@tempots/dom'
import { Feed, Route, toTitle } from '../route'
import { LinkRoute } from './link-route'
import { Page } from '../types'
import { PageFeed } from './page-feed'
import { ProfileView } from './profile'
import { NotFound } from './not-found'
import { Loading } from './loading'
import { ErrorView } from './error'
import { Article } from './article'

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32">
    <g fill="#ffffff">
      <rect x="0" y="0" width="8" height="8" />
      <rect x="11" y="0" width="8" height="8" />
      <rect x="22" y="0" width="8" height="8" />
      <rect x="11" y="11" width="8" height="8" />
      <rect x="11" y="22" width="8" height="8" />
    </g>
  </svg>
)

function HeaderLink(
  { route, feed }: { route: Signal<Route>; feed: Feed }
) {
  const condition = route.map(r => r.type === 'FeedsRoute' && r.feed === feed)
  const whenTrue = (
    <span aria-current="page">{toTitle(Route.feeds(feed, 1))}</span>
  )
  const wheFalse = <LinkRoute route={Signal.of(Route.feeds(feed, 1))} />
  return <If is={condition} then={whenTrue} otherwise={wheFalse} />
}

export interface AppProps {
  route: Signal<Route>
  page: Signal<Page>
}

export function App({ route, page }: AppProps) {
  return (
    <main>
      <header>
        <LinkRoute
          route={Signal.of(Route.root)}
          aria-label="Homepage"
          className="logo"
        >
          <Logo />
        </LinkRoute>
        <nav>
          <HeaderLink feed={Feed.top} route={route} />
          <HeaderLink feed={Feed.new} route={route} />
          <HeaderLink feed={Feed.ask} route={route} />
          <HeaderLink feed={Feed.show} route={route} />
          <HeaderLink feed={Feed.jobs} route={route} />
        </nav>
      </header>
      <section>
        <Match
          on={page}
          using={'type'}
          matches={{
            Article: p => <Article item={p.at('item')} />,
            PageFeed: p => <PageFeed page={p} />,
            Profile: e => <ProfileView user={e.at('user')} />,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            NotFound: _ => <NotFound />,
            Error: e => <ErrorView error={e} />,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Loading: _ => <Loading />
          }}
        />
      </section>
    </main>
  )
}
