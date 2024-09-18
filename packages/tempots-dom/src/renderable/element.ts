import type { TNode, Renderable } from '../types/domain'
import type { HTMLTags } from '../types/html-tags'
import type { SVGTags } from '../types/svg-tags'
import type { MathMLTags } from '../types/mathml-tags'
import { Signal } from '../std/signal'
import { DOMContext } from '../dom/dom-context'
import { _signalText, _staticText } from './text'
import { Fragment } from './fragment'
import { Empty } from './empty'
import { attr } from './attribute'
import { InputTypes } from '../types/html-attributes'
// import { _addNodeTracker } from '../dom/ssr'
import { Value } from '../std/value'

/**
 * Converts a TNode into a Renderable.
 * @param child - The TNode to convert.
 * @returns The corresponding Renderable.
 * @public
 */
export const renderableOfTNode = (child: TNode): Renderable => {
  if (child == null) {
    return Empty
  } else if (Array.isArray(child)) {
    return Fragment(...child.map(renderableOfTNode))
  } else if (typeof child === 'string') {
    return _staticText(child)
  } else if (Signal.is(child as Value<string>)) {
    return _signalText(child as Signal<string>)
  } else {
    return child as Renderable
  }
}

/**
 * Creates a Renderable that represents an HTML element.
 *
 * @param tagName - The tag name of the HTML element.
 * @param children - The child nodes of the HTML element.
 * @returns A renderable function that creates and appends the HTML element to the DOM.
 * @public
 */
export const El = (tagName: string, ...children: TNode[]): Renderable => {
  return (ctx: DOMContext) => {
    const newCtx = ctx.makeChildElement(tagName, undefined)
    // if (ctx.isFirstLevel) {
    //   _addNodeTracker(newCtx)
    // }
    const clears = children.map(fn => renderableOfTNode(fn)(newCtx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      newCtx.clear(removeTree)
    }
  }
}

/**
 * Creates a renderable function that represents an element in the DOM with a specified namespace.
 *
 * @param tagName - The name of the HTML tag for the element.
 * @param namespace - The namespace of the element.
 * @param children - The child nodes of the element.
 * @returns A renderable function that creates and appends the element to the DOM.
 * @public
 */
export const ElNS =
  (tagName: string, namespace: string, ...children: TNode[]): Renderable =>
  (ctx: DOMContext) => {
    const newCtx = ctx.makeChildElement(tagName, namespace)
    // if (ctx.isFirstLevel) {
    //   _addNodeTracker(newCtx)
    // }
    const clears = children.map(fn => renderableOfTNode(fn)(newCtx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      newCtx.clear(removeTree)
    }
  }

/**
 * A convenience object to create Renderables for HTML elements.
 * @public
 */
export const html = new Proxy(
  {} as {
    [H in keyof HTMLTags]: (...children: TNode[]) => Renderable
  },
  {
    /**
     * Creates a renderable that represents an HTML element.
     * @param tagName - The HTML tag name.
     * @returns A renderable function that creates and appends the HTML element to the DOM.
     */
    get: (_, tagName: keyof HTMLTags) => {
      return (...children: TNode[]) => {
        return El(tagName, children.flatMap(renderableOfTNode))
      }
    },
  }
)

/**
 * A convenience object to create Renderables for HTMLInput elements.
 *
 * It automatically creates an attribute with the specified type
 *
 * @example
 * ```ts
 * input.text() // equivalent to html.input(attr.type('text'))
 * ```
 *
 * @public
 */
export const input = new Proxy(
  {} as {
    [T in InputTypes]: (...children: TNode[]) => Renderable
  },
  {
    /**
     * Creates a renderable that represents an HTMLInput element.
     * @param type - The input type name.
     * @returns A renderable function that creates and appends the HTMLInput element to the DOM.
     */
    get: (_, type: InputTypes) => {
      return (...children: TNode[]) => {
        return El('input', attr.type(type), ...children)
      }
    },
  }
)

const NS_SVG = 'http://www.w3.org/2000/svg'

/**
 * A convenience object to create Renderables for SVG elements.
 * @public
 */
export const svg = new Proxy(
  {} as {
    [S in keyof SVGTags]: (...children: TNode[]) => Renderable
  },
  {
    /**
     * Creates a renderable that represents an SVG element.
     * @param tagName - The SVG tag name.
     * @returns A renderable function that creates and appends the SVG element to the DOM.
     */
    get: (_, tagName: keyof SVGTags) => {
      return (...children: TNode[]) => {
        return ElNS(tagName, NS_SVG, children.flatMap(renderableOfTNode))
      }
    },
  }
)

const NS_MATH = 'http://www.w3.org/1998/Math/MathML'

/**
 * A convenience object to create Renderables for MATH elements.
 * @public
 */
export const math = new Proxy(
  {} as {
    [M in keyof MathMLTags]: (...children: TNode[]) => Renderable
  },
  {
    /**
     * Creates a renderable that represents an Math element.
     * @param tagName - The Math tag name.
     * @returns A renderable function that creates and appends the Math element to the DOM.
     */
    get: (_, tagName: keyof MathMLTags) => {
      return (...children: TNode[]) => {
        return ElNS(tagName, NS_MATH, children.flatMap(renderableOfTNode))
      }
    },
  }
)
