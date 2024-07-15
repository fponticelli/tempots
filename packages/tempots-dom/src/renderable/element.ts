import type { TNode, Renderable } from '../types/domain'
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

export function renderableOfTNode(child: TNode): Renderable {
  if (child == null) {
    return Empty
  } else if (Array.isArray(child)) {
    return Fragment(...child.map(renderableOfTNode))
  } else if (typeof child === 'string') {
    return staticText(child)
  } else if (Signal.is(child)) {
    return signalText(child as Signal<string>)
  } else {
    return child as Renderable
  }
}

export function El(tagName: string, ...children: TNode[]): Renderable {
  return (ctx: DOMContext) => {
    const element = ctx.createElement(tagName, undefined)
    if (ctx.isFirstLevel && ssr.isSSR()) {
      addNodeTracker(element)
    }
    ctx.appendOrInsert(element)

    ctx = ctx.withElement(element)
    const clears = children.map(fn => renderableOfTNode(fn)(ctx))
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
  ...children: TNode[]
): Renderable {
  return (ctx: DOMContext) => {
    const element = ctx.createElement(tagName, namespace)
    if (ctx.isFirstLevel && ssr.isSSR()) {
      addNodeTracker(element)
    }
    ctx.appendOrInsert(element)
    ctx = ctx.withElement(element)
    const clears = children.map(fn => renderableOfTNode(fn)(ctx))
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
    [H in keyof HTMLTags]: (...children: TNode[]) => Renderable
  },
  {
    get: (_, tagName: keyof HTMLTags) => {
      return (...children: TNode[]) => {
        return El(tagName, children.flatMap(renderableOfTNode))
      }
    },
  }
)

export const input = new Proxy(
  {} as {
    [T in InputTypes]: (...children: TNode[]) => Renderable
  },
  {
    get: (_, type: InputTypes) => {
      return (...children: TNode[]) => {
        return El('input', attr.type(type), ...children)
      }
    },
  }
)

const NS_SVG = 'http://www.w3.org/2000/svg'

export const svg = new Proxy(
  {} as {
    [S in keyof SVGTags]: (...children: TNode[]) => Renderable
  },
  {
    get: (_, tagName: keyof SVGTags) => {
      return (...children: TNode[]) => {
        return ElNS(tagName, NS_SVG, children.flatMap(renderableOfTNode))
      }
    },
  }
)

const NS_MATH = 'http://www.w3.org/1998/Math/MathML'

export const math = new Proxy(
  {} as {
    [M in keyof MathMLTags]: (...children: TNode[]) => Renderable
  },
  {
    get: (_, tagName: keyof MathMLTags) => {
      return (...children: TNode[]) => {
        return ElNS(tagName, NS_MATH, children.flatMap(renderableOfTNode))
      }
    },
  }
)
