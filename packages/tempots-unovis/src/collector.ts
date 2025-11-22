import type { Clear } from '@tempots/core'
import type { Annotations, Axis, Crosshair, Tooltip } from '@unovis/ts'
import type {
  AttachmentRole,
  UnovisAttachment,
  UnovisComponent,
  UnovisContext,
} from './types'

type AttachmentMap<Datum> = Partial<{
  xAxis: Axis<Datum>
  yAxis: Axis<Datum>
  tooltip: Tooltip
  crosshair: Crosshair<Datum>
  annotations: Annotations
}>

type Cleanup = () => void
type ChangeListener<Datum, Data> = (data: {
  components: UnovisComponent<Data>[]
  attachments: AttachmentMap<Datum>
}) => void

export interface UnovisCollected<Datum = unknown, Data = Datum[]> {
  components: UnovisComponent<Data>[]
  attachments: AttachmentMap<Datum>
  dispose(removeTree: boolean): void
}

class UnovisCollector<Datum = unknown, Data = Datum[]>
  implements UnovisContext<Datum, Data>
{
  private readonly componentsList: UnovisCollected<Datum, Data>['components'] =
    []
  private readonly attachments: AttachmentMap<Datum> = {}
  private readonly componentCleanups: Cleanup[] = []
  private readonly attachmentCleanups: Partial<
    Record<AttachmentRole, Cleanup>
  > = {}
  private onChange: ChangeListener<Datum, Data> | null = null

  setChangeListener(listener: ChangeListener<Datum, Data>): void {
    this.onChange = listener
  }

  private notifyChange(): void {
    this.onChange?.({
      components: this.componentsList,
      attachments: this.attachments,
    })
  }

  addComponent(component: UnovisComponent<Data>): Clear {
    this.componentsList.push(component)
    this.notifyChange()

    let destroyed = false

    const cleanup: Clear = (removeTree: boolean) => {
      const index = this.componentsList.indexOf(component)
      if (index >= 0) {
        this.componentsList.splice(index, 1)
      }
      this.notifyChange()
      if (removeTree && !destroyed) {
        destroyed = true
        component.destroy()
      }
    }

    this.componentCleanups.push(() => cleanup(true))

    return cleanup
  }

  attach(attachment: UnovisAttachment<Datum>): Clear {
    const previousCleanup = this.attachmentCleanups[attachment.role]
    previousCleanup?.()

    this.attachments[attachment.role] = attachment.value as never
    this.notifyChange()

    let destroyed = false
    const cleanup: Clear = (removeTree: boolean) => {
      if (removeTree) {
        if (!destroyed) {
          destroyed = true
          const destroy = (
            attachment.value as unknown as { destroy?: () => void }
          ).destroy
          destroy?.()
        }
        delete this.attachments[attachment.role]
        this.notifyChange()
      }
    }

    this.attachmentCleanups[attachment.role] = () => cleanup(true)

    return cleanup
  }

  clear(): void {
    // No-op: collector itself does not render into a host context.
  }

  finish(): UnovisCollected<Datum, Data> {
    const components = this.componentsList
    const attachments = this.attachments
    const dispose = (removeTree: boolean) => {
      if (!removeTree) return
      for (const cleanup of this.componentCleanups) {
        cleanup()
      }
      Object.values(this.attachmentCleanups).forEach(cleanup => cleanup?.())
    }

    return { components, attachments, dispose }
  }
}

export const createUnovisCollector = <Datum = unknown, Data = Datum[]>() => {
  const collector = new UnovisCollector<Datum, Data>()
  return {
    ctx: collector as UnovisContext<Datum, Data>,
    finish: () => collector.finish(),
    setChangeListener: (listener: ChangeListener<Datum, Data>) =>
      collector.setChangeListener(listener),
  }
}
