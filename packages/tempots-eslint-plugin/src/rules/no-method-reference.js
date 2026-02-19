/**
 * ESLint rule to detect Signal/Prop/Computed methods passed by reference
 * instead of being called via dot notation. Since Tempo classes use prototype
 * methods (not arrow function fields), extracting a method loses the `this`
 * binding.
 *
 * This rule requires TypeScript type information (type-checked linting).
 * Without it, the rule reports a single warning per file so the user knows
 * the rule is not functioning.
 *
 * @example
 * ```js
 * // BAD — method extracted without calling, loses `this`
 * signal.onDispose(other.dispose)
 * signal.on(prop.set)
 * const setter = prop.set
 *
 * // GOOD — wrapped in lambda, preserves `this`
 * signal.onDispose(() => other.dispose())
 * signal.on(v => prop.set(v))
 * const setter = (v) => prop.set(v)
 * ```
 *
 * @type {import('eslint').Rule.RuleModule}
 */

import { getTypeChecker, isSignalType } from '../utils/type-utils.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow passing Signal/Prop/Computed methods by reference (loses `this` binding)',
      category: 'Possible Errors',
      recommended: false,
      requiresTypeChecking: true,
    },
    messages: {
      noMethodReference:
        'Do not pass `{{object}}.{{method}}` by reference — wrap in a lambda to preserve `this` binding. Use `(...args) => {{object}}.{{method}}(...args)` instead.',
      missingTypeInfo:
        'The tempots/no-method-reference rule requires type information to function. Enable type-checked linting (parserOptions.projectService) or use the `recommendedTypeChecked` / `strictTypeChecked` config.',
    },
    schema: [],
  },

  create(context) {
    const checker = getTypeChecker(context)
    const parserServices =
      context.sourceCode?.parserServices ?? context.parserServices

    // Without type information, this rule cannot reliably determine
    // whether an object is a Signal. Report once per file so the user
    // knows the rule is not functioning.
    if (!checker || !parserServices?.esTreeNodeToTSNodeMap) {
      return {
        Program(node) {
          context.report({ node, messageId: 'missingTypeInfo' })
        },
      }
    }

    function isSignalObject(node) {
      try {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
        if (!tsNode) return false
        const type = checker.getTypeAtLocation(tsNode)
        return isSignalType(type)
      } catch {
        return false
      }
    }

    function isMethodType(node) {
      try {
        const tsNode = parserServices.esTreeNodeToTSNodeMap.get(node)
        if (!tsNode) return false
        const type = checker.getTypeAtLocation(tsNode)
        const signatures = type.getCallSignatures?.()
        return signatures != null && signatures.length > 0
      } catch {
        return false
      }
    }

    function checkMemberExpression(node) {
      if (
        node.type !== 'MemberExpression' ||
        node.computed ||
        node.property.type !== 'Identifier'
      ) {
        return
      }

      // Skip if this is a method call: obj.method() is fine
      const parent = node.parent
      if (parent.type === 'CallExpression' && parent.callee === node) {
        return
      }

      // Only flag if the object is typed as Signal/Prop/Computed
      if (!isSignalObject(node.object)) {
        return
      }

      // Only flag if the accessed member is a method (has call signatures),
      // not a plain property like .value
      if (!isMethodType(node)) {
        return
      }

      const objectText =
        node.object.type === 'Identifier'
          ? node.object.name
          : context.sourceCode.getText(node.object)

      context.report({
        node,
        messageId: 'noMethodReference',
        data: {
          object: objectText,
          method: node.property.name,
        },
      })
    }

    return {
      // Check arguments of function calls: fn(obj.method)
      'CallExpression > MemberExpression'(node) {
        const parent = node.parent
        if (parent.type === 'CallExpression' && parent.callee !== node) {
          checkMemberExpression(node)
        }
      },

      // Check variable assignments: const x = obj.method
      'VariableDeclarator > MemberExpression'(node) {
        checkMemberExpression(node)
      },

      // Check assignments: x = obj.method
      'AssignmentExpression > MemberExpression'(node) {
        const parent = node.parent
        if (parent.right === node) {
          checkMemberExpression(node)
        }
      },

      // Check array elements: [obj.method, ...]
      'ArrayExpression > MemberExpression'(node) {
        checkMemberExpression(node)
      },

      // Check object property values: { key: obj.method }
      'Property > MemberExpression'(node) {
        const parent = node.parent
        if (parent.value === node) {
          checkMemberExpression(node)
        }
      },

      // Check return statements: return obj.method
      'ReturnStatement > MemberExpression'(node) {
        checkMemberExpression(node)
      },
    }
  },
}
