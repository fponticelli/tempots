import requireSignalDisposal from './rules/require-signal-disposal.js'
import noModuleLevelSignals from './rules/no-module-level-signals.js'

export default {
  rules: {
    // DEPRECATED: Signals are now automatically disposed in @tempots/dom >= 1.0.0
    // This rule is kept for backward compatibility but will be removed in a future version
    'require-signal-disposal': requireSignalDisposal,

    // Recommended: Warn about signals created at module level
    'no-module-level-signals': noModuleLevelSignals,
  },
  configs: {
    recommended: {
      plugins: ['tempots'],
      rules: {
        // New recommended rule for automatic signal disposal
        'tempots/no-module-level-signals': 'warn',
      },
    },
    // Legacy config for backward compatibility
    legacy: {
      plugins: ['tempots'],
      rules: {
        'tempots/require-signal-disposal': 'warn',
      },
    },
  },
}
