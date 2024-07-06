import { type Clear } from '../clean'
import { type DOMContext } from '../dom-context'
import { type Renderable } from '../renderable'
import { getComputedAnimatable, type Animatable, applyInterpolatedAnimatable, applyAnimatable } from './animatable'

export class FadeInImpl implements Renderable {
  constructor (
    private readonly end: Animatable,
    private readonly start: Animatable | undefined,
    private readonly easing: (t: number) => number,
    private readonly duration: number,
    private readonly delay: number
  ) { }

  appendTo (ctx: DOMContext): Clear {
    const el = ctx.getElement()
    const start = (() => {
      if (this.start != null) {
        applyAnimatable(el, this.start)
        return this.start
      } else {
        return getComputedAnimatable(el, this.end)
      }
    })()
    const startTime = Date.now() + this.delay
    const { duration, end, easing } = this
    let nextFrameId: null | number = null
    function frame (): void {
      const now = Date.now()
      if (now < startTime) {
        nextFrameId = requestAnimationFrame(frame)
        return
      }

      const progress = Math.min((now - startTime) / duration, 1)
      applyInterpolatedAnimatable(el, start, end, easing(progress))
      if (progress < 1) {
        nextFrameId = requestAnimationFrame(frame)
      } else {
        nextFrameId = null
      }
    }
    frame()

    return (_: boolean) => {
      if (nextFrameId != null) cancelAnimationFrame(nextFrameId)
    }
  }
}

export interface FadeInProps extends Animatable {
  start?: Animatable
  duration?: number
  easing?: (t: number) => number
  delay?: number
}

export function FadeIn (props: FadeInProps): Renderable {
  const { start, duration, easing, delay, ...end } = props
  return new FadeInImpl(end, start, easing ?? (v => v), duration ?? 200, delay ?? 0)
}
