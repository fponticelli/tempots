import {
  attr,
  OnCtx,
  DOMContext,
  ForEach,
  html,
  makeProp,
  Prop,
  Signal,
  Value,
  Ensure,
  on,
} from '@tempots/dom'
import { UseLocation, LocationData, handleAnchorClick } from '@tempots/ui'
import { Styles } from '../styles'
import { navigateTo } from '../../utils/scroll-to'

const updateAnchors = (location: Prop<LocationData>, el: HTMLElement) => {
  const anchors = el.querySelectorAll('a')
  for (const anchor of anchors) {
    const href = anchor.getAttribute('href') ?? ''
    anchor.addEventListener(
      'click',
      handleAnchorClick(
        () => {
          navigateTo(location, href)
          return true
        },
        {
          ignoreUrlWithExtension: true,
          allowedExtensions: ['.html'],
          ignoreExternalUrl: true,
        }
      )
    )
  }
}

type TOCItem = {
  title: string
  href: string
  level: number
}

const mapLevel: Record<number, string> = {
  1: 'ml-0 font-bold text-md mb-1',
  2: 'ml-0 font-semibold text-sm border mt-2 mb-1 px-1 py-0.5 bg-gray-100 rounded',
  3: 'list-disc ml-4 text-sm',
  4: 'list-disc ml-6 text-sm',
  5: 'list-disc ml-8 text-sm',
  6: 'list-disc ml-10 text-sm',
}

const TOCView = (location: Prop<LocationData>, toc: Signal<TOCItem[]>) => {
  return Ensure(
    toc.map(v => (v.length > 3 ? v : null)),
    toc =>
      html.div(
        html.div(
          attr.class(
            'xl:sticky top-0 right-0 max-w-full border rounded-md bg-white xl:w-64 xl:max-h-[calc(100dvh-15rem)] xl:overflow-hidden'
          ),
          html.div(
            attr.class(
              'p-4 relative xl:max-h-[calc(100dvh-15rem)] xl:overflow-auto'
            ),
            html.div(
              attr.class('flex flex-col gap-2 overflow-hidden'),
              html.div(
                attr.class(
                  'text-gray-600 text-sm text-center rounded-md p-1 bg-gray-600 text-white'
                ),
                '▾ on this page ▾'
              ),
              html.div(
                attr.class('flex-1 columns-3xs xl:columns-1'),
                html.ul(
                  ForEach(toc, item => {
                    return html.li(
                      attr.class('text-gray-400'),
                      attr.class(
                        item.$.level.map(level => mapLevel[level] ?? 'ml-0')
                      ),
                      html.a(
                        on.click(
                          handleAnchorClick(() => {
                            navigateTo(location, item.$.href.value)
                            return true
                          })
                        ),
                        attr.class('hover:underline text-blue-900'),
                        attr.href(item.$.href),
                        item.$.title
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
}

const makeTOC = (el: HTMLElement): TOCItem[] => {
  const headers = el.querySelectorAll('h1, h2, h3, h4, h5, h6')
  if (headers.length > 0) {
    return Array.from(headers).map(header => {
      const level = parseInt(header.tagName[1])
      return {
        title: (header as HTMLElement).innerHTML ?? '',
        href: `#${header.id}`,
        level,
      }
    })
  }
  return []
}

export function EmbedHTMLPage(content: Value<string>) {
  const htmlSignal = Signal.wrap(content)
  const toc = makeProp<TOCItem[]>([])
  return UseLocation(location =>
    html.div(
      attr.class(
        'flex flex-col flex-col-reverse xl:flex-row gap-4 xl:justify-between'
      ),
      html.div(
        attr.class(Styles.prose),
        attr.innerHTML(htmlSignal),
        OnCtx((ctx: DOMContext) => {
          return htmlSignal.on(() => {
            updateAnchors(location, ctx.element as HTMLElement)
            toc.set(makeTOC(ctx.element as HTMLElement))
          })
        })
      ),
      TOCView(location, toc)
    )
  )
}
