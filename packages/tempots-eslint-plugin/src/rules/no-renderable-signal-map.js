/**
 * ESLint rule to disallow mapping signals to renderables.
 *
 * Mapping a signal to a renderable like `signal.map(v => html.div(v))` creates
 * a signal of renderables, which is usually unnecessary and inefficient. The
 * preferred pattern is to pass the signal directly to the renderable instead
 * (e.g., `html.div(signal)`).
 *
 * This rule requires TypeScript type information (type-checked linting).
 * Without it, the rule is silently disabled to avoid false positives.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

import { getTypeChecker } from '../utils/type-utils.js'

const SIGNAL_TYPE_NAMES = new Set(['Signal', 'Computed', 'Prop'])

function getTypeName(type) {
  const symbol = type.getSymbol?.() ?? type.symbol ?? type.aliasSymbol
  return symbol ? symbol.getName() : null
}

function getTypeArguments(type, checker) {
  if (type.aliasTypeArguments && type.aliasTypeArguments.length > 0) {
    return type.aliasTypeArguments
  }

  if (type.typeArguments && type.typeArguments.length > 0) {
    return type.typeArguments
  }

  if (checker && typeof checker.getTypeArguments === 'function') {
    try {
      return checker.getTypeArguments(type)
    } catch {
      return []
    }
  }

  return []
}

function isAnyOrUnknown(type) {
  const flags = type.flags ?? 0
  return (flags & 1) === 1 || (flags & 2) === 2
}

function isRenderableType(type, checker) {
  if (!type) return false

  if (isAnyOrUnknown(type)) return false

  if (type.isUnion?.() || type.isIntersection?.()) {
    return type.types.some(inner => isRenderableType(inner, checker))
  }

  const name = getTypeName(type)
  if (name === 'Renderable' || name === 'CoreRenderable') {
    return true
  }

  const aliasName = type.aliasSymbol?.getName?.()
  if (aliasName === 'Renderable') return true

  // Structural check: function (ctx) => (removeTree: boolean) => void
  // Catches cases where the Renderable type alias is resolved by TypeScript.
  const signatures = type.getCallSignatures?.()
  if (signatures && signatures.length === 1) {
    const sig = signatures[0]
    if (sig.getParameters().length === 1) {
      const returnType = sig.getReturnType()
      const retSigs = returnType?.getCallSignatures?.()
      if (retSigs && retSigs.length === 1) {
        const retSig = retSigs[0]
        if (retSig.getParameters().length === 1) {
          const retReturnType = retSig.getReturnType()
          if (retReturnType && retReturnType.flags & 16384) {
            return true
          }
        }
      }
    }
  }

  return false
}

/**
 * Determines whether a type is a Signal/Computed/Prop containing a Renderable.
 * Returns 'match', 'no-match', or 'unknown'.
 */
function signalRenderableStatus(type, checker) {
  if (!type) return 'unknown'

  if (isAnyOrUnknown(type)) {
    return 'unknown'
  }

  if (type.isUnion?.() || type.isIntersection?.()) {
    let sawUnknown = false
    for (const inner of type.types) {
      const status = signalRenderableStatus(inner, checker)
      if (status === 'match') return 'match'
      if (status === 'unknown') sawUnknown = true
    }
    return sawUnknown ? 'unknown' : 'no-match'
  }

  const aliasName = type.aliasSymbol?.getName?.()
  if (aliasName === 'Value') {
    const aliasArgs = getTypeArguments(type, checker)
    if (aliasArgs.length === 0) return 'unknown'
    if (isAnyOrUnknown(aliasArgs[0])) return 'unknown'
    return isRenderableType(aliasArgs[0], checker) ? 'match' : 'no-match'
  }

  const name = getTypeName(type)
  if (!SIGNAL_TYPE_NAMES.has(name)) {
    return 'no-match'
  }

  const typeArgs = getTypeArguments(type, checker)
  if (typeArgs.length === 0) {
    return 'unknown'
  }

  if (isAnyOrUnknown(typeArgs[0])) {
    return 'unknown'
  }

  return isRenderableType(typeArgs[0], checker) ? 'match' : 'no-match'
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow signals that produce renderables; pass signals directly to renderables',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      renderableSignalMap:
        'Avoid creating a signal of renderables from "{{name}}". Pass the signal directly to the renderable instead (e.g., html.div({{name}})).',
      renderableSignalMapGeneric:
        'Avoid creating signals of renderables. Pass the signal directly to the renderable instead (e.g., html.div(signal)).',
    },
    schema: [],
  },

  create(context) {
    const checker = getTypeChecker(context)
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices

    // Without type information, this rule cannot reliably distinguish
    // Signal.map() from Array.map(), so it is silently disabled.
    if (!checker || !parserServices?.esTreeNodeToTSNodeMap) {
      return {}
    }

    return {
      CallExpression(node) {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
        if (!tsNode) return

        const type = checker.getTypeAtLocation(tsNode)
        const status = signalRenderableStatus(type, checker)
        if (status !== 'match') return

        const calleeObject =
          node.callee.type === 'MemberExpression' ? node.callee.object : null
        if (calleeObject && calleeObject.type === 'Identifier') {
          context.report({
            node,
            messageId: 'renderableSignalMap',
            data: { name: calleeObject.name },
          })
          return
        }

        context.report({
          node,
          messageId: 'renderableSignalMapGeneric',
        })
      },
    }
  },
}
