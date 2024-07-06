import type { Child, Mountable } from '../types/domain'
import type { HTMLTags } from '../types/html-tags'
import type { SVGTags } from '../types/svg-tags'
import type { MathMLTags } from '../types/mathml-tags'
import { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { removeDOMNode } from '../dom/dom-utils'
import { signalText, staticText } from './text'
import { Fragment } from './fragment'
import { Empty } from './empty'
import { attr } from './attribute'
import { InputTypes } from '../types/html-attributes'
import { ssr } from '../dom/ssr'
import { addNodeTracker } from '../dom/ssr'

export function childToMountable(child: Child): Mountable {
  if (child == null) {
    return Empty
  } else if (Array.isArray(child)) {
    return Fragment(...child.map(childToMountable))
  } else if (typeof child === 'string') {
    return staticText(child)
  } else if (Signal.is(child)) {
    return signalText(child as Signal<string>)
  } else {
    return child as Mountable
  }
}

export function El(tagName: string, ...children: Child[]): Mountable {
  return (ctx: DOMContext) => {
    const element = ctx.createElement(tagName, undefined)
    if (ctx.isFirstLevel && ssr.isSSR()) {
      addNodeTracker(element)
    }
    ctx.appendOrInsert(element)

    ctx = ctx.withElement(element)
    const clears = children.map(fn => childToMountable(fn)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      if (removeTree) {
        removeDOMNode(element)
      }
    }
  }
}

export function ElNS(
  tagName: string,
  namespace: string,
  ...children: Child[]
): Mountable {
  return (ctx: DOMContext) => {
    const element = ctx.createElement(tagName, namespace)
    if (ctx.isFirstLevel && ssr.isSSR()) {
      addNodeTracker(element)
    }
    ctx.appendOrInsert(element)
    ctx = ctx.withElement(element)
    const clears = children.map(fn => childToMountable(fn)(ctx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      if (removeTree) {
        removeDOMNode(element)
      }
    }
  }
}

export const html = new Proxy(
  {} as {
    [H in keyof HTMLTags]: (...children: Child[]) => Mountable
  },
  {
    get: (_, tagName: keyof HTMLTags) => {
      return (...children: Child[]) => {
        return El(tagName, children.flatMap(childToMountable))
      }
    },
  }
)

export const input = new Proxy(
  {} as {
    [T in InputTypes]: (...children: Child[]) => Mountable
  },
  {
    get: (_, type: InputTypes) => {
      return (...children: Child[]) => {
        return El('input', attr.type(type), ...children)
      }
    },
  }
)

const NS_SVG = 'http://www.w3.org/2000/svg'

export const svg = new Proxy(
  {} as {
    [S in keyof SVGTags]: (...children: Child[]) => Mountable
  },
  {
    get: (_, tagName: keyof SVGTags) => {
      return (...children: Child[]) => {
        return ElNS(tagName, NS_SVG, children.flatMap(childToMountable))
      }
    },
  }
)

const NS_MATH = 'http://www.w3.org/1998/Math/MathML'

export const math = new Proxy(
  {} as {
    [M in keyof MathMLTags]: (...children: Child[]) => Mountable
  },
  {
    get: (_, tagName: keyof MathMLTags) => {
      return (...children: Child[]) => {
        return ElNS(tagName, NS_MATH, children.flatMap(childToMountable))
      }
    },
  }
)
