/**
 * ESLint rule to suggest replacing empty Fragment() with Empty.
 *
 * Fragment() with no children is redundant and can be replaced with Empty.
 *
 * @type {import('eslint').Rule.RuleModule}
 */

function isIdentifierInScope(name, node, sourceCode) {
  let scope = sourceCode.getScope(node)
  while (scope) {
    if (scope.variables.some(variable => variable.name === name)) {
      return true
    }
    scope = scope.upper
  }
  return false
}

function findTempotsDomImport(sourceCode) {
  const program = sourceCode.ast
  for (const node of program.body) {
    if (node.type !== 'ImportDeclaration') continue
    if (
      node.source.type !== 'Literal' ||
      node.source.value !== '@tempots/dom'
    ) {
      continue
    }

    const specifiers = node.specifiers.filter(
      specifier => specifier.type === 'ImportSpecifier'
    )
    if (specifiers.length === 0) {
      continue
    }

    const hasEmpty = specifiers.some(
      specifier => specifier.imported.name === 'Empty'
    )

    return { node, specifiers, hasEmpty }
  }

  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Empty over an empty Fragment()',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      emptyFragment:
        'Fragment() with no children is redundant. Use Empty instead.',
    },
    fixable: 'code',
    schema: [],
  },

  create(context) {
    const sourceCode = context.getSourceCode()
    const tempotsDomImport = findTempotsDomImport(sourceCode)

    return {
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Fragment' &&
          node.arguments.length === 0
        ) {
          const hasEmptyInScope =
            isIdentifierInScope('Empty', node, sourceCode) ||
            tempotsDomImport?.hasEmpty

          context.report({
            node: node.callee,
            messageId: 'emptyFragment',
            fix: hasEmptyInScope
              ? fixer => fixer.replaceText(node, 'Empty')
              : tempotsDomImport
                ? fixer => {
                    const fixes = [fixer.replaceText(node, 'Empty')]
                    const lastSpecifier =
                      tempotsDomImport.specifiers[
                        tempotsDomImport.specifiers.length - 1
                      ]
                    if (lastSpecifier) {
                      fixes.push(
                        fixer.insertTextAfter(lastSpecifier, ', Empty')
                      )
                    }
                    return fixes
                  }
                : null,
          })
        }
      },
    }
  },
}
