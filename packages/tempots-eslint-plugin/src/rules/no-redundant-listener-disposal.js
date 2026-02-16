/**
 * ESLint rule to detect redundant OnDispose for signal.on() and signal.onChange() listeners.
 *
 * With automatic listener disposal in @tempots/dom >= 1.0.0, listeners registered with
 * signal.on() and signal.onChange() are automatically cleaned up when the scope is disposed.
 * Wrapping them with OnDispose() is unnecessary and redundant.
 *
 * This rule detects OnDispose() calls for signal listeners and suggests removing the wrapper.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

const LISTENER_METHODS = new Set(['on', 'onChange'])

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow redundant OnDispose for signal.on() and signal.onChange() listeners',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      redundantListenerDisposal:
        "signal.{{method}}() listeners are automatically disposed when the scope ends. Remove OnDispose wrapper - it's unnecessary.",
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    /**
     * Check if a call expression is a signal listener registration
     */
    function isSignalListenerCall(node) {
      if (node.type !== 'CallExpression') return null

      // Pattern: signal.on(...) or signal.onChange(...)
      if (
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        LISTENER_METHODS.has(node.callee.property.name)
      ) {
        return node.callee.property.name
      }

      return null
    }

    return {
      // Check OnDispose calls
      CallExpression(node) {
        // Check if this is OnDispose()
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'OnDispose'
        ) {
          const arg = node.arguments[0]

          if (!arg) return

          // Pattern: OnDispose(signal.on(...)) or OnDispose(signal.onChange(...))
          const method = isSignalListenerCall(arg)
          if (method) {
            const sourceCode = context.sourceCode

            context.report({
              node,
              messageId: 'redundantListenerDisposal',
              data: { method },
              fix(fixer) {
                // Auto-fix: remove OnDispose wrapper
                // Replace OnDispose(signal.on(...)) with signal.on(...)
                return fixer.replaceText(node, sourceCode.getText(arg))
              },
            })
          }
        }
      },
    }
  },
}
