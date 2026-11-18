/**
 * Sleep for a given number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @param options - The options for the sleep function.
 * @returns A promise that resolves after the given number of milliseconds.
 * Rejects with an AbortError if the signal is aborted.
 * @public
 */
export const sleep = (
  ms: number,
  { abortSignal }: { abortSignal?: AbortSignal } = {}
): Promise<void> =>
  new Promise((resolve, reject) => {
    if (abortSignal === undefined) {
      setTimeout(resolve, ms)
      return
    }

    const rejectAbort = () => reject(new DOMException('Aborted', 'AbortError'))
    if (abortSignal.aborted) {
      rejectAbort()
      return
    }

    const timeout = setTimeout(() => {
      abortSignal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timeout)
      abortSignal.removeEventListener('abort', onAbort)
      rejectAbort()
    }
    abortSignal.addEventListener('abort', onAbort)
  })
