import type { Clear, Renderable, RenderContext } from '@tempots/core'
import { createRenderable } from '@tempots/core'
import type {
  Annotations,
  Axis,
  ComponentCore,
  Crosshair,
  Tooltip,
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

export type UnovisComponent<Data = unknown> = ComponentCore<Data>

export interface UnovisContext<Datum = unknown, Data = Datum[]>
  extends RenderContext {
  addComponent(component: UnovisComponent<Data>): Clear
  attach(attachment: UnovisAttachment<Datum>): Clear
  clear(removeTree: boolean): void
}

export type UnovisRenderable<Datum = unknown, Data = Datum[]> = Renderable<
  UnovisContext<Datum, Data>,
  typeof UNOVIS_RENDERABLE_TYPE
>

export const unovisRenderable = <Datum, Data = Datum[]>(
  renderFn: (ctx: UnovisContext<Datum, Data>) => Clear
): UnovisRenderable<Datum, Data> =>
  createRenderable(UNOVIS_RENDERABLE_TYPE, renderFn) as UnovisRenderable<
    Datum,
    Data
  >
