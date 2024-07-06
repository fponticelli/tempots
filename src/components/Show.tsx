/** @jsxImportSource .. */
import { type Signal } from '../prop'
import { type JSX } from '../jsx'
import { OneOfImpl } from './OneOf'

export type Condition<T> =
  | Signal<T | null | undefined>
  | Signal<T | undefined>
  | Signal<T | null>
  | Signal<T>

export interface ShowProps<T> {
  when: Condition<T>
  otherwise?: () => JSX.DOMNode
  children?: (value: Signal<NonNullable<T>>) => JSX.DOMNode
}

export function Show<T> ({ when, children, otherwise }: ShowProps<T>) {
  return new OneOfImpl<{ then: NonNullable<T> } | { otherwise: false }>(
    when.map(v => (v != null ? { then: v } : { otherwise: false })),
    {
      then: (v: Signal<NonNullable<T>>) => ((children && children(v)) || <></>),
      otherwise: otherwise || (() => <></>)
    }
  );
}
