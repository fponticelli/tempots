import { Signal } from "@tempots/dom"
import { makeProviderMark } from "@tempots/dom/types/idom-context"
import { FieldLayout } from "../Field/field-layout"

export const FIELDSET_DEFAULT_LAYOUT: FieldLayout = 'horizontal'

export interface FieldsetProvider {
  layout: Signal<FieldLayout>
}

export const FieldsetMark = makeProviderMark<FieldsetProvider>()
