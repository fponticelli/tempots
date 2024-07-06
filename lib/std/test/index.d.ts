export {}

declare global {
  namespace jest {
    interface Matchers<R> {
      toColorEqual<T>(value: T, precision?: number): R
      toNearEqual(value: number): R
      toNearEqualArray(value: [number, number, number]): R
      toNearEqualArray(value: number[]): R
    }
  }
  namespace vitest {
    interface Matchers<R> {
      toColorEqual<T>(value: T, precision?: number): R
      toNearEqual(value: number): R
      toNearEqualArray(value: [number, number, number]): R
      toNearEqualArray(value: number[]): R
    }
  }
}
