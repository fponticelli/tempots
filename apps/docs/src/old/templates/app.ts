import {
  aria,
  attr,
  computed,
  dataAttr,
  ForEach,
  html,
  oneof,
  signal,
  Signal,
} from '@tempots/dom'
import { State } from '../state'
import { link, maybeLink } from './link'
import { Route, sameRoute } from '../route'
import { Maybe } from '@tempots/std/maybe'
import { loader } from './loader'
import { sidebar } from './sidebar'
import { contentTemplate } from './content'

// const toggleMenu = (dispatch: (a: Action) => void) => () => {
//   const side = document.querySelector('.side-control')!
//   const main = document.querySelector('.main-column')!

//   function close() {
//     element.classList.remove('is-active')
//     side.classList.remove('is-active')
//     main.removeEventListener('mouseup', close, true)
//   }

//   if (element.classList.contains('is-active')) {
//     close()
//   } else {
//     element.classList.add('is-active')
//     side.classList.add('is-active')
//     main.addEventListener('mouseup', close, true)
//   }
//   return undefined
// }

export const App = (state: Signal<State>) =>
  html.div(
    attr.class('app'),
    html.nav(
      attr.class('navbar has-shadow'),
      attr.role('navigation'),
      aria.label('main navigation'),
      html.div(
        attr.class('container'),
        html.div(
          attr.class('navbar-brand'),
          html.a(
            attr.class('navbar-burger burger'),
            aria.label('menu'),
            aria.expanded(false),
            dataAttr.target('navbarBasicExample'),
            // UseDispatch(dispatch => on.click(toggleMenu(dispatch))),
            html.span(aria.hidden(true)),
            html.span(aria.hidden(true)),
            html.span(aria.hidden(true))
          ),
          link(
            signal(Route.home),
            html.img(
              html.img(
                attr.src('assets/icon-512x512.png'),
                attr.alt('Tempo'),
                aria.hidden(true)
              )
            ),
            attr.class('navbar-item')
          ),
          html.div(
            attr.class('navbar-menu'),
            html.div(
              attr.class('navbar-start'),
              link(signal(Route.home), 'Tempo', attr.class('navbar-item'))
            ),
            html.div(
              attr.class('navbar-end'),
              html.a(
                attr.class('navbar-item'),
                attr.href('https://github.com/fponticelli/tempots'),
                html.img(
                  attr.src('assets/github-mark-64px.png'),
                  'Github Project'
                )
              ),
              maybeLink(
                state.map(s =>
                  sameRoute(Route.demos, s.route) ? Maybe.nothing : s.route
                ),
                'Demos',
                attr.class('navbar-item')
              ),
              html.div(
                attr.class('navbar-item has-dropdown is-hoverable'),
                html.a(attr.class('navbar-link'), 'Projects'),
                html.div(
                  attr.class('navbar-dropdown'),
                  oneof.type(
                    state.map(s => s.toc),
                    {
                      Success: toc =>
                        ForEach(toc.$.value.$.projects, project =>
                          link(
                            project.map(p => Route.project(p.name)),
                            project.$.title,
                            attr.class('navbar-item')
                          )
                        ),
                      Failure: e => html.div(html.p(e.$.error.$.message)),
                      Loading: () => html.div('Loading...'),
                      NotAsked: () => html.div('Not Asked'),
                    }
                  )
                )
              )
            )
          )
        )
      )
    ),
    oneof.type(
      state.map(s => s.toc),
      {
        NotAsked: () => 'not asked',
        Loading: () => loader,
        Failure: e => html.div(e.$.error.$.message),
        Success: toc =>
          html.main(
            attr.class('container'),
            html.div(
              attr.class('columns is-mobile'),
              html.div(
                attr.class(
                  'column has-background-light side-control scrollable'
                ),
                sidebar(
                  computed(
                    () => ({ toc: toc.value.value, route: state.value.route }),
                    [toc, state]
                  )
                )
              ),
              html.div(
                attr.class('column scrollable main-column'),
                contentTemplate(state.map(s => s.content))
              )
            )
          ),
      }
    )
  )
