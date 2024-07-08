import './style.sass'

import { Tempo } from 'tempo-dom/lib/tempo'
import { makeState } from './state'
import { reducer } from './reducer'
import { mainTemplate } from './templates/main'
import { middleware } from './middleware'
import { parseLocation } from './route'
import { Action } from './action'

const route = parseLocation()
const state = makeState(route)

const view = Tempo.render({
  state,
  reducer,
  template: mainTemplate,
  middleware
})

window.addEventListener('popstate', e => {
  const route = parseLocation()
  view.dispatch(Action.goTo(route))
})

view.dispatch(Action.requestToc)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
  })
}
