/**
 * ESLint rule to disallow mapping signals to renderables.
 *
 * Mapping a signal to a renderable like `signal.map(v => html.div(v))` creates
 * a signal of renderables, which is usually unnecessary and inefficient. The
 * preferred pattern is to pass the signal directly to the renderable instead
 * (e.g., `html.div(signal)`).
 *
 * @type {import('eslint').Rule.RuleModule}
 */

import { getTypeChecker } from '../utils/type-utils.js'

const SIGNAL_CREATION_METHODS = new Set([
  'prop',
  'signal',
  'computed',
  'untracked',
])

const SIGNAL_TRANSFORM_METHODS = new Set([
  'map',
  'filter',
  'flatMap',
  'filterMap',
  'scan',
  'debounce',
  'throttle',
  'distinct',
  'distinctUntilChanged',
  'take',
  'takeWhile',
  'skip',
  'skipWhile',
  'deriveProp',
])

const RENDERABLE_HELPERS = new Set(['html', 'attr', 'on', 'svg', 'math', 'style'])
const EXCLUDED_FUNCTIONS = new Set(['OnDispose', 'OnMount', 'OnUnmount'])
const SIGNAL_TYPE_NAMES = new Set(['Signal', 'Computed', 'Prop'])

function isSignalCreation(node) {
  if (!node || node.type !== 'CallExpression') return false

  if (
    node.callee.type === 'Identifier' &&
    SIGNAL_CREATION_METHODS.has(node.callee.name)
  ) {
    return true
  }

  return false
}

function isSignalTransform(node) {
  if (!node || node.type !== 'CallExpression') return false

  return (
    node.callee.type === 'MemberExpression' &&
    node.callee.property.type === 'Identifier' &&
    SIGNAL_TRANSFORM_METHODS.has(node.callee.property.name)
  )
}

function isComputedOfCall(node) {
  if (!node || node.type !== 'CallExpression') return false
  const callee = node.callee
  if (!callee || callee.type !== 'CallExpression') return false
  const inner = callee.callee

  if (inner.type === 'Identifier' && inner.name === 'computedOf') {
    return true
  }

  return (
    inner.type === 'MemberExpression' &&
    inner.property.type === 'Identifier' &&
    inner.property.name === 'computedOf'
  )
}

function isComputedCall(node) {
  return (
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'computed'
  )
}

function isPropOrSignalCall(node) {
  return (
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    (node.callee.name === 'prop' || node.callee.name === 'signal')
  )
}

function isSignalLike(node, signalVariables) {
  if (!node) return false

  if (node.type === 'Identifier') {
    return signalVariables.has(node.name)
  }

  if (node.type === 'CallExpression') {
    return isSignalCreation(node) || isSignalTransform(node)
  }

  return false
}

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
  return aliasName === 'Renderable'
}

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

function looksLikeRenderableExpression(node) {
  if (!node) return false

  if (node.type === 'CallExpression') {
    if (
      node.callee.type === 'MemberExpression' &&
      node.callee.object.type === 'Identifier'
    ) {
      const objectName = node.callee.object.name
      if (RENDERABLE_HELPERS.has(objectName)) {
        return true
      }
    }

    if (node.callee.type === 'Identifier') {
      const name = node.callee.name
      if (EXCLUDED_FUNCTIONS.has(name)) {
        return false
      }
      if (name.length > 0 && name[0] === name[0].toUpperCase()) {
        return true
      }
    }
  }

  return false
}

function findReturnStatements(body) {
  const returns = []
  const visited = new Set()
  const skipProps = new Set([
    'parent',
    'loc',
    'range',
    'start',
    'end',
    'comments',
    'tokens',
    'leadingComments',
    'trailingComments',
  ])

  function visit(node) {
    if (!node || typeof node !== 'object') return
    if (!node.type) return
    if (visited.has(node)) return
    visited.add(node)

    if (node.type === 'ReturnStatement') {
      returns.push(node)
      return
    }

    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      return
    }

    for (const key in node) {
      if (skipProps.has(key)) continue
      const child = node[key]
      if (Array.isArray(child)) {
        child.forEach(visit)
      } else if (child && typeof child === 'object') {
        visit(child)
      }
    }
  }

  visit(body)
  return returns
}

function callbackReturnsRenderable(callback) {
  if (
    callback.type !== 'ArrowFunctionExpression' &&
    callback.type !== 'FunctionExpression'
  ) {
    return false
  }

  if (callback.type === 'ArrowFunctionExpression') {
    if (callback.body.type !== 'BlockStatement') {
      return looksLikeRenderableExpression(callback.body)
    }
  }

  if (callback.body && callback.body.type === 'BlockStatement') {
    const returnStatements = findReturnStatements(callback.body)
    for (const returnStmt of returnStatements) {
      if (looksLikeRenderableExpression(returnStmt.argument)) {
        return true
      }
    }
  }

  return false
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
    const signalVariables = new Set()
    const checker = getTypeChecker(context)
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices

    function getTypeStatus(node) {
      if (!checker || !parserServices?.esTreeNodeToTSNodeMap) {
        return 'unknown'
      }

      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
      if (!tsNode) {
        return 'unknown'
      }

      const type = checker.getTypeAtLocation(tsNode)
      return signalRenderableStatus(type, checker)
    }

    return {
      VariableDeclarator(node) {
        if (!node.init || node.id.type !== 'Identifier') return

        if (isSignalCreation(node.init) || isSignalTransform(node.init)) {
          signalVariables.add(node.id.name)
        }
      },

      CallExpression(node) {
        const typeStatus = getTypeStatus(node)
        if (typeStatus === 'match') {
          const calleeObject =
            node.callee.type === 'MemberExpression'
              ? node.callee.object
              : null
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
          return
        }

        if (typeStatus === 'no-match') {
          return
        }

        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'map'
        ) {
          if (!isSignalLike(node.callee.object, signalVariables)) {
            return
          }

          const callback = node.arguments[0]
          if (!callback) return

          if (!callbackReturnsRenderable(callback)) {
            return
          }

          const object = node.callee.object
          if (object.type === 'Identifier') {
            context.report({
              node,
              messageId: 'renderableSignalMap',
              data: { name: object.name },
            })
            return
          }

          context.report({
            node,
            messageId: 'renderableSignalMapGeneric',
          })
          return
        }

        if (isComputedOfCall(node) || isComputedCall(node)) {
          const callback = node.arguments[0]
          if (!callback || !callbackReturnsRenderable(callback)) {
            return
          }

          context.report({
            node,
            messageId: 'renderableSignalMapGeneric',
          })
          return
        }

        if (isPropOrSignalCall(node)) {
          const valueArg = node.arguments[0]
          if (!valueArg || !looksLikeRenderableExpression(valueArg)) {
            return
          }

          context.report({
            node,
            messageId: 'renderableSignalMapGeneric',
          })
        }
      },
    }
  },
}
