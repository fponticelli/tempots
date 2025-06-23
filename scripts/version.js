const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

function getVersion(packagePath) {
  // Clear the require cache to ensure we get the latest version
  const absolutePath = require.resolve(packagePath)
  delete require.cache[absolutePath]
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
      if (version.includes('-next.')) {
        // Next version like 1.0.0-next.0 -> 1.0.0-next.1
        const [baseVersion, nextPart] = version.split('-next.')
        const nextNumber = Number(nextPart) + 1
        return `${baseVersion}-next.${nextNumber}`
      } else if (parts.length === 3) {
        // Standard version like 1.0.0 -> 1.0.0-next.0
        return `${parts[0]}.${parts[1]}.${parts[2]}-next.0`
      } else {
        // Fallback: treat as patch increment for other pre-release formats
        const patchPart = parts[2].split('-')[0] // Extract just the patch number before any pre-release suffix
        return `${parts[0]}.${parts[1]}.${Number(patchPart) + 1}`
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

function prepareVersionUpdate(packageDir, type) {
  const packagePath = path.join(packageDir, 'package.json')
  const oldVersion = getVersion(packagePath)
  const newVersion = incrementVersion(oldVersion, type)

  // Store version update info for later use
  const versionUpdateFile = path.join(packageDir, '.temp-version-update')
  const updateInfo = {
    oldVersion,
    newVersion,
    type,
    packageDir
  }
  require('fs').writeFileSync(versionUpdateFile, JSON.stringify(updateInfo, null, 2))

  return { oldVersion, newVersion }
}

function applyVersionUpdate(packageDir) {
  const versionUpdateFile = path.join(packageDir, '.temp-version-update')

  try {
    const updateInfo = JSON.parse(require('fs').readFileSync(versionUpdateFile, 'utf8'))
    const { newVersion } = updateInfo

    // Now actually update the versions
    const packagePath = path.join(packageDir, 'package.json')
    const publishPackagePath = path.join(packageDir, 'package.lib.json')
    const peerDependencies = getLibDependencies(packagePath)

    saveVersion(packagePath, newVersion)
    saveVersion(publishPackagePath, newVersion, { peerDependencies })

    // Update dependencies in other packages if needed
    if (packageDir.includes('tempots-std')) {
      const dependencies = ['tempots-ui'].map(name => path.join(packageDir, `../${name}`))
      for(const dep of dependencies) {
        updateDependencies(newVersion, '@tempots/std', dep)
      }
    } else if (packageDir.includes('tempots-dom')) {
      const dependencies = ['tempots-ui'].map(name => path.join(packageDir, `../${name}`))
      for(const dep of dependencies) {
        updateDependencies(newVersion, '@tempots/dom', dep)
      }
    }

    // Clean up the temp file
    require('fs').unlinkSync(versionUpdateFile)

    return updateInfo
  } catch (error) {
    throw new Error(`Failed to apply version update: ${error.message}`)
  }
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

    // Find the git repository root
    const gitRoot = execSync('git rev-parse --show-toplevel', {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: packageDir
    }).trim()

    // Get the relative path from git root to package.json
    const relativePath = path.relative(gitRoot, packageJsonPath)
    const gitCommand = `git show HEAD:${relativePath}`

    const oldPackageJson = execSync(gitCommand, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: gitRoot
    })
    return JSON.parse(oldPackageJson).version
  } catch (error) {
    // If we can't get the old version from git, return null
    return null
  }
}

async function publishToNpm(packageDir, oldVersion = null) {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const packageJson = require(packageJsonPath)
  const packageName = packageJson.name

  // Check if we have a pending version update
  const versionUpdateFile = path.join(packageDir, '.temp-version-update')
  let versionInfo = null
  let currentVersion = getVersion(packageJsonPath)

  try {
    const updateInfoRaw = require('fs').readFileSync(versionUpdateFile, 'utf8')
    versionInfo = JSON.parse(updateInfoRaw)
  } catch (error) {
    // No pending version update, use current version
  }

  // Determine old and new versions for confirmation
  let oldVersionToShow = oldVersion
  let newVersionToShow = currentVersion

  if (versionInfo) {
    // We have a pending version update
    oldVersionToShow = versionInfo.oldVersion
    newVersionToShow = versionInfo.newVersion
  } else {
    // Try to get old version from various sources (in priority order)
    if (!oldVersionToShow) {
      // First priority: Try to get from a temporary file we might have created
      const tempVersionFile = path.join(packageDir, '.temp-old-version')
      try {
        oldVersionToShow = require('fs').readFileSync(tempVersionFile, 'utf8').trim()
        // Clean up the temp file
        require('fs').unlinkSync(tempVersionFile)
      } catch (error) {
        // Second priority: Try to get from git
        oldVersionToShow = getOldVersionFromGit(packageDir)
      }
    }
    if (!oldVersionToShow) {
      // If all else fails, show current version as old version (not ideal but better than nothing)
      oldVersionToShow = currentVersion
    }
  }

  // Show confirmation dialog
  const shouldProceed = await confirmPublish(packageName, oldVersionToShow, newVersionToShow)
  if (!shouldProceed) {
    // Clean up any pending version update files
    try {
      require('fs').unlinkSync(versionUpdateFile)
    } catch (error) {
      // File might not exist, that's ok
    }
    console.log('❌ Publishing cancelled. No changes were made.')
    process.exit(1)
  }

  // If we have a pending version update, apply it now
  if (versionInfo) {
    console.log('📝 Applying version update...')
    applyVersionUpdate(packageDir)
    // Refresh the version after update
    currentVersion = getVersion(packageJsonPath)

    // Rebuild the package with the new version
    console.log('🔨 Rebuilding package with updated version...')
    const { execSync } = require('child_process')
    execSync('pnpm build', { cwd: packageDir, stdio: 'inherit' })
    execSync('cp README.md dist', { cwd: packageDir, stdio: 'inherit' })
  }

  const args = ['--access public', '--no-git-checks']
  if(currentVersion.includes('next')){
    args.push('--tag next')
  }

  console.log('\n🚀 Publishing with args:', args.join(' '))

  const publishCommand = `pnpm publish dist ${args.join(' ')}`
  execSync(publishCommand, { stdio: 'inherit' })

  console.log(`✅ Successfully published ${packageName}@${currentVersion}`)
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

module.exports = { updateLibVersion, updateDependencies, publishToNpm, prepareVersionUpdate, applyVersionUpdate, incrementVersion }
