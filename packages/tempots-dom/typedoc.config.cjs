/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPointStrategy: 'expand',
  entryPoints: ['src/index.ts'],
  out: './docs',
  categoryOrder: ['Signals', 'Signal Implementation', '*'],
  plugin: ['typedoc-plugin-mdn-links'],
  sort: ['alphabetical-ignoring-documents'],
  categorizeByGroup: true,
}
