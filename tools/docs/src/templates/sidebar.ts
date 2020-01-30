import { div, ul, li, h3, aside, p, span } from 'tempo-dom/lib/html'
import { lazy } from 'tempo-dom/lib/lazy'
import { iterate } from 'tempo-dom/lib/iterate'
import { when } from 'tempo-dom/lib/when'
import { Action } from '../action'
import { Toc, PageRef, ApiRef } from '../toc'
import { maybeLink } from './link'
import {
  Route,
  pageMatchesRoute,
  pageToRoute,
  projectChangelogMatchesRoute,
  apiMatchesRoute,
  sameRoute
} from '../route'
import { some, none } from 'tempo-std/lib/option'
import { compareCaseInsensitive } from 'tempo-std/lib/strings'
import { keys } from 'tempo-std/lib/objects'
import { SectionRef, ProjectRef } from '../toc'
import { DOMTemplate } from 'tempo-dom/lib/template'
import { mapState } from 'tempo-dom/lib/map'
import { fragment } from 'tempo-dom/lib/fragment'

type Sidebar = { toc: Toc; route: Route }

let section: DOMTemplate<[string, SectionRef, Route], Action, unknown>
section = lazy(() =>
  div<[string, SectionRef, Route], Action>(
    {},
    p({ attrs: { class: 'menu-label' } }, ([title]) => title),
    when(
      {
        condition: ([_, section]) =>
          section.pages.length > 0 || keys(section.sections).length > 0
      },
      ul(
        { attrs: { class: 'menu-list' } },
        iterate<[string, SectionRef, Route], PageRef[], Action>(
          { getArray: ([_, s]) => s.pages },
          li(
            {},
            maybeLink(
              ([page]) => page.title,
              ([page, [_1, _2, route]]) =>
                pageMatchesRoute(page, route) ? none : some(pageToRoute(page))
            )
          )
        ),
        when(
          { condition: ([_, section]) => keys(section.sections).length > 0 },
          li(
            {},
            iterate<
              [string, SectionRef, Route],
              [string, SectionRef, Route][],
              Action
            >(
              {
                getArray: ([_, section, route]) =>
                  keys(section.sections).map(sub => [
                    sub,
                    section.sections[sub],
                    route
                  ])
              },
              mapState({ map: ([_, section]) => section }, section)
            )
          )
        )
      )
    )
  )
)

const api = fragment<
  [ApiRef, { apis: ApiRef[]; project: ProjectRef; route: Route }, number],
  Action
>(
  maybeLink(
    ([r]) => r.title,
    ([r, p]) =>
      apiMatchesRoute(p.project.name, r.path, p.route)
        ? none
        : some(Route.api(p.project.name, r.path))
  )
)

const project = div<[ProjectRef, Sidebar, number], Action>(
  {},
  div(
    { attrs: { class: '' } },
    span(
      { attrs: { class: 'is-pulled-right is-size-7 has-text-grey' } },
      ([s]) => s.version
    ),
    maybeLink(
      ([p]) => p.title,
      ([p, s]) =>
        apiMatchesRoute(p.name, 'index.html', s.route)
          ? none
          : some(Route.api(p.name, 'index.html')),
      'is-uppercase has-text-weight-bold'
    ),
    div({ attrs: { class: 'is-size-7' } }, ([s]) => s.description)
  ),
  h3(
    { attrs: { class: 'changelog' } },
    maybeLink('changelog', ([p, s]) =>
      projectChangelogMatchesRoute(p, s.route)
        ? none
        : some(Route.changelog(p.name))
    )
  ),
  div(
    {},
    mapState(
      {
        map: ([project, sidebar]) => ({
          apis: sidebar.toc.apis[project.name],
          project,
          route: sidebar.route
        })
      },
      mapState<
        { apis: ApiRef[]; project: ProjectRef; route: Route },
        { apis: ApiRef[]; project: ProjectRef; route: Route },
        Action
      >(
        {
          map: state => ({
            apis: state.apis
              .filter(a => a.type === 'module')
              .sort((a, b) => compareCaseInsensitive(a.title, b.title)),
            project: state.project,
            route: state.route
          })
        },
        when(
          { condition: state => state.apis.length > 0 },
          p({ attrs: { class: 'menu-label' } }, 'modules'),
          ul(
            { attrs: { class: 'menu-list' } },
            iterate<
              { apis: ApiRef[]; project: ProjectRef; route: Route },
              ApiRef[],
              Action
            >({ getArray: state => state.apis }, li({}, api))
          )
        )
      ),
      mapState<
        { apis: ApiRef[]; project: ProjectRef; route: Route },
        { apis: ApiRef[]; project: ProjectRef; route: Route },
        Action
      >(
        {
          map: state => ({
            apis: state.apis
              .filter(a => a.type !== 'module')
              .sort((a, b) => compareCaseInsensitive(a.title, b.title)),
            project: state.project,
            route: state.route
          })
        },
        when(
          { condition: state => state.apis.length > 0 },
          p({ attrs: { class: 'menu-label' } }, 'types'),
          ul(
            { attrs: { class: 'menu-list' } },
            iterate<
              { apis: ApiRef[]; project: ProjectRef; route: Route },
              ApiRef[],
              Action
            >({ getArray: state => state.apis }, li({}, api))
          )
        )
      )
    )
  )
)

export const sidebar = aside<Sidebar, Action>(
  { attrs: { class: 'menu' } },
  mapState(
    {
      map: sidebar =>
        ['Tempo', sidebar.toc as SectionRef, sidebar.route] as [
          string,
          SectionRef,
          Route
        ]
    },
    section
  ),
  p(
    { attrs: { class: 'menu-label' } },
    maybeLink('Demos', s =>
      sameRoute(Route.demos, s.route) ? none : some(Route.demos)
    )
  ),
  p({ attrs: { class: 'menu-label' } }, 'Projects'),
  iterate<Sidebar, ProjectRef[], Action>(
    { getArray: s => s.toc.projects },
    project
  )
)