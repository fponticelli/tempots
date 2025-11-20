import type { Clear, Renderable, RenderContext } from '@tempots/core'
import { createRenderable } from '@tempots/core'
import type {
  Annotations,
  Axis,
  Crosshair,
  Tooltip,
  XYComponentCore,
  XYComponentConfigInterface,
} from '@unovis/ts'

export const UNOVIS_RENDERABLE_TYPE = Symbol('UNOVIS_RENDERABLE')

export type AttachmentRole =
  | 'xAxis'
  | 'yAxis'
  | 'tooltip'
  | 'crosshair'
  | 'annotations'

export type UnovisAttachment<Datum = unknown> =
  | { role: 'xAxis'; value: Axis<Datum> }
  | { role: 'yAxis'; value: Axis<Datum> }
  | { role: 'tooltip'; value: Tooltip }
  | { role: 'crosshair'; value: Crosshair<Datum> }
  | { role: 'annotations'; value: Annotations }

export type UnovisComponent<Datum = unknown> = XYComponentCore<
  Datum,
  Partial<XYComponentConfigInterface<Datum>>
>

export interface UnovisContext<Datum = unknown> extends RenderContext {
  addComponent(component: UnovisComponent<Datum>): Clear
  attach(attachment: UnovisAttachment<Datum>): Clear
  clear(removeTree: boolean): void
}

export type UnovisRenderable<Datum = unknown> = Renderable<
  UnovisContext<Datum>,
  typeof UNOVIS_RENDERABLE_TYPE
>

export const unovisRenderable = <Datum>(
  renderFn: (ctx: UnovisContext<Datum>) => Clear
): UnovisRenderable<Datum> =>
  createRenderable(UNOVIS_RENDERABLE_TYPE, renderFn) as UnovisRenderable<Datum>
