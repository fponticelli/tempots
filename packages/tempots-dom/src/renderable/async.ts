import { TNode } from '../types/domain'
import { Task } from './task'

/**
 * Options for the `Async` component.
 * @typeParam T - The type of the value.
 * @public
 */
export type AsyncOptions<T> = {
  /**
   * The node to render while the promise is pending.
   */
  pending?: TNode
  /**
   * The node to render when the promise is resolved.
   *
   * @param value - The value returned by the promise.
   * @returns The node to render.
   */
  then: (value: T) => TNode
  /**
   * The node to render when the promise is rejected.
   *
   * @param error - The error returned by the promise.
   * @returns The node to render.
   */
  error?: (error: unknown) => TNode
}

/**
 * Creates a renderable asynchronous task that wraps a promise.
 *
 * @typeParam T - The type of the value returned by the promise.
 * @param promise - The promise to wrap.
 * @param options - The options for the asynchronous task.
 * @returns The renderable asynchronous task.
 * @public
 */
export const Async = <T>(
  promise: Promise<T>,
  options: AsyncOptions<T> | ((value: T) => TNode)
) => Task(() => promise, options)
