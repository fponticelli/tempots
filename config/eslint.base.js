import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

/**
 * Creates the base ESLint configuration for Tempo packages.
 *
 * @param {object} options - Configuration options
 * @param {string} options.tsconfigRootDir - The root directory for tsconfig.json
 * @param {boolean} [options.useTempotsPlugin=true] - Whether to use the Tempo ESLint plugin
 * @returns {import('typescript-eslint').ConfigArray} ESLint configuration
 */
export function createBaseConfig({ tsconfigRootDir, useTempotsPlugin = true }) {
  const configs = [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
  ];

  // Add Tempo plugin if requested
  if (useTempotsPlugin) {
    // Dynamic import to avoid circular dependencies
    const tempotsPluginPath = new URL(
      '../packages/tempots-eslint-plugin/src/index.js',
      import.meta.url
    ).pathname;
    // Note: This will be imported by the consuming package
    configs.push({
      name: 'tempots-plugin-placeholder',
      // Packages should add: tempots.configs.recommended
    });
  }

  // Common ignores
  configs.push({
    ignores: [
      '*.js',
      '*.mjs',
      'jest.config.ts',
      'test/**/*.ts',
      '*.config.js',
      '**/*.config.js',
      'demo/*/dist/',
      'dist/',
      'scripts/',
    ],
  });

  return tseslint.config(...configs);
}

/**
 * Creates ESLint configuration for a Tempo package.
 *
 * @param {string} dirname - The __dirname or import.meta.dirname of the package
 * @param {object} [options] - Additional options
 * @param {boolean} [options.useTempotsPlugin=true] - Whether to use the Tempo ESLint plugin
 * @returns {import('typescript-eslint').ConfigArray} ESLint configuration
 */
export function createPackageConfig(dirname, options = {}) {
  return createBaseConfig({
    tsconfigRootDir: dirname,
    ...options,
  });
}

