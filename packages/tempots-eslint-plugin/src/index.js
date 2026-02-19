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

// Default recommended rules configuration
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
  // Error on passing Tempo methods by reference (loses `this` binding)
  'tempots/no-method-reference': 'error',
}

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
    // Strict config for maximum safety
    strict: {
      plugins: {
        tempots: plugin,
      },
      rules: {
        'tempots/no-module-level-signals': 'error',
        'tempots/no-unnecessary-disposal': 'error',
        'tempots/require-untracked-disposal': 'error',
        'tempots/require-async-signal-disposal': 'error',
        'tempots/no-signal-reassignment': 'error',
        'tempots/prefer-const-signals': 'error',
        'tempots/no-redundant-listener-disposal': 'error',
        'tempots/no-renderable-signal-map': 'error',
        'tempots/no-empty-fragment': 'error',
        'tempots/no-single-child-fragment': 'error',
        'tempots/no-method-reference': 'error',
      },
    },
  },
}
