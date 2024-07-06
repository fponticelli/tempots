import './assets/style.scss'
import { render } from '@tempots/dom'
import { App } from './components/app'
import { loadRoute, makeRouteFlow } from './route'
import { Page } from './types'
import { id } from '@tempots/std/functions'

export const globalRoute = makeRouteFlow()
export const setGlobalRoute = globalRoute.set

const page = globalRoute
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe<Page>(id, Page.notFound)

render(
  <App route={globalRoute} page={page} />,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.getElementById('app')!
)
