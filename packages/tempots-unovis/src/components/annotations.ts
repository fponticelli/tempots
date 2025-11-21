import type { Value } from '@tempots/core'
import type { AnnotationsConfigInterface } from '@unovis/ts'
import { Annotations } from '@unovis/ts'
import { attachmentRenderable } from '../factory'

export interface UVisAnnotationsOptions {
  config?: Value<Partial<AnnotationsConfigInterface>>
}

export const UVisAnnotations = <Datum = unknown>(
  options: UVisAnnotationsOptions = {}
) =>
  attachmentRenderable<Datum, AnnotationsConfigInterface, Annotations>(
    'annotations',
    cfg => new Annotations(cfg),
    options
  )
