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

export interface UnovisCollected<Datum = unknown> {
  components: UnovisComponent<Datum>[]
  attachments: AttachmentMap<Datum>
  dispose(removeTree: boolean): void
}

class UnovisCollector<Datum = unknown> implements UnovisContext<Datum> {
  private readonly componentsList: UnovisCollected<Datum>['components'] = []
  private readonly attachments: AttachmentMap<Datum> = {}
  private readonly componentCleanups: Cleanup[] = []
  private readonly attachmentCleanups: Partial<
    Record<AttachmentRole, Cleanup>
  > = {}

  addComponent(component: UnovisComponent<Datum>): Clear {
    this.componentsList.push(component)

    const cleanup: Clear = (removeTree: boolean) => {
      if (removeTree) {
        const destroy = (component as unknown as { destroy?: () => void })
          .destroy
        destroy?.()
      }
    }

    this.componentCleanups.push(() => cleanup(true))

    return cleanup
  }

  attach(attachment: UnovisAttachment<Datum>): Clear {
    const previousCleanup = this.attachmentCleanups[attachment.role]
    previousCleanup?.()

    this.attachments[attachment.role] = attachment.value as never

    const cleanup: Clear = (removeTree: boolean) => {
      if (removeTree) {
        const destroy = (
          attachment.value as unknown as { destroy?: () => void }
        ).destroy
        destroy?.()
      }
    }

    this.attachmentCleanups[attachment.role] = () => cleanup(true)

    return cleanup
  }

  clear(): void {
    // No-op: collector itself does not render into a host context.
  }

  finish(): UnovisCollected<Datum> {
    const components = [...this.componentsList]
    const attachments = { ...this.attachments }
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

export const createUnovisCollector = <Datum = unknown>() => {
  const collector = new UnovisCollector<Datum>()
  return {
    ctx: collector as UnovisContext<Datum>,
    finish: () => collector.finish(),
  }
}
