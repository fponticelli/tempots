import './assets/style.scss'
import { render } from '@tempots/dom'
import { loadRoute } from './route'
import { Page } from './types'
import { App } from './components/app'
import { globalRoute } from './state'

const page = globalRoute
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe(v => v, Page.notFound)

render(App(globalRoute, page), document.getElementById('app')!)
