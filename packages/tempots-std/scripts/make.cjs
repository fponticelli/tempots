const {
  prepareVersionUpdate,
  publishToNpm
} = require('../../../scripts/version')

function update(mode) {
  const cwd = process.cwd()
  return prepareVersionUpdate(cwd, mode)
}

async function publish() {
  const cwd = process.cwd()
  await publishToNpm(cwd)
}

module.exports = { update, publish }
