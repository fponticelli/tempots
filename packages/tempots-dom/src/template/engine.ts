import type { Clear, Renderable } from '@tempots/core'
import type { TemplateEngine } from '@tempots/render'
import type { DOMContext } from '../dom/dom-context'
import type { BrowserContext } from '../dom/browser-context'
import { DOM_RENDERABLE_TYPE } from '../types/domain'
import { buildTemplate } from './builder'
import { hydrateClone } from './hydrator'
import type {
  CompiledTemplate,
  TemplateNode,
  ElementNode,
  FragmentNode,
} from './types'

type R = Renderable<DOMContext, typeof DOM_RENDERABLE_TYPE>

/**
 * Compute a structural fingerprint for a renderable tree.
 * Two trees with the same fingerprint produce identical DOM structures.
 * Returns null if the tree contains an unknown kind.
 */
function computeFingerprint(r: TemplateNode): string | null {
  const parts: string[] = []

  function walk(r: TemplateNode): boolean {
    switch (r.kind) {
      case 'element': {
        const { tag, children } = r as ElementNode
        parts.push(`E:${tag}`)
        for (const c of children) if (!walk(c)) return false
        parts.push('/E')
        break
      }
      case 'static-attr':
        parts.push(`SA:${r.name}=${r.value}`)
        break
      case 'dynamic-attr':
        parts.push('DA')
        break
      case 'static-text':
        parts.push(`ST:${r.text}`)
        break
      case 'dynamic-text':
        parts.push('DT')
        break
      case 'fragment': {
        const { children } = r as FragmentNode
        for (const c of children) if (!walk(c)) return false
        break
      }
      case 'empty':
        break
      default:
        if (r.kind === undefined) {
          parts.push('S')
          break
        }
        return false
    }
    return true
  }

  return walk(r) ? parts.join('|') : null
}

/**
 * Extract dynamic renderables (slots) from a renderable tree
 * in the same order as the template builder creates slots.
 */
function extractSlotsFromTree(r: TemplateNode): R[] {
  const slots: R[] = []

  function walk(r: TemplateNode) {
    switch (r.kind) {
      case 'element': {
        const { children } = r as ElementNode
        for (const c of children) {
          if (c.kind === 'static-attr') continue
          if (c.kind === 'dynamic-attr') {
            slots.push(c as unknown as R)
            continue
          }
          walk(c)
        }
        break
      }
      case 'fragment': {
        const { children } = r as FragmentNode
        for (const c of children) walk(c)
        break
      }
      case 'static-text':
      case 'empty':
        break
      case 'dynamic-text':
        slots.push(r as unknown as R)
        break
      default:
        if (r.kind === undefined) slots.push(r as unknown as R)
        break
    }
  }

  walk(r)
  return slots
}

/**
 * DOM-specific template engine for cloneNode(true) optimization.
 *
 * Builds templates programmatically (no innerHTML) to avoid HTML parser
 * normalization issues with elements like `<tr>`, `<td>`, etc.
 *
 * @internal
 */
export const domTemplateEngine: TemplateEngine<
  DOMContext,
  typeof DOM_RENDERABLE_TYPE
> = {
  build(renderable: R, ctx: DOMContext): CompiledTemplate | null {
    if (!ctx.isBrowser()) return null
    const node = renderable as unknown as TemplateNode
    if (node.kind === undefined) return null

    const doc = (ctx as unknown as BrowserContext).document
    return buildTemplate(node, doc)
  },

  cloneAndHydrate(
    template: unknown,
    ctx: DOMContext,
    slots: R[]
  ): { clear: Clear; startCtx: DOMContext } {
    return hydrateClone(template as CompiledTemplate, ctx, slots)
  },

  fingerprint(renderable: R): string | null {
    return computeFingerprint(renderable as unknown as TemplateNode)
  },

  extractSlots(renderable: R): R[] {
    return extractSlotsFromTree(renderable as unknown as TemplateNode)
  },
}
