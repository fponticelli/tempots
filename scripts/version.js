const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

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
  const oldVersion = getVersion(packagePath)
  const newVersion = incrementVersion(oldVersion, type)
  const peerDependencies = getLibDependencies(packagePath)

  // Store old version in a temporary file for later use during publishing
  const tempVersionFile = path.join(packageDir, '.temp-old-version')
  require('fs').writeFileSync(tempVersionFile, oldVersion)

  saveVersion(packagePath, newVersion)
  saveVersion(publishPackagePath, newVersion, { peerDependencies })
  return { oldVersion, newVersion }
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

async function confirmPublish(packageName, oldVersion, newVersion) {
  // Check for skip confirmation flag
  if (process.env.SKIP_PUBLISH_CONFIRM === 'true' || process.argv.includes('--no-confirm')) {
    return true
  }

  console.log('\n📦 Publishing Package')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Package: ${packageName}`)
  console.log(`Old version: ${oldVersion}`)
  console.log(`New version: ${newVersion}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question('Do you want to proceed with publishing? (Y/n): ', (answer) => {
      rl.close()
      const shouldProceed = answer.toLowerCase() === '' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes'
      if (!shouldProceed) {
        console.log('❌ Publishing cancelled.')
      }
      resolve(shouldProceed)
    })
  })
}

function getOldVersionFromGit(packageDir) {
  try {
    const packageJsonPath = path.join(packageDir, 'package.json')
    const relativePath = path.relative(process.cwd(), packageJsonPath)
    const gitCommand = `git show HEAD:${relativePath}`
    const oldPackageJson = execSync(gitCommand, { encoding: 'utf8', stdio: 'pipe' })
    return JSON.parse(oldPackageJson).version
  } catch (error) {
    // If we can't get the old version from git, return null
    return null
  }
}

async function publishToNpm(packageDir, oldVersion = null) {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const version = getVersion(packageJsonPath)
  const packageJson = require(packageJsonPath)
  const packageName = packageJson.name

  // Try to get old version from various sources
  let versionToShow = oldVersion
  if (!versionToShow) {
    // Try to get from git
    versionToShow = getOldVersionFromGit(packageDir)
  }
  if (!versionToShow) {
    // Try to get from a temporary file we might have created
    const tempVersionFile = path.join(packageDir, '.temp-old-version')
    try {
      versionToShow = require('fs').readFileSync(tempVersionFile, 'utf8').trim()
      // Clean up the temp file
      require('fs').unlinkSync(tempVersionFile)
    } catch (error) {
      // If all else fails, show current version as old version (not ideal but better than nothing)
      versionToShow = version
    }
  }

  // Show confirmation dialog
  const shouldProceed = await confirmPublish(packageName, versionToShow, version)
  if (!shouldProceed) {
    process.exit(1)
  }

  const args = ['--access public', '--no-git-checks']
  if(version.includes('next')){
    args.push('--tag next')
  }

  console.log('\n🚀 Publishing with args:', args.join(' '))

  const publishCommand = `pnpm publish dist ${args.join(' ')}`
  execSync(publishCommand, { stdio: 'inherit' })

  console.log(`✅ Successfully published ${packageName}@${version}`)
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
