import { Signal } from "../prop"
import { RepeatImpl } from "./Repeat"
import { JSX, makeRenderable } from "../jsx-runtime"
import { FragmentImpl } from "./Fragment"
import { OnRemoveImpl } from "./OnRemove"

export interface ForProps<T> {
  of: Signal<T[]>
  children?: (value: Signal<T>, index: number) => JSX.DOMNode
}

// <For of={values}>{(value) => <span>{value}</span>}</For>
export function For<T>({ of, children: render }: ForProps<T>): JSX.DOMNode {
  const times = of.map(v => v.length)
  return new RepeatImpl(times, (index: number) => {
    const value = of.at(index)
    return new FragmentImpl([
      makeRenderable(render?.(value, index)),
      new OnRemoveImpl(value.clean)
    ])
  })
}
