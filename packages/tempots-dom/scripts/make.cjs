const {
  updateDependencies,
  updateLibVersion,
  publishToNpm
} = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  const newVersion = updateLibVersion(cwd, mode)
  console.log('newVersion', newVersion)
  const tempoSSR = path.join(cwd, '../tempots-ssr')
  updateDependencies(newVersion, '@tempots/dom', tempoSSR)
  return newVersion
}

function publish() {
  const cwd = process.cwd()
  publishToNpm(cwd)
}

module.exports = { update, publish }
