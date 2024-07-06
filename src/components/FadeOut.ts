import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { getComputedAnimatable, type Animatable, applyInterpolatedAnimatable } from './animatable'

export class FadeOutImpl implements Renderable {
  constructor (
    private readonly end: Animatable,
    private readonly duration: number,
    private readonly delay: number
  ) { }

  appendTo (ctx: DOMContext): Clear {
    const el = ctx.getElement()
    const { duration, end } = this

    return ctx.delayClear((removeTree, clear) => {
      const start = getComputedAnimatable(el, this.end)
      const startTime = Date.now() + this.delay
      function frame (): void {
        const now = Date.now()
        if (now < startTime) {
          requestAnimationFrame(frame)
          return
        }
        const progress = Math.min((now - startTime) / duration, 1)
        applyInterpolatedAnimatable(el, start, end, progress)
        if (progress < 1) {
          requestAnimationFrame(frame)
        } else {
          clear()
        }
      }
      requestAnimationFrame(frame)
    })
  }
}

export interface FadeOutProps extends Animatable {
  duration?: number
  delay?: number
}

export function FadeOut (props: FadeOutProps): Renderable {
  const { duration, delay, ...end } = props
  return new FadeOutImpl(end, duration ?? 200, delay ?? 0)
}
