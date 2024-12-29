/**
 * Delays the execution of a function by the given number of milliseconds.
 * @param fn - The function to delay.
 * @param ms - The number of milliseconds to delay the function.
 * @returns A function that, when called, will cancel the delay and prevent the original function from being executed.
 * @example
 * ```ts
 * // Delay a function for 1 second
 * const cancel = delayed(() => console.log('Hello!'), 1000);
 *
 * // Cancel the delayed execution if needed
 * cancel();
 * ```
 * @public
 */
export const delayed = (fn: () => void, ms: number) => {
  const clear = setTimeout(fn, ms)
  return () => clearTimeout(clear)
}

/**
 * Executes a function repeatedly at a fixed interval.
 * @param fn - The function to execute periodically.
 * @param ms - The number of milliseconds between each execution.
 * @returns A function that, when called, will cancel the interval and stop future executions.
 * @example
 * ```ts
 * // Execute a function every 2 seconds
 * const stop = interval(() => console.log('Tick'), 2000);
 *
 * // Stop the interval after some time
 * setTimeout(() => stop(), 10000);
 * ```
 * @public
 */
export const interval = (fn: () => void, ms: number) => {
  const clear = setInterval(fn, ms)
  return () => clearInterval(clear)
}

/**
 * Configuration options for throttle function.
 * @public
 */
export interface ThrottleOptions {
  /**
   * If true, suppresses the final call after the last trigger.
   * @default false
   */
  noTrailing?: boolean

  /**
   * If true, suppresses the immediate call on the first trigger.
   * @default false
   */
  noLeading?: boolean

  /**
   * Controls the throttle behavior:
   * - If true, schedules clearing instead of the callback
   * - If false, schedules the callback
   * - If undefined, applies normal throttle behavior
   */
  debounceMode?: boolean
}

/**
 * Options for cancelling a throttled function.
 * @public
 */
export interface CancelOptions {
  /**
   * If true, only prevents future scheduled executions.
   * If false, also prevents all future executions even after new calls.
   * @default false
   */
  upcomingOnly?: boolean
}

/**
 * Represents a throttled function with a cancel method.
 * @public
 */
export interface ThrottledFunction<T extends unknown[]> {
  (...args: T): void
  cancel: (options?: CancelOptions) => void
}

/**
 * Copyright (c) Ivan Nikolić http://ivannikolic.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Creates a throttled version of a function that limits how often the function can be called.
 *
 * @param delay - Milliseconds to wait before allowing the next call.
 * @param callback - The function to throttle.
 * @param options - Configuration options for the throttle behavior.
 * @returns A throttled version of the function with a cancel method.
 *
 * @example
 * ```ts
 * // Create a throttled function that executes at most once every second
 * const throttledScroll = throttle(1000, () => {
 *   console.log('Scroll event handled');
 * });
 *
 * // Attach to scroll event
 * window.addEventListener('scroll', throttledScroll);
 *
 * // Cancel throttle if needed
 * throttledScroll.cancel();
 * ```
 *
 * @remarks
 * Throttling is useful for rate-limiting event handlers, API calls, and other expensive operations.
 * Common delay values are 100-250ms for UI updates and 1000ms+ for API calls.
 * @public
 */
export const throttle = <FN extends (...args: unknown[]) => void>(
  delay: number,
  callback: FN,
  options: ThrottleOptions = {}
): ThrottledFunction<Parameters<FN>> => {
  const { noTrailing = false, noLeading = false, debounceMode } = options

  let timeoutID: ReturnType<typeof setTimeout> | undefined
  let cancelled = false
  let lastExec = 0

  /**
   * Clears any existing timeout if one exists
   */
  function clearExistingTimeout() {
    if (timeoutID) clearTimeout(timeoutID)
  }

  /**
   * Cancels the throttled function
   * @param opts - Options for cancellation behavior
   */
  function cancel(opts?: CancelOptions) {
    const { upcomingOnly = false } = opts || {}
    clearExistingTimeout()
    cancelled = !upcomingOnly
  }

  /**
   * The wrapper function that implements the throttling behavior
   */
  function wrapper(this: unknown, ...args: unknown[]) {
    if (cancelled) return

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const elapsed = Date.now() - lastExec

    /**
     * Executes the callback with the correct context and arguments
     */
    function exec() {
      lastExec = Date.now()
      callback.apply(self, args)
    }

    /**
     * Clears the timeout ID
     */
    function clear() {
      timeoutID = undefined
    }

    if (!noLeading && debounceMode && !timeoutID) {
      exec()
    }

    clearExistingTimeout()

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        lastExec = Date.now()
        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay)
        }
      } else {
        exec()
      }
    } else if (!noTrailing) {
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay
      )
    }
  }

  wrapper.cancel = cancel
  return wrapper
}

/**
 * Options for debouncing a function.
 * @public
 */
export type DebounceOptions = {
  /**
   * If true, the callback is executed immediately before the delay.
   * @default false
   */
  atBegin?: boolean
}

/**
 * Copyright (c) Ivan Nikolić http://ivannikolic.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param {number} delay -               A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Function} callback -          A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                        to `callback` when the debounced-function is executed.
 * @param {object} [options] -           An object to configure options.
 * @param {boolean} [options.atBegin] -  Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                        after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                        (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 *
 * @returns {Function} A new, debounced function.
 * @public
 */
export const debounce = <FN extends (...args: unknown[]) => void>(
  delay: number,
  callback: FN,
  { atBegin = false }: DebounceOptions = {}
): ThrottledFunction<Parameters<FN>> => {
  return throttle(delay, callback, { debounceMode: atBegin !== false })
}
