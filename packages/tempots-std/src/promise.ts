export function sleep(
  ms: number,
  { abortSignal }: { abortSignal?: AbortSignal } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms)
    if (abortSignal) {
      abortSignal.addEventListener('abort', () => {
        clearTimeout(timeout)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }
  })
}
