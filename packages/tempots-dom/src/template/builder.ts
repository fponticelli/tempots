import type {
  CompiledTemplate,
  SlotInfo,
  TemplateNode,
  ElementNode,
  FragmentNode,
} from './types'

/**
 * Walk a renderable tree with kind metadata and build a DOM template
 * programmatically (no innerHTML — avoids HTML parser normalization
 * issues with `<tr>`, `<td>`, etc.).
 *
 * Returns null if the tree contains an unknown kind that can't be templated.
 *
 * @internal
 */
export function buildTemplate(
  renderable: TemplateNode,
  doc: Document
): CompiledTemplate | null {
  const slots: SlotInfo[] = []
  const fragment = doc.createDocumentFragment()

  if (!walkNode(renderable, fragment, [], { count: 0 }, slots, doc)) {
    return null
  }

  return { fragment, slots, topNodeCount: fragment.childNodes.length }
}

function walkNode(
  r: TemplateNode,
  parent: Node,
  pathToParent: number[],
  counter: { count: number },
  slots: SlotInfo[],
  doc: Document
): boolean {
  switch (r.kind) {
    case 'element': {
      const { tag, ns, children } = r as ElementNode
      const el =
        ns != null ? doc.createElementNS(ns, tag) : doc.createElement(tag)

      const currentPath = [...pathToParent, counter.count++]

      // Static attrs — accumulate class separately
      let classNames = ''
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.kind === 'static-attr') {
          if (child.name === 'class') {
            classNames += (classNames ? ' ' : '') + child.value
          } else {
            el.setAttribute(child.name, child.value)
          }
        }
      }
      if (classNames) el.className = classNames

      parent.appendChild(el)

      // Dynamic attrs → slots pointing to this element
      for (let i = 0; i < children.length; i++) {
        if (children[i].kind === 'dynamic-attr') {
          slots.push({ path: currentPath, kind: 'dynamic-attr' })
        }
      }

      // Content children → recurse
      const inner = { count: 0 }
      for (let i = 0; i < children.length; i++) {
        const child = children[i]
        if (child.kind === 'static-attr' || child.kind === 'dynamic-attr')
          continue
        if (!walkNode(child, el, currentPath, inner, slots, doc)) {
          return false
        }
      }

      return true
    }

    case 'static-text': {
      parent.appendChild(doc.createTextNode(r.text))
      counter.count++
      return true
    }

    case 'dynamic-text': {
      parent.appendChild(doc.createTextNode(''))
      slots.push({
        path: [...pathToParent, counter.count++],
        kind: 'dynamic-text',
      })
      return true
    }

    case 'fragment': {
      const { children } = r as FragmentNode
      for (let i = 0; i < children.length; i++) {
        if (!walkNode(children[i], parent, pathToParent, counter, slots, doc)) {
          return false
        }
      }
      return true
    }

    case 'empty':
      return true

    default: {
      if (r.kind === undefined) {
        // Opaque renderable — create comment placeholder as slot
        parent.appendChild(doc.createComment(''))
        slots.push({
          path: [...pathToParent, counter.count++],
          kind: 'slot',
        })
        return true
      }
      // Unknown kind — can't template
      return false
    }
  }
}
