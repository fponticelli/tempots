const {
  updateDependencies,
  updateLibVersion,
  publishToNpm
} = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  return updateLibVersion(cwd, mode)
}

function publish() {
  const cwd = process.cwd()
  publishToNpm(cwd)
}

module.exports = { update, publish }
