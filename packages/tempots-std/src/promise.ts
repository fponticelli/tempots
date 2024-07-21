/**
 * Sleep for a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @param options - The options for the sleep function.
 * @returns A promise that resolves after the given number of milliseconds.
 * @public
 */
export const sleep = (
  ms: number,
  { abortSignal }: { abortSignal?: AbortSignal } = {}
): Promise<void> =>
  new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timeout)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }
  })
