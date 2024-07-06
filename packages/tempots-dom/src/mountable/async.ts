import { Child } from '..'
import { Task } from './task'

export const Async = <T>(
  promise: Promise<T>,
  options:
    | {
        pending?: Child
        then: (value: T) => Child
        error?: (error: unknown) => Child
      }
    | ((value: T) => Child)
) => Task(() => promise, options)
