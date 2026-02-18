import type { TNode, Renderable } from '../types/domain'
import type { HTMLTags } from '../types/html-tags'
import type { SVGTags } from '../types/svg-tags'
import type { MathMLTags } from '../types/mathml-tags'
import { DOMContext } from '../dom/dom-context'
import { renderableOfTNode } from './shared'
import { attr } from './attribute'
import { InputTypes } from '../types/html-attributes'
import { domRenderable } from '../types/domain'

export { renderableOfTNode }

/**
 * Creates a Renderable that represents an HTML element.
 *
 * @param tagName - The tag name of the HTML element.
 * @param children - The child nodes of the HTML element.
 * @returns A renderable object that creates and appends the HTML element to the DOM.
 * @public
 */
export const El = (tagName: string, ...children: TNode[]): Renderable => {
  const kids = children.map(renderableOfTNode)
  const renderable = domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildElement(tagName, undefined)
    const clears = kids.map(fn => fn.render(newCtx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      newCtx.clear(removeTree)
    }
  }) as Renderable & Record<string, unknown>
  renderable.kind = 'element'
  renderable.tag = tagName
  renderable.children = kids
  return renderable
}

/**
 * Creates a renderable object that represents an element in the DOM with a specified namespace.
 *
 * @param tagName - The name of the HTML tag for the element.
 * @param namespace - The namespace of the element.
 * @param children - The child nodes of the element.
 * @returns A renderable object that creates and appends the element to the DOM.
 * @public
 */
export const ElNS = (
  tagName: string,
  namespace: string,
  ...children: TNode[]
): Renderable => {
  const kids = children.map(renderableOfTNode)
  const renderable = domRenderable((ctx: DOMContext) => {
    const newCtx = ctx.makeChildElement(tagName, namespace)
    const clears = kids.map(fn => fn.render(newCtx))
    return (removeTree: boolean) => {
      clears.forEach(clear => clear(false))
      newCtx.clear(removeTree)
    }
  }) as Renderable & Record<string, unknown>
  renderable.kind = 'element'
  renderable.tag = tagName
  renderable.ns = namespace
  renderable.children = kids
  return renderable
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
        return El(tagName, ...children)
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
 * Creates a Renderable that represents an SVG element.
 *
 * @param tagName - The tag name of the SVG element.
 * @param children - The child nodes of the SVG element.
 * @returns A renderable function that creates and appends the SVG element to the DOM.
 * @public
 */
export const SVGEl = (tagName: string, ...children: TNode[]): Renderable =>
  ElNS(tagName, NS_SVG, ...children)

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
        return ElNS(tagName, NS_SVG, ...children)
      }
    },
  }
)

const NS_MATH = 'http://www.w3.org/1998/Math/MathML'

/**
 * Creates a Renderable that represents a MathML element.
 *
 * @param tagName - The tag name of the MathML element.
 * @param children - The child nodes of the MathML element.
 * @returns A renderable function that creates and appends the MathML element to the DOM.
 * @public
 */
export const MathEl = (tagName: string, ...children: TNode[]): Renderable =>
  ElNS(tagName, NS_MATH, ...children)

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
        return ElNS(tagName, NS_MATH, ...children)
      }
    },
  }
)
