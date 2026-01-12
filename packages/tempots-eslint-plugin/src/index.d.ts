import type { ESLint, Linter } from 'eslint'

export interface TempoTSPlugin extends ESLint.Plugin {
  rules: {
    'no-module-level-signals': Linter.RuleModule
    'no-unnecessary-disposal': Linter.RuleModule
    'require-untracked-disposal': Linter.RuleModule
    'require-async-signal-disposal': Linter.RuleModule
    'no-signal-reassignment': Linter.RuleModule
    'prefer-const-signals': Linter.RuleModule
    'no-redundant-listener-disposal': Linter.RuleModule
    'no-renderable-signal-map': Linter.RuleModule
    'no-empty-fragment': Linter.RuleModule
    'no-single-child-fragment': Linter.RuleModule
  }
  configs: {
    recommended: Linter.RulesRecord
  }
}

export interface TempoTSPluginExport extends TempoTSPlugin {
  configs: {
    recommended: Linter.Config
    strict: Linter.Config
  }
}

declare const plugin: TempoTSPluginExport
export default plugin
