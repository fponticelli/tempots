import { Clear, TNode } from '../types/domain'
import { DOMContext } from '../dom/dom-context'
import { Signal } from '../std/signal'
import { Value } from '../std/value'
import { renderableOfTNode } from './element'

/**
 * Helper function to handle a value that could be either a Signal or a static value.
 * Delegates to the appropriate handler based on whether the value is a Signal.
 *
 * @param value - The value to check (could be Signal<T> or T)
 * @param onSignal - Handler function to call if value is a Signal
 * @param onStatic - Handler function to call if value is static
 * @returns The result from the appropriate handler
 * @internal
 */
export const handleValueOrSignal = <T, R>(
  value: Value<T>,
  onSignal: (signal: Signal<T>) => R,
  onStatic: (literal: T) => R
): R => {
  if (Signal.is(value)) {
    return onSignal(value as Signal<T>)
  } else {
    return onStatic(value as T)
  }
}

/**
 * Creates a reactive renderable that updates when a signal changes.
 * This helper consolidates the common pattern of:
 * - Creating a new context reference
 * - Setting up a signal listener that re-renders on changes
 * - Properly cleaning up the old render before creating a new one
 * - Disposing the signal listener and context on cleanup
 *
 * @param ctx - The parent DOM context
 * @param signal - The signal to watch for changes
 * @param render - Function that takes the signal value and returns content to render
 * @returns A Clear function that cleans up the reactive renderable
 * @internal
 */
export const createReactiveRenderable = <T>(
  ctx: DOMContext,
  signal: Signal<T>,
  render: (value: T) => TNode
): Clear => {
  const newCtx = ctx.makeRef()
  let clear: Clear = () => {}
  const disposeHandler = signal.on(value => {
    clear(true)
    clear = renderableOfTNode(render(value))(newCtx)
  })
  return (removeTree: boolean) => {
    clear(removeTree)
    disposeHandler()
    newCtx.clear(removeTree)
  }
}
