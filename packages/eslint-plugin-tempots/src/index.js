import requireSignalDisposal from './rules/require-signal-disposal.js'

export default {
  rules: {
    'require-signal-disposal': requireSignalDisposal,
  },
  configs: {
    recommended: {
      plugins: ['tempots'],
      rules: {
        'tempots/require-signal-disposal': 'warn',
      },
    },
    strict: {
      plugins: ['tempots'],
      rules: {
        'tempots/require-signal-disposal': 'error',
      },
    },
  },
}
