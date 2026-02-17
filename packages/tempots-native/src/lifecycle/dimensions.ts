import { prop, Signal } from '@tempots/core'
import type { JSIBridge } from '../bridge/jsi-bridge'

/**
 * Screen dimensions.
 * @public
 */
export interface ScreenDimensions {
  readonly width: number
  readonly height: number
  readonly scale: number
  readonly fontScale: number
}

/**
 * Creates a signal that tracks screen dimensions.
 *
 * The signal emits updated dimensions whenever the screen size changes
 * (e.g., on rotation or split-screen changes).
 *
 * @param bridge - The JSI bridge
 * @param initial - Initial dimensions
 * @returns A signal of the screen dimensions
 * @public
 */
export function createDimensionsSignal(
  bridge: JSIBridge,
  initial: ScreenDimensions = {
    width: 375,
    height: 812,
    scale: 3,
    fontScale: 1,
  }
): Signal<ScreenDimensions> {
  const dimensions = prop(initial)

  bridge.addEventListener(0, 'dimensionsChange', (e: unknown) => {
    const newDims = e as ScreenDimensions
    dimensions.set(newDims)
  })

  return dimensions
}
