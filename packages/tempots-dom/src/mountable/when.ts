import { Child, Signal } from '..'
import { Ensure } from './ensure'

// TODO, rename to If?
export const When = (
  condition: Signal<boolean>,
  then: Child,
  otherwise?: Child
) => {
  return Ensure(
    condition.map(v => (v ? true : null)) as Signal<true | null>,
    () => then,
    otherwise != null ? () => otherwise : undefined
  )
}

export const Unless = (
  condition: Signal<boolean>,
  then: Child,
  otherwise?: Child
) => {
  return When(
    condition.map(v => !v),
    then,
    otherwise
  )
}
