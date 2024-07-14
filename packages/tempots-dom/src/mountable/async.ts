import { TNode } from '../types/domain'
import { Task } from './task'

export const Async = <T>(
  promise: Promise<T>,
  options:
    | {
        pending?: TNode
        then: (value: T) => TNode
        error?: (error: unknown) => TNode
      }
    | ((value: T) => TNode)
) => Task(() => promise, options)
