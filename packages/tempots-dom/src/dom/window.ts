export const getWindow = (): Window | undefined =>
  typeof window !== 'undefined' ? window : undefined
