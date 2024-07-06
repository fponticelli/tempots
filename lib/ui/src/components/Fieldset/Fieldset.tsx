import { JSX, Signal, Provider } from "@tempots/dom"
import { FieldLayout } from "../Field/field-layout"
import { Sx } from '../styling/Sx'
import { FIELDSET_DEFAULT_LAYOUT, FieldsetMark } from './fieldset-context'

export interface FieldsetProps {
  children?: JSX.DOMNode
  layout?: FieldLayout | Signal<FieldLayout>
  title?: JSX.DOMNode
}

export const Fieldset = ({ children, layout, title }: FieldsetProps) => {
  const payload = { layout: layout == null ? Signal.of(FIELDSET_DEFAULT_LAYOUT) : Signal.wrap(layout) }
  return (
    <fieldset>
      <Sx
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10 // TODO
        }}
      />
      {title && <legend>{title}</legend>}
      <Provider mark={FieldsetMark} value={payload}>{children}</Provider>
    </fieldset>
  )
}
