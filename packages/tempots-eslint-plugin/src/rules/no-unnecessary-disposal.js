/**
 * ESLint rule to detect unnecessary manual disposal of auto-disposed signals.
 *
 * With automatic signal disposal in @tempots/dom >= 1.0.0, signals created within
 * renderables are automatically tracked and disposed. Manually disposing them with
 * OnDispose() is unnecessary and can cause double-disposal issues.
 *
 * This rule detects OnDispose() calls for signals that are auto-disposed.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

import { isRenderable } from '../utils/type-utils.js'

const SIGNAL_CREATION_METHODS = new Set([
  'prop',
  'signal',
  'computed',
  'computedOf',
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

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Warn about unnecessary manual disposal of auto-disposed signals',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      unnecessaryDisposal:
        'Signal "{{name}}" is automatically disposed. Remove OnDispose({{name}}.dispose) - it\'s unnecessary and may cause double-disposal.',
      unnecessaryDisposalDirect:
        'Signal "{{name}}" is automatically disposed. Remove OnDispose({{name}}) - it\'s unnecessary and may cause double-disposal.',
      unnecessaryDisposalGeneric:
        'This signal is automatically disposed in renderables. Manual OnDispose() is unnecessary.',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    // Track signals created in the current renderable scope
    const signalsByScope = new Map() // Map<function node, Set<signal names>>
    let currentFunction = null
    const functionStack = []

    /**
     * Check if a call expression is a signal creation
     */
    function isSignalCreation(node) {
      if (node.type !== 'CallExpression') return false

      // Direct creation: prop(), signal(), computed()
      if (
        node.callee.type === 'Identifier' &&
        SIGNAL_CREATION_METHODS.has(node.callee.name)
      ) {
        return true
      }

      // Transformation: signal.map(), signal.filter()
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        SIGNAL_TRANSFORM_METHODS.has(node.callee.property.name)
      ) {
        return true
      }

      return false
    }

    /**
     * Check if a node is wrapped in untracked()
     */
    function isUntracked(node) {
      let parent = node.parent
      while (parent) {
        if (
          parent.type === 'CallExpression' &&
          parent.callee.type === 'Identifier' &&
          parent.callee.name === 'untracked'
        ) {
          return true
        }
        parent = parent.parent
      }
      return false
    }

    return {
      // Track function entry
      ':function'(node) {
        functionStack.push(currentFunction)
        currentFunction = node

        if (isRenderable(node, context)) {
          signalsByScope.set(node, new Set())
        }
      },

      // Track function exit
      ':function:exit'() {
        currentFunction = functionStack.pop()
      },

      // Track signal creation
      VariableDeclarator(node) {
        if (!currentFunction || !signalsByScope.has(currentFunction)) {
          return
        }

        // Check if this is a signal creation
        if (node.init && isSignalCreation(node.init)) {
          // Skip if wrapped in untracked()
          if (isUntracked(node.init)) {
            return
          }

          // Track this signal
          if (node.id.type === 'Identifier') {
            signalsByScope.get(currentFunction).add(node.id.name)
          }
        }
      },

      // Check OnDispose calls
      CallExpression(node) {
        if (!currentFunction || !signalsByScope.has(currentFunction)) {
          return
        }

        // Check if this is OnDispose()
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'OnDispose'
        ) {
          const signals = signalsByScope.get(currentFunction)
          const arg = node.arguments[0]

          if (!arg) return

          // Pattern 1: OnDispose(signal.dispose)
          if (
            arg.type === 'MemberExpression' &&
            arg.property.type === 'Identifier' &&
            arg.property.name === 'dispose' &&
            arg.object.type === 'Identifier'
          ) {
            const signalName = arg.object.name
            if (signals.has(signalName)) {
              context.report({
                node,
                messageId: 'unnecessaryDisposal',
                data: { name: signalName },
              })
            }
          }

          // Pattern 2: OnDispose(signal) - direct signal reference
          if (arg.type === 'Identifier') {
            const signalName = arg.name
            if (signals.has(signalName)) {
              context.report({
                node,
                messageId: 'unnecessaryDisposalDirect',
                data: { name: signalName },
              })
            }
          }

          // Pattern 3: OnDispose(() => signal.dispose())
          if (
            arg.type === 'ArrowFunctionExpression' ||
            arg.type === 'FunctionExpression'
          ) {
            const body = arg.body

            // Check if body is signal.dispose()
            let disposeCall = null
            if (body.type === 'CallExpression') {
              disposeCall = body
            } else if (
              body.type === 'BlockStatement' &&
              body.body.length === 1 &&
              body.body[0].type === 'ExpressionStatement'
            ) {
              disposeCall = body.body[0].expression
            }

            if (
              disposeCall &&
              disposeCall.type === 'CallExpression' &&
              disposeCall.callee.type === 'MemberExpression' &&
              disposeCall.callee.property.type === 'Identifier' &&
              disposeCall.callee.property.name === 'dispose' &&
              disposeCall.callee.object.type === 'Identifier'
            ) {
              const signalName = disposeCall.callee.object.name
              if (signals.has(signalName)) {
                context.report({
                  node,
                  messageId: 'unnecessaryDisposal',
                  data: { name: signalName },
                })
              }
            }
          }
        }
      },
    }
  },
}
