/** @jsxImportSource .. */
import { Renderable } from "../types/renderable"
import { Clear } from "../types/clean"
import { IDOMContext } from "../types/idom-context"

export interface Animatable {
  width?: number
  maxWidth?: number
  minWidth?: number
  height?: number
  maxHeight?: number
  minHeight?: number
  lineHeight?: number
  opacity?: number
  top?: number
  left?: number
  right?: number
  bottom?: number
  padding?: number
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  fontSize?: number
  letterSpacing?: number
  // color?: string
  // backgroundColor?: string
  // borderColor?: string
  borderWidth?: number
  borderRadius?: number
  // boxShadow?: string
  // textShadow?: string
  translateX?: number
  translateY?: number
  translateZ?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  scaleX?: number
  scaleY?: number
  scaleZ?: number
  skewX?: number
  skewY?: number
  grayScale?: number
  sepia?: number
  saturate?: number
  hueRotate?: number
  invert?: number
  brightness?: number
  contrast?: number
  blur?: number
}

export interface TweenAnimation {
  style: Animatable
  duration?: number
  delay?: number
  // easing?: string
  // repeat?: number | boolean
  // yoyo?: boolean
}

export interface TweenProps {
  enter?: TweenAnimation[]
  exit?: TweenAnimation[]
  style?: Animatable
}

export function getComputedStyleValue(styles: CSSStyleDeclaration, key: keyof Animatable): Animatable[typeof key] {
  if (key === 'translateX') {
    return new WebKitCSSMatrix(styles.transform).m41
  } else if (key === 'translateY') {
    return new WebKitCSSMatrix(styles.transform).m42
  } else if (key === 'translateZ') {
    return new WebKitCSSMatrix(styles.transform).m43
  } else if (key === 'rotateX') {
    return new WebKitCSSMatrix(styles.transform).m12
  } else if (key === 'rotateY') {
    return new WebKitCSSMatrix(styles.transform).m21
  } else if (key === 'rotateZ') {
    return new WebKitCSSMatrix(styles.transform).m31
  } else if (key === 'scaleX') {
    return new WebKitCSSMatrix(styles.transform).m11
  } else if (key === 'scaleY') {
    return new WebKitCSSMatrix(styles.transform).m22
  } else if (key === 'scaleZ') {
    return new WebKitCSSMatrix(styles.transform).m33
  } else if (key === 'skewX') {
    return new WebKitCSSMatrix(styles.transform).m13
  } else if (key === 'skewY') {
    return new WebKitCSSMatrix(styles.transform).m23
  } else if (key === 'grayScale') {
    return Number(styles.filter.match(/grayscale\((\d+)%\)/)?.[1])
  } else if (key === 'sepia') {
    return Number(styles.filter.match(/sepia\((\d+)%\)/)?.[1])
  } else if (key === 'saturate') {
    return Number(styles.filter.match(/saturate\((\d+)%\)/)?.[1])
  } else if (key === 'hueRotate') {
    return Number(styles.filter.match(/hue-rotate\((\d+)deg\)/)?.[1])
  } else if (key === 'invert') {
    return Number(styles.filter.match(/invert\((\d+)%\)/)?.[1])
  } else if (key === 'brightness') {
    return Number(styles.filter.match(/brightness\((\d+)%\)/)?.[1])
  } else if (key === 'contrast') {
    return Number(styles.filter.match(/contrast\((\d+)%\)/)?.[1])
  } else if (key === 'blur') {
    return Number(styles.filter.match(/blur\((\d+)px\)/)?.[1])
  }
  return Number(styles.getPropertyValue(key))
}

export function getCurrentStyleValues(el: HTMLElement, styles: Animatable) {
  const result: Animatable = {}
  const computedStyles = getComputedStyle(el)
  for (const [key, value] of Object.entries(styles)) {
    const k = key as keyof Animatable
    if (value != null) {
      result[k] = getComputedStyleValue(computedStyles, k)
    }
  }
  return result
}

export function applyStyle(el: HTMLElement, key: keyof Animatable, value: Animatable[typeof key]) {
  if (value == null) return

  if (key === 'translateX') {
    el.style.transform += ` translateX(${value}px)`
  } else if (key === 'translateY') {
    el.style.transform += ` translateY(${value}px)`
  } else if (key === 'translateZ') {
    el.style.transform += ` translateZ(${value}px)`
  } else if (key === 'rotateX') {
    el.style.transform += ` rotateX(${value}deg)`
  } else if (key === 'rotateY') {
    el.style.transform += ` rotateY(${value}deg)`
  } else if (key === 'rotateZ') {
    el.style.transform += ` rotateZ(${value}deg)`
  } else if (key === 'scaleX') {
    el.style.transform += ` scaleX(${value})`
  } else if (key === 'scaleY') {
    el.style.transform += ` scaleY(${value})`
  } else if (key === 'scaleZ') {
    el.style.transform += ` scaleZ(${value})`
  } else if (key === 'skewX') {
    el.style.transform += ` skewX(${value}deg)`
  } else if (key === 'skewY') {
    el.style.transform += ` skewY(${value}deg)`
  } else if (key === 'grayScale') {
    el.style.filter += ` grayscale(${value}%)`
  } else if (key === 'sepia') {
    el.style.filter += ` sepia(${value}%)`
  } else if (key === 'saturate') {
    el.style.filter += ` saturate(${value}%)`
  } else if (key === 'hueRotate') {
    el.style.filter += ` hue-rotate(${value}deg)`
  } else if (key === 'invert') {
    el.style.filter += ` invert(${value}%)`
  } else if (key === 'brightness') {
    el.style.filter += ` brightness(${value}%)`
  } else if (key === 'contrast') {
    el.style.filter += ` contrast(${value}%)`
  } else if (key === 'blur') {
    el.style.filter += ` blur(${value}px)`
  }
  el.style.setProperty(key, String(value))
}

export function applyInterpolatedStyle(el: HTMLElement, key: keyof Animatable, from: Animatable[typeof key], to: Animatable[typeof key], progress: number) {
  if (from != null && to != null) {
    const value = from + (to - from) * progress
    applyStyle(el, key, value)
  }
}

export function applyInterpolatedStyles(el: HTMLElement, from: Animatable, to: Animatable, progress: number) {
  el.style.transform = ''
  el.style.filter = ''
  for (const [key, value] of Object.entries(to)) {
    const k = key as keyof Animatable
    applyInterpolatedStyle(el, k, from[k], value, progress)
  }
}

export function applyStyles(el: HTMLElement, styles: Animatable) {
  el.style.transform = ''
  el.style.filter = ''
  for (const [key, value] of Object.entries(styles)) {
    if (value != null) {
      applyStyle(el, key as keyof Animatable, value)
    }
  }
}

export class TweenImpl implements Renderable {
  constructor(
    private readonly enter: TweenAnimation[] = [],
    private readonly exit: TweenAnimation[] = [],
    private readonly style?: Animatable,
  ) { }

  appendTo(ctx: IDOMContext): Clear {

    const element = ctx.getElement()
    let currentAnimation = 0
    let startTime = 0
    let animation: TweenAnimation | null = null
    let from: Animatable | null = null
    let willClear: (() => void) | null = null
    // let unmounted = false
    let animations = this.enter
    const { exit, style } = this

    function frame() {
      // if (unmounted) return
      if (animation == null || from == null) return
      const now = Date.now()
      const elapsed = now - startTime
      const { duration = 250, delay = 0 } = animation
      if (elapsed < delay) return
      const progress = Math.min(1, (elapsed - delay) / duration)

      applyInterpolatedStyles(element, from, animation.style, progress)

      // console.log(
      //   element.style.opacity,
      //   // getComputedStyleValue(getComputedStyle(element), 'translateY')
      // )

      if (progress >= 1) {
        if (exit === animations) {
          console.log('exit')
          willClear?.()
        } else {
          console.log('play next')
          playNextAnimation()
        }
      } else {
        requestAnimationFrame(frame)
      }
    }

    function playNextAnimation() {
      if (currentAnimation >= animations.length) return
      startTime = Date.now()
      animation = animations[currentAnimation]
      if (currentAnimation === 0 && style != null && animations !== exit) {
        applyStyles(element, style)
        from = style
        console.log("playNextAnimation from style", currentAnimation, from, animation.style)
      } else {
        from = getCurrentStyleValues(element, animation.style)
        console.log("playNextAnimation from empty", currentAnimation, from, animation.style)
      }

      requestAnimationFrame(frame)
      currentAnimation++
    }

    playNextAnimation()



    return (clearTree: boolean) => {
      console.log("onUnmount")
      animations = exit
      // unmounted = true
      currentAnimation = 0
      ctx.delayClear(clearTree, (clear) => {
        console.log('perform clear')
        willClear = () => {
          console.log('finalize clear')
          animations = []
          clear()
        }
        playNextAnimation()
      })
    }
  }
}

export function Tween({ enter, exit, style }: TweenProps) {
  return new TweenImpl(enter, exit, style)
}
