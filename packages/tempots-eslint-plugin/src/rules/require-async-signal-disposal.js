/**
 * ESLint rule to require proper disposal for signals created in async contexts.
 *
 * Signals created in async contexts (setTimeout, Promise callbacks, async functions)
 * are not automatically tracked by the disposal scope because they execute after
 * the renderable has returned. These signals must be manually disposed using
 * scope.track() or scope.onDispose().
 *
 * This rule requires TypeScript type information (type-checked linting).
 * Without it, the rule is silently disabled to avoid false positives from
 * Array.map() / Array.filter() being confused with Signal transforms.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

import { getTypeChecker, isSignalType } from '../utils/type-utils.js'

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
    const checker = getTypeChecker(context)
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices

    // Without type information, this rule cannot reliably distinguish
    // signal creation from array methods, so it is silently disabled.
    if (!checker || !parserServices?.esTreeNodeToTSNodeMap) {
      return {}
    }

    let asyncDepth = 0
    const asyncContextStack = []
    let untrackedDepth = 0
    const untrackedStack = []

    /**
     * Check if a function is in an async context.
     */
    function isAsyncContext(node) {
      if (node.async) return true

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
     * Check if a function is a callback to untracked().
     */
    function isUntrackedCallback(node) {
      const parent = node.parent
      return (
        parent?.type === 'CallExpression' &&
        parent.callee?.type === 'Identifier' &&
        parent.callee.name === 'untracked'
      )
    }

    /**
     * Check if a node is an untracked() call.
     */
    function isUntrackedCall(node) {
      return (
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'untracked'
      )
    }

    /**
     * Check if a node's type is a Signal type via the type checker.
     */
    function nodeIsSignalType(node) {
      const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
      if (!tsNode) return false
      const type = checker.getTypeAtLocation(tsNode)
      return isSignalType(type)
    }

    return {
      // Track async context entry
      ':function'(node) {
        const isAsync = isAsyncContext(node)
        asyncContextStack.push(isAsync)
        if (isAsync) asyncDepth++

        const isUntracked = isUntrackedCallback(node)
        untrackedStack.push(isUntracked)
        if (isUntracked) untrackedDepth++
      },

      // Track async context exit
      ':function:exit'() {
        const wasAsync = asyncContextStack.pop()
        if (wasAsync) asyncDepth--

        const wasUntracked = untrackedStack.pop()
        if (wasUntracked) untrackedDepth--
      },

      // Check signal creation in variable declarations
      VariableDeclarator(node) {
        if (asyncDepth === 0 || untrackedDepth > 0) return
        if (!node.init) return

        // Skip if wrapped in untracked()
        if (isUntrackedCall(node.init)) return

        // Use the type checker to determine if the init produces a Signal
        if (!nodeIsSignalType(node.init)) return

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
      },

      // Check inline signal creation in async contexts
      CallExpression(node) {
        if (asyncDepth === 0 || untrackedDepth > 0) return

        // Skip if it's part of a variable declaration (already handled)
        if (
          node.parent.type === 'VariableDeclarator' &&
          node.parent.init === node
        ) {
          return
        }

        // Skip untracked() calls
        if (isUntrackedCall(node)) return

        // Use the type checker to determine if this produces a Signal
        if (!nodeIsSignalType(node)) return

        context.report({
          node,
          messageId: 'asyncSignalDisposalGeneric',
        })
      },
    }
  },
}
