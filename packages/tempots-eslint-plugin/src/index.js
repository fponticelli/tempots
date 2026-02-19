import noModuleLevelSignals from './rules/no-module-level-signals.js'
import noUnnecessaryDisposal from './rules/no-unnecessary-disposal.js'
import requireUntrackedDisposal from './rules/require-untracked-disposal.js'
import requireAsyncSignalDisposal from './rules/require-async-signal-disposal.js'
import noSignalReassignment from './rules/no-signal-reassignment.js'
import preferConstSignals from './rules/prefer-const-signals.js'
import noRedundantListenerDisposal from './rules/no-redundant-listener-disposal.js'
import noRenderableSignalMap from './rules/no-renderable-signal-map.js'
import noEmptyFragment from './rules/no-empty-fragment.js'
import noSingleChildFragment from './rules/no-single-child-fragment.js'
import noMethodReference from './rules/no-method-reference.js'

// Base recommended rules (no type information required)
const recommendedRules = {
  // Warn about signals created at module level
  'tempots/no-module-level-signals': 'warn',
  // Warn about unnecessary manual disposal (auto-disposed signals)
  'tempots/no-unnecessary-disposal': 'warn',
  // Error on untracked signals without disposal (memory leak)
  'tempots/require-untracked-disposal': 'error',
  // Warn about signals in async contexts (require manual disposal)
  'tempots/require-async-signal-disposal': 'warn',
  // Error on signal variable reassignment (memory leak)
  'tempots/no-signal-reassignment': 'error',
  // Warn about using let/var instead of const for signals
  'tempots/prefer-const-signals': 'warn',
  // Warn about redundant OnDispose for signal listeners
  'tempots/no-redundant-listener-disposal': 'warn',
  // Warn about mapping signals to renderables
  'tempots/no-renderable-signal-map': 'warn',
  // Warn about empty Fragment() usage
  'tempots/no-empty-fragment': 'warn',
  // Warn about Fragment() with a single child
  'tempots/no-single-child-fragment': 'warn',
}

// Rules that require type-checked linting (parserOptions.projectService)
const typeCheckedRules = {
  // Error on passing Tempo methods by reference (loses `this` binding)
  'tempots/no-method-reference': 'error',
}

// Strict: all recommended rules elevated to error
const strictRules = Object.fromEntries(
  Object.keys(recommendedRules).map((key) => [key, 'error'])
)

const plugin = {
  rules: {
    'no-module-level-signals': noModuleLevelSignals,
    'no-unnecessary-disposal': noUnnecessaryDisposal,
    'require-untracked-disposal': requireUntrackedDisposal,
    'require-async-signal-disposal': requireAsyncSignalDisposal,
    'no-signal-reassignment': noSignalReassignment,
    'prefer-const-signals': preferConstSignals,
    'no-redundant-listener-disposal': noRedundantListenerDisposal,
    'no-renderable-signal-map': noRenderableSignalMap,
    'no-empty-fragment': noEmptyFragment,
    'no-single-child-fragment': noSingleChildFragment,
    'no-method-reference': noMethodReference,
  },
  configs: {
    recommended: recommendedRules,
  },
}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        tempots: plugin,
      },
      rules: recommendedRules,
    },
    // Recommended + type-checked rules
    recommendedTypeChecked: {
      plugins: {
        tempots: plugin,
      },
      rules: { ...recommendedRules, ...typeCheckedRules },
    },
    // Strict: all base rules at error level
    strict: {
      plugins: {
        tempots: plugin,
      },
      rules: strictRules,
    },
    // Strict + type-checked rules
    strictTypeChecked: {
      plugins: {
        tempots: plugin,
      },
      rules: { ...strictRules, ...typeCheckedRules },
    },
  },
}
