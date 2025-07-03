# Test Coverage Report

This document provides an overview of test coverage across all packages in the Tempo-ts monorepo.

## Coverage Badges

[![codecov](https://codecov.io/gh/fponticelli/tempots/branch/main/graph/badge.svg)](https://codecov.io/gh/fponticelli/tempots)

### Package-specific Coverage

| Package | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| @tempots/std | ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) | ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) | ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) | ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen) |
| @tempots/dom | ![Coverage](https://img.shields.io/badge/coverage-68%25-yellow) | ![Coverage](https://img.shields.io/badge/coverage-85%25-green) | ![Coverage](https://img.shields.io/badge/coverage-70%25-yellow) | ![Coverage](https://img.shields.io/badge/coverage-68%25-yellow) |
| @tempots/ui | ![Coverage](https://img.shields.io/badge/coverage-19%25-red) | ![Coverage](https://img.shields.io/badge/coverage-68%25-yellow) | ![Coverage](https://img.shields.io/badge/coverage-47%25-red) | ![Coverage](https://img.shields.io/badge/coverage-19%25-red) |

## Coverage Goals

### Current Status
- **@tempots/std**: ✅ **100%** coverage (excellent!)
- **@tempots/dom**: ⚠️ **68%** coverage (needs improvement)
- **@tempots/ui**: ❌ **19%** coverage (requires significant work)

### Target Thresholds
All packages are configured with the following minimum coverage thresholds:
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## Coverage Configuration

### Vite Configuration
Each package includes comprehensive coverage configuration in `vite.config.js`:

```javascript
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'],
  reportsDirectory: './coverage',
  exclude: [
    ...configDefaults.coverage.exclude,
    'src/types/**',
    'src/vite-env.d.ts',
    'scripts/**',
    'dist/**',
    'docs/**',
    '**/*.d.ts',
    'vite.config.js',
    'eslint.config.js'
  ],
  thresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  },
  all: true,
  skipFull: false
}
```

### CI Integration
Coverage is automatically checked in CI/CD pipeline:
- Tests run with coverage on every PR and push to main
- Coverage reports are uploaded to Codecov
- PR comments show coverage changes
- Builds fail if coverage drops below thresholds

## Running Coverage Locally

### All Packages
```bash
pnpm test:coverage
```

### Individual Packages
```bash
# Standard library
pnpm --filter @tempots/std test:coverage

# DOM library
pnpm --filter @tempots/dom test:coverage

# UI library
pnpm --filter @tempots/ui test:coverage
```

## Coverage Reports

Coverage reports are generated in multiple formats:
- **HTML**: `packages/*/coverage/index.html` (interactive browser view)
- **JSON**: `packages/*/coverage/coverage-final.json` (machine-readable)
- **LCOV**: `packages/*/coverage/lcov.info` (for CI tools)
- **Text**: Console output during test runs

## Testing Guidelines

### Writing Effective Tests
1. **Focus on behavior**: Test what the code does, not how it does it
2. **Cover edge cases**: Test boundary conditions and error scenarios
3. **Test async operations**: Ensure proper handling of promises and signals
4. **Mock external dependencies**: Use mocks for browser APIs and external services
5. **Test cleanup**: Verify proper disposal of resources and event listeners

### Test Patterns
- Use `render()` function for DOM testing
- Test signal reactivity and updates
- Verify event handler registration and cleanup
- Test error boundaries and fallback behavior
- Include integration tests for complex interactions

### Coverage Exclusions
Use coverage exclusion comments for unreachable code:
```javascript
/* c8 ignore next */
if (process.env.NODE_ENV === 'development') {
  // Development-only code
}
```

## Maintenance

### Regular Tasks
1. **Monitor coverage trends**: Check for coverage regressions in PRs
2. **Update thresholds**: Gradually increase thresholds as coverage improves
3. **Review uncovered code**: Identify and test critical uncovered paths
4. **Refactor tests**: Keep tests maintainable and focused

### Coverage Improvement Strategy
1. **Identify low-coverage files**: Use coverage reports to find gaps
2. **Prioritize critical paths**: Focus on core functionality first
3. **Add missing tests**: Create comprehensive test suites for uncovered code
4. **Improve existing tests**: Enhance tests to cover more branches and edge cases
5. **Integration testing**: Add tests for cross-component interactions

## Resources

- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage.html)
- [Codecov Documentation](https://docs.codecov.com/)
- [Testing Best Practices](./CONTRIBUTING.md#testing)
