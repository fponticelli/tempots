import type { TNode } from '@tempots/core'
import type { NativeRenderable } from '../types/domain'
import { nativeRenderable, NATIVE_RENDERABLE_TYPE } from '../types/domain'
import type { NativeContext } from '../context/native-context'
import type { PressEvent } from '../types/event-types'
import { renderableOfTNode } from './shared'

/**
 * Options for the Pressable component.
 * @public
 */
export interface PressableOptions {
  /** Opacity when the view is pressed. Defaults to 0.7. */
  activeOpacity?: number
  /** Whether the pressable is disabled. Defaults to false. */
  disabled?: boolean
}

/**
 * A pressable view with opacity feedback on press.
 *
 * Creates a View, attaches press/pressIn/pressOut listeners,
 * and renders children into it.
 *
 * @param onPress - Handler called when the view is pressed
 * @param options - Pressable options
 * @param children - Child renderables
 * @returns A NativeRenderable
 * @public
 */
export function Pressable(
  onPress: (e: PressEvent) => void,
  options: PressableOptions,
  ...children: TNode<NativeContext, typeof NATIVE_RENDERABLE_TYPE>[]
): NativeRenderable {
  const activeOpacity = options.activeOpacity ?? 0.7
  const disabled = options.disabled ?? false

  return nativeRenderable((ctx: NativeContext) => {
    const newCtx = ctx.makeChildView('View')

    const clears = children.map(child =>
      renderableOfTNode(child).render(newCtx)
    )

    let pressCleanup: (() => void) | undefined
    let pressInCleanup: (() => void) | undefined
    let pressOutCleanup: (() => void) | undefined

    if (!disabled) {
      pressCleanup = newCtx.on<PressEvent>('press', onPress)
      pressInCleanup = newCtx.on('pressIn', () => {
        newCtx.setStyle({ opacity: activeOpacity })
      })
      pressOutCleanup = newCtx.on('pressOut', () => {
        newCtx.setStyle({ opacity: 1 })
      })
    }

    return (removeTree: boolean) => {
      pressCleanup?.()
      pressInCleanup?.()
      pressOutCleanup?.()
      clears.forEach(clear => clear(false))
      newCtx.clear(removeTree)
    }
  })
}
