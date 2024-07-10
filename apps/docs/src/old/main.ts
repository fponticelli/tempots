// import './style.sass'

import { DispatchProvider, makeState, StateProvider } from './state'
import { reducer } from './reducer'
import { App } from './templates/app'
import { middleware } from './middleware'
import { parseLocation } from './route'
import { Action } from './action'
import { prop, render } from '@tempots/dom'

const route = parseLocation()
const state = prop(makeState(route))

const dispatch = state.reducer(reducer, middleware)

render(
  StateProvider(state, DispatchProvider(dispatch, App(state))),
  document.body
)

window.addEventListener('popstate', () => {
  const route = parseLocation()
  dispatch(Action.goTo(route))
})

dispatch(Action.requestToc)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
  })
}
