import { aria, attr, html, svg, svgAttr } from '@tempots/dom'
import { Logo } from '../element/logo'

/*
Pages
- page
 - subpage

Libraries
- @tempots/dom
- @tempots/std
- @tempots/colors
- @tempots/ui

Tools
- html-to-tempo

Demos
- hnpwa
- todo
- counter
- 7gui

*/

export function SideBar() {
  return html.div(
    attr.class(
      'flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r'
    ),
    html.div(
      attr.class('flex h-20 shrink-0 items-center justify-center'),
      html.div(
        attr.class('flex flex-row gap-2'),
        Logo(),
        html.div(
          attr.class('flex flex-col leading-4'),
          html.div(attr.class('text-xl font-semibold'), 'Tempo'),
          html.div(
            attr.class('text font-semibold text-gray-600'),
            'The UI Framework'
          )
        )
      )
    ),
    html.nav(
      attr.class('flex flex-1 flex-col'),
      html.ul(
        attr.role('list'),
        attr.class('flex flex-1 flex-col gap-y-7'),
        html.li(
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 space-y-1'),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md bg-gray-50 p-2 text-sm font-semibold leading-6 text-indigo-600'
                ),
                svg.svg(
                  attr.class('h-6 w-6 shrink-0 text-indigo-600'),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d(
                      'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25'
                    )
                  )
                ),
                `Dashboard`
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                svg.svg(
                  attr.class(
                    'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                  ),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d(
                      'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z'
                    )
                  )
                ),
                `Team`
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                svg.svg(
                  attr.class(
                    'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                  ),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d(
                      'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z'
                    )
                  )
                ),
                `
                                      Projects
                                    `
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                svg.svg(
                  attr.class(
                    'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                  ),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d(
                      'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                    )
                  )
                ),
                `Calendar`
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                svg.svg(
                  attr.class(
                    'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                  ),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d(
                      'M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75'
                    )
                  )
                ),
                `Documents`
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                svg.svg(
                  attr.class(
                    'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
                  ),
                  svgAttr.fill('none'),
                  svgAttr.viewBox('0 0 24 24'),
                  svgAttr.strokeWidth(1.5),
                  svgAttr.stroke('currentColor'),
                  aria.hidden(true),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d('M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z')
                  ),
                  svg.path(
                    svgAttr.strokeLinecap('round'),
                    svgAttr.strokeLinejoin('round'),
                    svgAttr.d('M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z')
                  )
                ),
                `Reports`
              )
            )
          )
        ),
        html.li(
          html.div(
            attr.class('text-xs font-semibold leading-6 text-gray-400'),
            'Your teams'
          ),
          html.ul(
            attr.role('list'),
            attr.class('-mx-2 mt-2 space-y-1'),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                html.span(
                  attr.class(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'
                  ),
                  'H'
                ),
                html.span(attr.class('truncate'), 'Heroicons')
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                html.span(
                  attr.class(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'
                  ),
                  'T'
                ),
                html.span(attr.class('truncate'), 'Tailwind Labs')
              )
            ),
            html.li(
              html.a(
                attr.href('#'),
                attr.class(
                  'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                ),
                html.span(
                  attr.class(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[0.625rem] font-medium text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-600'
                  ),
                  'W'
                ),
                html.span(attr.class('truncate'), 'Workcation')
              )
            )
          )
        ),
        html.li(
          attr.class('mt-auto'),
          html.a(
            attr.href('#'),
            attr.class(
              'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
            ),
            svg.svg(
              attr.class(
                'h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600'
              ),
              svgAttr.fill('none'),
              svgAttr.viewBox('0 0 24 24'),
              svgAttr.strokeWidth(1.5),
              svgAttr.stroke('currentColor'),
              aria.hidden(true),
              svg.path(
                svgAttr.strokeLinecap('round'),
                svgAttr.strokeLinejoin('round'),
                svgAttr.d(
                  'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z'
                )
              ),
              svg.path(
                svgAttr.strokeLinecap('round'),
                svgAttr.strokeLinejoin('round'),
                svgAttr.d('M15 12a3 3 0 11-6 0 3 3 0 016 0z')
              )
            ),
            `Settings`
          )
        )
      )
    )
  )
}
