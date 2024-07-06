import { type Signal } from '../prop'
import { RepeatImpl, type PositionProps } from './Repeat'
import { type JSX, makeRenderable } from '../jsx-runtime'
import { FragmentImpl } from './Fragment'
import { OnRemove } from './OnRemove'

export interface ForProps<T> {
  of: Signal<T[]>
  separator?: (value: Signal<PositionProps>) => JSX.DOMNode
  children?: (value: Signal<T>, pos: Signal<PositionProps>) => JSX.DOMNode
}

// <For of={values} separator={() => ", "}>{(value) => <span>{value}</span>}</For>
export function For<T> ({ of, children: render, separator }: ForProps<T>): JSX.DOMNode {
  const times = of.map(v => v.length)
  return new RepeatImpl(
    times,
    (pos: Signal<PositionProps>) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = of.combine(pos, (arr, { index }) => arr.at(index)!)
      return new FragmentImpl([
        makeRenderable(render?.(value as Signal<T>, pos)),
        OnRemove({ clear: value.clean })
      ])
    },
    separator
  )
}

export interface ForWithPositionProps<T> {
  of: Signal<T[]>
  separator?: (value: Signal<PositionProps>) => JSX.DOMNode
  children?: (data: Signal<{ value: T, pos: PositionProps }>) => JSX.DOMNode
}

export function ForWithPosition<T> ({ of, children: render, separator }: ForWithPositionProps<T>): JSX.DOMNode {
  const times = of.map(v => v.length)
  return new RepeatImpl(
    times,
    (pos: Signal<PositionProps>) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const value = of.combine(pos, (arr, { index }) => arr.at(index)!)
      return new FragmentImpl([
        makeRenderable(render?.(value.combine(pos, (v, p) => ({ value: v as T, pos: p })))),
        OnRemove({ clear: value.clean })
      ])
    },
    separator
  )
}
