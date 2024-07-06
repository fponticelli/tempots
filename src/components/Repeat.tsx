/** @jsxImportSource .. */
import { Prop, type Signal } from '../prop'
import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { Fragment } from './Fragment'
import { type JSX } from '../jsx'
import { makeRenderable } from '../jsx-runtime'
import { OneOf } from './OneOf'

export interface PositionProps {
  readonly first: boolean
  readonly last: boolean
  readonly index: number
}

export function makePosition (index: number, length: number): PositionProps {
  return {
    first: index === 0,
    last: index === length - 1,
    index
  }
}

export class RepeatImpl implements Renderable {
  constructor (
    private readonly times: Signal<number>,
    private readonly children: (pos: Signal<PositionProps>) => JSX.DOMNode,
    private readonly separator?: (sep: Signal<PositionProps>) => JSX.DOMNode
  ) { }

  readonly appendTo = (ctx: DOMContext): Clear => {
    if (this.separator == null) {
      return this.appendToWithoutSeparator(ctx)
    } else {
      return this.appendToWithSeparator(ctx, this.separator)
    }
  }

  readonly appendToWithoutSeparator = (ctx: DOMContext): Clear => {
    const newCtx = ctx.makeReference()
    const count = this.times.get()
    const clears = new Array<Clear>(count)
    const positions = new Array<Prop<PositionProps>>(count)
    for (let i = 0; i < count; i++) {
      positions[i] = new Prop(makePosition(i, count))
      clears[i] = makeRenderable(this.children(positions[i])).appendTo(newCtx)
    }
    const cancel = this.times.subscribe(
      (newCount) => {
        while (newCount < clears.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clears.pop()?.(true)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          positions.pop()?.clean()
        }
        for (let i = 0; i < positions.length; i++) {
          positions[i].set(makePosition(i, newCount))
        }
        for (let i = clears.length; i < newCount; i++) {
          positions[i] = new Prop(makePosition(i, count))
          clears[i] = makeRenderable(this.children(positions[i])).appendTo(newCtx)
        }
      }
    )

    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        clears.forEach(clear => { clear(removeTree) })
      })
    }
  }

  readonly appendToWithSeparator = (ctx: DOMContext, separator: (sep: Signal<PositionProps>) => JSX.DOMNode): Clear => {
    const newCtx = ctx.makeReference()
    const count = this.times.get()
    const separatorProps = new Array<Prop<PositionProps>>(Math.max(0, count - 1))
    const separatorClears = new Array<Clear>(Math.max(0, count - 1))
    const clears = new Array<Clear>(count)
    const positions = new Array<Prop<PositionProps>>(count)
    for (let i = 0; i < count; i++) {
      positions[i] = new Prop(makePosition(i, count))
      clears[i] = makeRenderable(this.children(positions[i])).appendTo(newCtx)
      if (i < count - 1) {
        separatorProps[i] = Prop.of({
          first: i === 0,
          last: i === count - 2,
          index: i
        })
        separatorClears[i] = makeRenderable(separator(separatorProps[i])).appendTo(newCtx)
      }
    }
    const cancel = this.times.subscribe(
      (newCount) => {
        while (newCount < clears.length) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          clears.pop()?.(true)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          positions.pop()?.clean()
          if (separatorClears.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            separatorClears.pop()?.(true)
          }
          if (separatorProps.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            separatorProps.pop()?.clean()
          }
        }
        for (let i = 0; i < positions.length; i++) {
          positions[i].set(makePosition(i, newCount))
        }
        for (let i = 0; i < separatorProps.length; i++) {
          separatorProps[i].set({
            first: i === 0,
            last: i === newCount - 2,
            index: i
          })
        }
        for (let i = clears.length; i < newCount; i++) {
          positions[i] = new Prop(makePosition(i, count))
          clears[i] = makeRenderable(this.children(positions[i])).appendTo(newCtx)
          if (i < newCount - 1) {
            separatorProps[i] = Prop.of({
              first: i === 0,
              last: i === newCount - 2,
              index: i
            })
            separatorClears[i] = makeRenderable(separator(separatorProps[i])).appendTo(newCtx)
          }
        }
      }
    )
    return (removeTree: boolean) => {
      newCtx.requestClear(removeTree, () => {
        cancel()
        clears.forEach(clear => { clear(removeTree) })
        separatorClears.forEach(clear => { clear(removeTree) })
        separatorProps.forEach(signal => { signal.clean() })
      })
    }
  }
}

export interface RepeatProps {
  times: Signal<number>
  children?: (pos: Signal<PositionProps>) => JSX.DOMNode
  separator?: (sep: Signal<PositionProps>) => JSX.DOMNode
}

export function Repeat (props: RepeatProps): Renderable {
  return new RepeatImpl(
    props.times,
    props.children ?? (() => Fragment({ children: [] })),
    props.separator
  )
}

export function conjuctions (other: JSX.DOMNode, lastConjunction?: JSX.DOMNode, firstConjunction?: JSX.DOMNode): (sep: Signal<PositionProps>) => JSX.DOMNode {
  return (sep: Signal<PositionProps>) => {
    return <OneOf
      match={sep.map(({ first, last }) => {
        if (last) {
          return { last: true }
        } else if (first) {
          return { first: true }
        } else {
          return { other: true }
        }
      })}
      first={() => firstConjunction ?? other}
      last={() => lastConjunction ?? other}
      other={() => other}
      />
  }
}
