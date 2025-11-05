/**
 * ESLint rule to detect untracked signals that are never disposed.
 *
 * Signals created with untracked() are not automatically disposed and must be
 * manually disposed to prevent memory leaks. This rule warns when untracked()
 * signals are created but never disposed.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require disposal of signals created with untracked()',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      untrackedNotDisposed:
        'Signal "{{name}}" created with untracked() must be manually disposed. Add a .dispose() call when done.',
      untrackedNotDisposedGeneric:
        'Signals created with untracked() are not auto-disposed. Remember to call .dispose() when done.',
    },
    schema: [],
  },

  create(context) {
    // Track untracked signals and their disposal
    const untrackedSignals = new Map() // Map<signal name, node>
    const disposedSignals = new Set() // Set<signal names>

    return {
      // Track untracked signal creation
      VariableDeclarator(node) {
        if (!node.init) return

        // Check for: const signal = untracked(() => prop(0))
        if (
          node.init.type === 'CallExpression' &&
          node.init.callee.type === 'Identifier' &&
          node.init.callee.name === 'untracked' &&
          node.id.type === 'Identifier'
        ) {
          untrackedSignals.set(node.id.name, node)
        }
      },

      // Track signal disposal
      CallExpression(node) {
        // Check for: signal.dispose()
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'dispose' &&
          node.callee.object.type === 'Identifier'
        ) {
          disposedSignals.add(node.callee.object.name)
        }
      },

      // Check at end of program
      'Program:exit'() {
        for (const [signalName, node] of untrackedSignals) {
          if (!disposedSignals.has(signalName)) {
            context.report({
              node,
              messageId: 'untrackedNotDisposed',
              data: { name: signalName },
            })
          }
        }
      },
    }
  },
}
