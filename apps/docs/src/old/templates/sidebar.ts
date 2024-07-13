import { Toc } from '../toc'
import { Route } from '../route'
import { SectionRef, ProjectRef } from '../toc'
import { attr, computed, ForEach, html, Renderable, Signal } from '@tempots/dom'

type Sidebar = { toc: Toc; route: Route }

const section = (data: Signal<[string, SectionRef, Route]>): Renderable =>
  html.div(
    'section: ',
    data.map(([title]) => title)
  )
// DOMTemplate<[string, SectionRef, Route], Action, unknown>
// section = Lazy(() =>
//   DIV<[string, SectionRef, Route], Action, unknown>($ =>
//     $.When(
//       ([title]) => !!title,
//       $ => $.P($ => $.class('menu-label').text(([title]) => title))
//     ).When(
//       ([_, section]) =>
//         section.pages.length > 0 || keys(section.sections).length > 0,
//       $ =>
//         $.UL($ =>
//           $.Iterate(
//             ([_, s]) => s.pages,
//             $ =>
//               $.LI($ =>
//                 $.Append(
//                   maybeLink({
//                     label: ([page]) => page.title,
//                     route: ([page, [_1, _2, route]]) =>
//                       pageMatchesRoute(page, route)
//                         ? none
//                         : some(pageToRoute(page)),
//                   })
//                 )
//               )
//           ).When(
//             ([_, section]) => keys(section.sections).length > 0,
//             $ =>
//               $.LI($ =>
//                 $.Iterate(
//                   ([_, section, route]) =>
//                     keys(section.sections).map(sub => [
//                       sub,
//                       section.sections[sub],
//                       route,
//                     ]),
//                   $ =>
//                     $.MapState(
//                       ([_, section]) => section,
//                       $ => $.Append(section)
//                     )
//                 )
//               )
//           )
//         )
//     )
//   )
// )

// const api = (
//   data: Signal<
//     [ApiRef, { apis: ApiRef[]; project: ProjectRef; route: Route }, number]
//   >
// ) =>
//   maybeLink(
//     data.map(([r, p]) =>
//       apiMatchesRoute(p.project.name, r.path, p.route)
//         ? Maybe.nothing
//         : Maybe.just(Route.api(p.project.name, r.path))
//     ),
//     data.map(([r]) => r.title)
//   )

const project = (data: Signal<[ProjectRef, Sidebar]>): Renderable =>
  html.div(
    'project: ',
    data.map(([p]) => p.title)
  )
// DIV<[ProjectRef, Sidebar, number], Action, unknown>($ =>
//   $.P($ =>
//     $.Append(
//       maybeLink({
//         label: ([s]) => `v.${s.version}`,
//         route: ([p, s]) =>
//           projectChangelogMatchesRoute(p, s.route)
//             ? none
//             : some(Route.changelog(p.name)),
//         class: 'is-pulled-right is-size-7',
//       })
//     ).Append(
//       maybeLink({
//         label: ([p]) => p.title,
//         route: ([p, s]) =>
//           sameRoute(Route.project(p.name), s.route)
//             ? none
//             : some(Route.project(p.name)),
//         class: 'is-uppercase has-text-weight-bold',
//       })
//     )
//   ).DIV($ =>
//     $.class('is-size-7')
//       .text(([s]) => s.description)
//       .When(
//         ([p, s]) =>
//           isApiProjectRoute(s.route, p.name) ||
//           sameRoute(Route.project(p.name), s.route),
//         $ =>
//           $.DIV($ =>
//             $.class('box api-box').MapState(
//               ([project, sidebar]) => ({
//                 apis: sidebar.toc.apis[project.name],
//                 project,
//                 route: sidebar.route,
//               }),
//               $ =>
//                 $.MapState(
//                   state => ({
//                     apis: state.apis,
//                     project: state.project,
//                     route: state.route,
//                   }),
//                   $ =>
//                     $.When(
//                       state => state.apis.length > 0,
//                       $ =>
//                         $.UL($ =>
//                           $.class('links-list').Iterate(
//                             state => state.apis,
//                             $ => $.LI($ => $.Append(api))
//                           )
//                         )
//                     )
//                 )
//             )
//           )
//       )
//   )
// )

export const sidebar = (data: Signal<Sidebar>) =>
  html.aside(
    attr.class('menu'),
    section(data.map(s => ['', s.toc as SectionRef, s.route])),
    html.hr(attr.class('sidebar-separator')),
    ForEach(
      data.map(s => s.toc.projects),
      p => project(computed(() => [p.value, data.value], [p, data]))
    )
  )
// ASIDE<Sidebar, Action, unknown>($ =>
//   $.class('menu')
//     .MapState(
//       sidebar =>
//         ['', sidebar.toc as SectionRef, sidebar.route] as [
//           string,
//           SectionRef,
//           Route,
//         ],
//       $ => $.Append(section)
//     )
//     .HR($ => $.class('sidebar-separator'))
//     .Iterate(
//       s => s.toc.projects,
//       $ => $.Append(project)
//     )
// )
