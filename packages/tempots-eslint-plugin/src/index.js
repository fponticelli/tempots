import requireSignalDisposal from './rules/require-signal-disposal.js'
import noModuleLevelSignals from './rules/no-module-level-signals.js'
import noUnnecessaryDisposal from './rules/no-unnecessary-disposal.js'
import requireUntrackedDisposal from './rules/require-untracked-disposal.js'
import requireAsyncSignalDisposal from './rules/require-async-signal-disposal.js'
import noSignalReassignment from './rules/no-signal-reassignment.js'
import preferConstSignals from './rules/prefer-const-signals.js'

const plugin = {
  rules: {
    // DEPRECATED: Signals are now automatically disposed in @tempots/dom >= 1.0.0
    // This rule is kept for backward compatibility but will be removed in a future version
    'require-signal-disposal': requireSignalDisposal,

    // Recommended rules for automatic signal disposal era
    'no-module-level-signals': noModuleLevelSignals,
    'no-unnecessary-disposal': noUnnecessaryDisposal,
    'require-untracked-disposal': requireUntrackedDisposal,
    'require-async-signal-disposal': requireAsyncSignalDisposal,
    'no-signal-reassignment': noSignalReassignment,
    'prefer-const-signals': preferConstSignals,
  },
}

export default {
  ...plugin,
  configs: {
    recommended: {
      plugins: {
        tempots: plugin,
      },
      rules: {
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
      },
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
      },
    },
    // Legacy config for backward compatibility
    legacy: {
      plugins: {
        tempots: plugin,
      },
      rules: {
        'tempots/require-signal-disposal': 'warn',
      },
    },
  },
}
