/**
 * ESLint rule to prefer const for signal declarations.
 *
 * Signals should be declared with `const` instead of `let` or `var` to prevent
 * accidental reassignment. Signal values should be updated using `.value`, not
 * by reassigning the variable.
 *
 * This rule enforces const declarations for signals.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

const SIGNAL_CREATION_METHODS = new Set([
  'prop',
  'signal',
  'computed',
  'computedOf',
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

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer const for signal declarations',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      preferConst:
        'Signal "{{name}}" should be declared with const instead of {{kind}}. Signals should not be reassigned; use .value to update the signal value.',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    /**
     * Check if a node is a signal creation call
     */
    function isSignalCreation(node) {
      if (!node) return false

      // Direct signal creation: prop(0), signal(0), computed(...)
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        SIGNAL_CREATION_METHODS.has(node.callee.name)
      ) {
        return true
      }

      // Signal transformation: signal.map(...), signal.filter(...)
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.type === 'Identifier' &&
        SIGNAL_TRANSFORM_METHODS.has(node.callee.property.name)
      ) {
        return true
      }

      // Untracked signal: untracked(() => prop(0))
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'untracked' &&
        node.arguments.length > 0
      ) {
        return true
      }

      return false
    }

    return {
      VariableDeclaration(node) {
        // Only check let and var declarations
        if (node.kind === 'const') return

        // Check each declarator
        for (const declarator of node.declarations) {
          if (!declarator.init) continue
          if (declarator.id.type !== 'Identifier') continue

          if (isSignalCreation(declarator.init)) {
            const sourceCode = context.getSourceCode()

            context.report({
              node: declarator,
              messageId: 'preferConst',
              data: {
                name: declarator.id.name,
                kind: node.kind,
              },
              fix(fixer) {
                // Find the keyword token (let or var)
                const keywordToken = sourceCode.getFirstToken(node)
                if (
                  keywordToken &&
                  (keywordToken.value === 'let' || keywordToken.value === 'var')
                ) {
                  return fixer.replaceText(keywordToken, 'const')
                }
                return null
              },
            })
          }
        }
      },
    }
  },
}
