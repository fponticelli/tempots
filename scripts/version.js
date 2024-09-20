const path = require('path')
const { execSync } = require('child_process')

function getVersion(packagePath) {
  return require(packagePath).version
}

function incrementVersion(version, type) {
  const parts = version.split('.')
  switch (type) {
    case 'major':
      return `${Number(parts[0]) + 1}.0.0`
    case 'minor':
      return `${parts[0]}.${Number(parts[1]) + 1}.0`
    case 'patch':
      return `${parts[0]}.${parts[1]}.${Number(parts[2]) + 1}`
    case 'next':
      if (parts.length === 3) {
        return `${parts[0]}.${parts[1]}.${parts[2]}-next.0`
      } else {
        const v = Number(parts[3].split('-')[0]) + 1
        return `${parts[0]}.${parts[1]}.${parts[2]}.${v}`
      }
  }
}

function saveVersion(packagePath, version, other = {}) {
  const json = {
    ...require(packagePath),
    ...other,
    version,
  }
  require('fs').writeFileSync(packagePath, JSON.stringify(json, null, 2))
}

function updateLibVersion(packageDir, type) {
  const packagePath = path.join(packageDir, 'package.json')
  const publishPackagePath = path.join(packageDir, 'package.lib.json')
  const version = getVersion(packagePath)
  const newVersion = incrementVersion(version, type)
  const peerDependencies = getLibDependencies(packagePath)
  saveVersion(packagePath, newVersion)
  saveVersion(publishPackagePath, newVersion, { peerDependencies })
  return newVersion
}

function updateDependencies(newVersion, libName, packageDir) {
  const packagePath = path.join(packageDir, 'package.lib.json')
  let json = require(packagePath)
  for (const key in json.peerDependencies) {
    if (key === libName) {
      json.peerDependencies[key] = newVersion
    }
  }
  require('fs').writeFileSync(packagePath, JSON.stringify(json, null, 2))
}

function publishToNpm(packageDir) {
  const version = getVersion(path.join(packageDir, 'package.json'))
  const args = ['--access public']
  const newVersion = `--new-version ${version.trim()}`
  args.push(newVersion)
  if(version.includes('next')){
    args.push('--tag next')
  } 

  const publishCommand = `yarn publish dist ${args.join(' ')}`
  execSync(publishCommand, { stdio: 'inherit' })
}

function getLibDependencies(packagePath) {
  const dependencies = require(packagePath).peerDependencies
  for (const dependency in dependencies) {
    const p = dependency.replace(/@tempots\//, 'tempots-')
    if (!p) continue
    const jsonPath = path.join(packagePath, '../..', p, 'package.json')
    const version = getVersion(jsonPath)
    dependencies[dependency] = version
  }
  return dependencies
}

module.exports = { updateLibVersion, updateDependencies, publishToNpm }
