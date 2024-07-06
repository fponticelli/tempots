/** @jsxImportSource .. */
import { type Signal } from '../prop'
import { If } from './If'
import { type JSX } from '../jsx-runtime'

export interface NotEmptyProps<T> {
  on: Signal<T>
  whenEmpty?: () => JSX.DOMNode
  display: () => JSX.DOMNode
}

function isEmpty (obj: Record<any, unknown>): boolean {
  return Object.keys(obj).length === 0
}

// <NotEmpty on={maybevalue} whenEmpty={<span>nothing to show</span>}}>{value => value.toText()}</NotEmpty>
export function NotEmpty<T extends unknown[] | Record<any, unknown>> ({
  on,
  display,
  whenEmpty
}: NotEmptyProps<T>): JSX.DOMNode {
  return (
    <If
      is={on.map((v: T) =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Array.isArray(v) ? v.length > 0 : v != null && !isEmpty(v as any)
      )}
      then={display}
      otherwise={whenEmpty}
    />
  )
}
