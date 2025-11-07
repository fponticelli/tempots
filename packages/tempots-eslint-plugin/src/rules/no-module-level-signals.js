/**
 * ESLint rule to detect signals created at module level (outside renderables).
 *
 * With automatic signal disposal, signals created within renderables are automatically
 * tracked and disposed. However, signals created at module level will be tracked by
 * the global scope and may cause unexpected behavior.
 *
 * This rule warns about signal creation at module level and suggests either:
 * 1. Moving the signal inside a renderable
 * 2. Using `untracked()` to explicitly create a long-lived signal
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
        'Warn about signals created at module level (outside renderables)',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      moduleLevelSignal:
        'Signal "{{name}}" created at module level will be tracked by global scope. Consider moving inside a renderable or using untracked(() => {{method}}(...)) for long-lived signals.',
      moduleLevelTransform:
        'Signal transformation "{{name}}" created at module level will be tracked by global scope. Consider moving inside a renderable or using untracked(() => signal.{{method}}(...)) for long-lived signals.',
    },
    schema: [],
  },

  create(context) {
    let functionDepth = 0
    let isInRenderable = false
    const signals = new Set() // Track signal variable names

    return {
      // Track function entry
      ':function'(node) {
        functionDepth++
        if (isRenderable(node, context)) {
          isInRenderable = true
        }
      },

      // Track function exit
      ':function:exit'() {
        functionDepth--
        if (functionDepth === 0) {
          isInRenderable = false
        }
      },

      // Check signal creation
      CallExpression(node) {
        // Skip if we're inside a renderable
        if (isInRenderable || functionDepth > 0) {
          return
        }

        // Check for signal creation methods
        if (
          node.callee.type === 'Identifier' &&
          SIGNAL_CREATION_METHODS.has(node.callee.name)
        ) {
          // Check if it's assigned to a variable
          const parent = node.parent
          if (
            parent.type === 'VariableDeclarator' &&
            parent.id.type === 'Identifier'
          ) {
            // Track this variable as a signal
            signals.add(parent.id.name)

            context.report({
              node,
              messageId: 'moduleLevelSignal',
              data: {
                name: parent.id.name,
                method: node.callee.name,
              },
            })
          }
        }

        // Check for signal transformation methods
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          SIGNAL_TRANSFORM_METHODS.has(node.callee.property.name)
        ) {
          // Check if the object is a tracked signal
          const objectName =
            node.callee.object.type === 'Identifier'
              ? node.callee.object.name
              : null

          // Only flag if the object is a known signal
          if (objectName && signals.has(objectName)) {
            const parent = node.parent
            if (
              parent.type === 'VariableDeclarator' &&
              parent.id.type === 'Identifier'
            ) {
              // Track the result as a signal too
              signals.add(parent.id.name)

              context.report({
                node,
                messageId: 'moduleLevelTransform',
                data: {
                  name: parent.id.name,
                  method: node.callee.property.name,
                },
              })
            }
          }
        }
      },
    }
  },
}
