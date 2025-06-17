const path = require('path')
const {
  updateLibVersion,
  publishToNpm,
  updateDependencies
} = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  const versionInfo = updateLibVersion(cwd, mode)
  const newVersion = versionInfo.newVersion
  const dependencies = ['tempots-ui'].map(name => path.join(cwd, `../${name}`))
  for(const dep of dependencies) {
    updateDependencies(newVersion, '@tempots/dom', dep)
  }
  return versionInfo
}

async function publish() {
  const cwd = process.cwd()
  await publishToNpm(cwd)
}

module.exports = { update, publish }
