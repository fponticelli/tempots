const { updateLibVersion, publishToNpm } = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  const newVersion = updateLibVersion(cwd, mode)
  return newVersion
}

function publish() {
  const cwd = process.cwd()
  publishToNpm(cwd)
}

module.exports = { update, publish }
