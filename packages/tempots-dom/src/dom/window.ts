export const getWindow = (): Window | undefined =>
  /* c8 ignore next */
  typeof window !== 'undefined' ? window : undefined
