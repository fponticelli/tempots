/**
 * ESLint rule to suggest removing Fragment() calls with a single child.
 *
 * Fragment() is intended for grouping multiple renderables. When it wraps only
 * one child, it is redundant.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow Fragment() with a single child',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      singleChildFragment:
        'Fragment() with a single child is redundant. Return the child directly instead.',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode()

    return {
      CallExpression(node) {
        if (
          node.callee.type !== 'Identifier' ||
          node.callee.name !== 'Fragment'
        ) {
          return
        }

        if (node.arguments.length !== 1) {
          return
        }

        const arg = node.arguments[0]
        if (!arg || arg.type === 'SpreadElement') {
          return
        }

        context.report({
          node: node.callee,
          messageId: 'singleChildFragment',
          fix: fixer => fixer.replaceText(node, sourceCode.getText(arg)),
        })
      },
    }
  },
}
