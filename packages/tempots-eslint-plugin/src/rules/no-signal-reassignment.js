/**
 * ESLint rule to prevent reassignment of signal variables.
 *
 * Reassigning a signal variable (e.g., `signal = prop(1)`) creates a memory leak
 * because the original signal is not disposed. Instead, update the signal's value
 * using `.value` (e.g., `signal.value = 1`).
 *
 * This rule detects and prevents signal variable reassignment.
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
    type: 'error',
    docs: {
      description: 'Prevent reassignment of signal variables',
      category: 'Possible Errors',
      recommended: true,
    },
    messages: {
      signalReassignment:
        'Signal variable "{{name}}" is being reassigned. This creates a memory leak because the original signal is not disposed. Use {{name}}.value = ... to update the signal value instead.',
    },
    schema: [],
  },

  create(context) {
    // Track which variables are signals
    const signalVariables = new Map() // variable name -> scope

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
      // Track signal variable declarations
      VariableDeclarator(node) {
        if (!node.init) return
        if (node.id.type !== 'Identifier') return

        if (isSignalCreation(node.init)) {
          const scope = context.getScope()
          signalVariables.set(node.id.name, scope)
        }
      },

      // Check for signal reassignment
      AssignmentExpression(node) {
        if (node.left.type !== 'Identifier') return

        const varName = node.left.name
        if (!signalVariables.has(varName)) return

        // Check if this is reassigning to another signal
        if (isSignalCreation(node.right)) {
          context.report({
            node,
            messageId: 'signalReassignment',
            data: { name: varName },
          })
        }
      },
    }
  },
}
