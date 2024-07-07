import {
  Child,
  DOMContext,
  OnMount,
  Signal,
  Value,
  html,
  oneof,
  Portal,
} from '@tempots/dom'
import {
  autoUpdate,
  computePosition,
  flip,
  offset as fuiOffset,
  shift,
} from '@floating-ui/dom'

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'

export interface PopOverProps {
  open: Value<boolean>
  content: () => Child
  placement?: Placement
  offset?: {
    mainAxis?: number
    crossAxis?: number
  }
}

export function PopOver({
  content,
  open,
  placement,
  offset: { mainAxis, crossAxis } = { mainAxis: 0, crossAxis: 0 },
}: PopOverProps) {
  return (ctx: DOMContext) => {
    const target = ctx.element
    const isOpen = Signal.wrap(open)

    return oneof.bool(isOpen, {
      true: () =>
        Portal(
          'body',
          html.div(
            OnMount((element: HTMLElement) => {
              const floatingEl = element
              floatingEl.style.position = 'absolute'
              return autoUpdate(target, floatingEl, () => {
                computePosition(target, floatingEl, {
                  placement,
                  strategy: 'absolute',
                  middleware: [
                    flip(),
                    fuiOffset({ mainAxis, crossAxis }),
                    shift(),
                    flip(),
                  ],
                }).then(({ x, y }) => {
                  floatingEl.style.top = `${y}px`
                  floatingEl.style.left = `${x}px`
                })
              })
            }),
            content()
          )
        ),
      false: () => null,
    })(ctx)
  }
}
