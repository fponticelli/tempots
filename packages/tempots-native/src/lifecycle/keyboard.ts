import { prop, Signal } from '@tempots/core'
import type { JSIBridge } from '../bridge/jsi-bridge'

/**
 * Keyboard visibility state.
 * @public
 */
export interface KeyboardState {
  readonly visible: boolean
  readonly height: number
}

/**
 * Creates a signal that tracks keyboard visibility and height.
 *
 * @param bridge - The JSI bridge
 * @returns A signal of the keyboard state
 * @public
 */
export function createKeyboardSignal(bridge: JSIBridge): Signal<KeyboardState> {
  const keyboard = prop<KeyboardState>({ visible: false, height: 0 })

  bridge.addEventListener(0, 'keyboardShow', (e: unknown) => {
    const data = e as { height: number }
    keyboard.set({ visible: true, height: data.height })
  })

  bridge.addEventListener(0, 'keyboardHide', () => {
    keyboard.set({ visible: false, height: 0 })
  })

  return keyboard
}
