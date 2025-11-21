import type { Renderable } from '@tempots/dom'
import { attr, html, on } from '@tempots/dom'

export const ChartTrigger = (
  label: string,
  buttonLabel: string,
  handler: () => void
): Renderable =>
  html.div(
    attr.class('controls'),
    html.div(
      attr.class('control'),
      html.span(label),
      html.button(on.click(handler), buttonLabel)
    )
  )
