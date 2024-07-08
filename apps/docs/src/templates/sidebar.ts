import { DIV, ASIDE, Lazy, Fragment } from 'tempo-dom/lib/html'
import { Action } from '../action'
import { Toc, ApiRef } from '../toc'
import { maybeLink } from './link'
import {
  Route,
  pageMatchesRoute,
  pageToRoute,
  projectChangelogMatchesRoute,
  apiMatchesRoute,
  isApiProjectRoute,
  sameRoute
} from '../route'
import { some, none } from 'tempo-std/lib/option'
import { keys } from 'tempo-std/lib/objects'
import { SectionRef, ProjectRef } from '../toc'
import { DOMTemplate } from 'tempo-dom/lib/template'

type Sidebar = { toc: Toc; route: Route }

let section: DOMTemplate<[string, SectionRef, Route], Action, unknown>
section = Lazy(() =>
  DIV<[string, SectionRef, Route], Action, unknown>($ =>
    $.When(
      ([title]) => !!title,
      $ => $.P($ => $.class('menu-label').text(([title]) => title))
    ).When(
      ([_, section]) =>
        section.pages.length > 0 || keys(section.sections).length > 0,
      $ =>
        $.UL($ =>
          $.Iterate(
            ([_, s]) => s.pages,
            $ =>
              $.LI($ =>
                $.Append(
                  maybeLink({
                    label: ([page]) => page.title,
                    route: ([page, [_1, _2, route]]) =>
                      pageMatchesRoute(page, route)
                        ? none
                        : some(pageToRoute(page))
                  })
                )
              )
          ).When(
            ([_, section]) => keys(section.sections).length > 0,
            $ =>
              $.LI($ =>
                $.Iterate(
                  ([_, section, route]) =>
                    keys(section.sections).map(sub => [
                      sub,
                      section.sections[sub],
                      route
                    ]),
                  $ =>
                    $.MapState(
                      ([_, section]) => section,
                      $ => $.Append(section)
                    )
                )
              )
          )
        )
    )
  )
)

const api = Fragment<
  [ApiRef, { apis: ApiRef[]; project: ProjectRef; route: Route }, number],
  Action,
  unknown
>($ =>
  $.Append(
    maybeLink({
      label: ([r]) => r.title,
      route: ([r, p]) =>
        apiMatchesRoute(p.project.name, r.path, p.route)
          ? none
          : some(Route.api(p.project.name, r.path))
    })
  )
)

const project = DIV<[ProjectRef, Sidebar, number], Action, unknown>($ =>
  $.P($ =>
    $.Append(
      maybeLink({
        label: ([s]) => `v.${s.version}`,
        route: ([p, s]) =>
          projectChangelogMatchesRoute(p, s.route)
            ? none
            : some(Route.changelog(p.name)),
        class: 'is-pulled-right is-size-7'
      })
    ).Append(
      maybeLink({
        label: ([p]) => p.title,
        route: ([p, s]) =>
          sameRoute(Route.project(p.name), s.route)
            ? none
            : some(Route.project(p.name)),
        class: 'is-uppercase has-text-weight-bold'
      })
    )
  ).DIV($ =>
    $.class('is-size-7')
      .text(([s]) => s.description)
      .When(
        ([p, s]) =>
          isApiProjectRoute(s.route, p.name) ||
          sameRoute(Route.project(p.name), s.route),
        $ =>
          $.DIV($ =>
            $.class('box api-box').MapState(
              ([project, sidebar]) => ({
                apis: sidebar.toc.apis[project.name],
                project,
                route: sidebar.route
              }),
              $ =>
                $.MapState(
                  state => ({
                    apis: state.apis,
                    project: state.project,
                    route: state.route
                  }),
                  $ =>
                    $.When(
                      state => state.apis.length > 0,
                      $ =>
                        $.UL($ =>
                          $.class('links-list').Iterate(
                            state => state.apis,
                            $ => $.LI($ => $.Append(api))
                          )
                        )
                    )
                )
            )
          )
      )
  )
)

export const sidebar = ASIDE<Sidebar, Action, unknown>($ =>
  $.class('menu')
    .MapState(
      sidebar =>
        ['', sidebar.toc as SectionRef, sidebar.route] as [
          string,
          SectionRef,
          Route
        ],
      $ => $.Append(section)
    )
    .HR($ => $.class('sidebar-separator'))
    .Iterate(
      s => s.toc.projects,
      $ => $.Append(project)
    )
)
