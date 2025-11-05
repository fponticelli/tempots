/**
 * ESLint rule to require proper disposal for signals created in async contexts.
 *
 * Signals created in async contexts (setTimeout, Promise callbacks, async functions)
 * are not automatically tracked by the disposal scope because they execute after
 * the renderable has returned. These signals must be manually disposed using
 * scope.track() or scope.onDispose().
 *
 * This rule warns about signal creation in async contexts and suggests proper
 * disposal patterns.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

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
    type: 'problem',
    docs: {
      description:
        'Require proper disposal for signals created in async contexts',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      asyncSignalDisposal:
        'Signal "{{name}}" created in async context will not be auto-disposed. Use scope.track({{name}}) or scope.onDispose({{name}}.dispose) to ensure proper disposal.',
      asyncSignalDisposalGeneric:
        'Signals created in async contexts are not auto-disposed. Use scope.track() or scope.onDispose() for proper disposal, or create signals synchronously.',
    },
    schema: [],
  },

  create(context) {
    let asyncDepth = 0
    const asyncContextStack = []

    /**
     * Check if a function is async context
     */
    function isAsyncContext(node) {
      // Async function
      if (node.async) return true

      // Promise callback: .then(), .catch(), .finally()
      const parent = node.parent
      if (
        parent &&
        parent.type === 'CallExpression' &&
        parent.callee.type === 'MemberExpression' &&
        parent.callee.property.type === 'Identifier'
      ) {
        const methodName = parent.callee.property.name
        if (['then', 'catch', 'finally'].includes(methodName)) {
          return true
        }
      }

      // setTimeout, setInterval, requestAnimationFrame
      if (
        parent &&
        parent.type === 'CallExpression' &&
        parent.callee.type === 'Identifier'
      ) {
        const funcName = parent.callee.name
        if (
          [
            'setTimeout',
            'setInterval',
            'requestAnimationFrame',
            'requestIdleCallback',
          ].includes(funcName)
        ) {
          return true
        }
      }

      return false
    }

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
     * Check if wrapped in untracked()
     */
    function isUntracked(node) {
      const parent = node.parent
      return (
        parent &&
        parent.type === 'CallExpression' &&
        parent.callee.type === 'Identifier' &&
        parent.callee.name === 'untracked'
      )
    }

    return {
      // Track async context entry
      ':function'(node) {
        const isAsync = isAsyncContext(node)
        asyncContextStack.push(isAsync)
        if (isAsync) {
          asyncDepth++
        }
      },

      // Track async context exit
      ':function:exit'() {
        const wasAsync = asyncContextStack.pop()
        if (wasAsync) {
          asyncDepth--
        }
      },

      // Check signal creation
      VariableDeclarator(node) {
        if (asyncDepth === 0) return
        if (!node.init) return

        // Check if this is a signal creation
        if (isSignalCreation(node.init)) {
          // Skip if wrapped in untracked()
          if (isUntracked(node.init)) {
            return
          }

          // Report the issue
          if (node.id.type === 'Identifier') {
            context.report({
              node,
              messageId: 'asyncSignalDisposal',
              data: { name: node.id.name },
            })
          } else {
            context.report({
              node,
              messageId: 'asyncSignalDisposalGeneric',
            })
          }
        }
      },

      // Also check inline signal creation in async contexts
      CallExpression(node) {
        if (asyncDepth === 0) return

        if (isSignalCreation(node)) {
          // Skip if wrapped in untracked()
          if (isUntracked(node)) {
            return
          }

          // Skip if it's part of a variable declaration (already handled)
          if (
            node.parent.type === 'VariableDeclarator' &&
            node.parent.init === node
          ) {
            return
          }

          context.report({
            node,
            messageId: 'asyncSignalDisposalGeneric',
          })
        }
      },
    }
  },
}
