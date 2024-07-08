import {
  DIV,
  IMG,
  MatchAsyncResult,
  Iterate,
  MapField
} from 'tempo-dom/lib/html'
import { State, Content } from '../state'
import { Action } from '../action'
import { Toc } from '../toc'
import { contentTemplate } from './content'
import { HttpError } from '../request'
import { link, maybeLink } from './link'
import { Route, sameRoute } from '../route'
import { none, some } from 'tempo-std/lib/option'
import { loader } from './loader'
import { sidebar } from './sidebar'
import { AsyncResult } from 'tempo-std/lib/async_result'

const toggleMenu = (
  _s: State,
  _e: Event,
  element: HTMLElement
): Action | undefined => {
  const side = document.querySelector('.side-control')!
  const main = document.querySelector('.main-column')!

  function close() {
    element.classList.remove('is-active')
    side.classList.remove('is-active')
    main.removeEventListener('mouseup', close, true)
  }

  if (element.classList.contains('is-active')) {
    close()
  } else {
    element.classList.add('is-active')
    side.classList.add('is-active')
    main.addEventListener('mouseup', close, true)
  }
  return undefined
}

export const mainTemplate = DIV<State, Action, unknown>($ =>
  $.class('app')
    .NAV($ =>
      $.class('navbar has-shadow')
        .role('navigation')
        .ariaLabel('main navigation')
        .DIV($ =>
          $.class('container')
            .DIV($ =>
              $.class('navbar-brand')
                .A($ =>
                  $.role('button')
                    .class('navbar-burger burger')
                    .ariaLabel('menu')
                    .ariaExpanded(false)
                    .data('target', 'navbarBasicExample')
                    .onClick(toggleMenu)
                    .SPAN($ => $.ariaHidden(true))
                    .SPAN($ => $.ariaHidden(true))
                    .SPAN($ => $.ariaHidden(true))
                )
                .Append(
                  link({
                    label: IMG($ =>
                      $.src('assets/icon-512x512.png')
                        .alt('Tempo')
                        .ariaHidden(true)
                    ),
                    route: Route.home,
                    class: 'navbar-item'
                  })
                )
            )
            .DIV($ =>
              $.class('navbar-menu')
                .DIV($ =>
                  $.class('navbar-start').Append(
                    link({
                      label: 'Tempo',
                      route: Route.home,
                      class: 'navbar-item'
                    })
                  )
                )
                .DIV($ =>
                  $.class('navbar-end')
                    .A($ =>
                      $.class('navbar-item')
                        .href('https://github.com/fponticelli/tempo')
                        .IMG($ =>
                          $.src('assets/github-mark-64px.png').text(
                            'Github Project'
                          )
                        )
                    )
                    .Append(
                      maybeLink({
                        label: 'Demos',
                        route: s =>
                          sameRoute(Route.demos, s.route)
                            ? none
                            : some(Route.demos),
                        class: 'navbar-item'
                      })
                    )
                    .DIV($ =>
                      $.class('navbar-item has-dropdown is-hoverable')
                        .A($ => $.class('navbar-link').text('Projects'))
                        .DIV($ =>
                          $.class('navbar-dropdown').MapField('toc', $ =>
                            $.Append(
                              MatchAsyncResult<
                                Toc,
                                HttpError,
                                unknown,
                                Action,
                                unknown
                              >({
                                Failure: '',
                                Loading: '',
                                NotAsked: '',
                                Success: Iterate(
                                  s => s.projects,
                                  $ =>
                                    $.Append(
                                      link({
                                        label: ([s]) => s.title,
                                        route: ([s]) => Route.project(s.name),
                                        class: 'navbar-item'
                                      })
                                    )
                                )
                              })
                            )
                          )
                        )
                    )
                )
            )
        )
    )
    //
    .HoldState<
      Toc,
      {
        route: Route
        content: AsyncResult<Content, HttpError, unknown>
        toc: Toc
      }
    >(Release =>
      MapField('toc', $ =>
        $.Append(
          MatchAsyncResult({
            NotAsked: '',
            Loading: loader,
            Success: Release(
              (state, toc) => {
                return {
                  route: state.route,
                  content: state.content,
                  toc
                }
              },
              $ =>
                $.MAIN($ =>
                  $.class('container').DIV($ =>
                    $.class('columns is-mobile')
                      .DIV($ =>
                        $.class(
                          'column has-background-light side-control scrollable'
                        ).Append(sidebar)
                      )
                      .DIV($ =>
                        $.class('column scrollable main-column').MapState(
                          ({ content }) => content,
                          $ => $.Append(contentTemplate)
                        )
                      )
                  )
                )
            ),
            Failure: DIV($ => $.text(e => e.message))
          })
        )
      )
    )
)
