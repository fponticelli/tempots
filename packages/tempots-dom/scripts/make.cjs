const {
  updateDependencies,
  updateLibVersion,
  publishToNpm
} = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  const newVersion = updateLibVersion(cwd, mode)
  const dependencies = ['tempots-ui'].map(name => path.join(cwd, `../${name}`))
  for(const dep of dependencies) {
    updateDependencies(newVersion, '@tempots/dom', dep)
  }
  return newVersion
}

function publish() {
  const cwd = process.cwd()
  publishToNpm(cwd)
}

module.exports = { update, publish }
