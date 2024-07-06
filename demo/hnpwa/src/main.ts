import './assets/style.scss'
import { render } from '@tempots/dom'
import { loadRoute, makeRouteFlow } from './route'
import { Page } from './types'
import { App } from './components/app'

export const globalRoute = makeRouteFlow()
export const setGlobalRoute = globalRoute.set

const page = globalRoute
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe(v => v, Page.notFound)

render(App(globalRoute, page), document.getElementById('app')!)
