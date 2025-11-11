# Publishing Scripts

This directory contains scripts for managing package versions and publishing to npm.

## Scripts

### `publish-all.js`

Interactive script for publishing multiple packages in the correct dependency order.

**Usage:**
```bash
pnpm publish:all
```

**Features:**
- Prompts for version bump type (patch/minor/major/next) for each package
- Shows a summary of all changes before proceeding
- Updates versions in both `package.json` and `package.lib.json`
- Automatically updates `peerDependencies` to reference new versions
- Builds and publishes packages in dependency order
- Stops on any build or publish failure

**Package Order:**
1. `@tempots/core` (no dependencies)
2. `@tempots/std` (no dependencies)
3. `@tempots/dom` (depends on core)
4. `@tempots/ui` (depends on dom and std)
5. `@tempots/eslint-plugin` (no dependencies)

### `version.js`

Utility functions for version management and publishing.

**Exported Functions:**
- `getVersion(packagePath)` - Get version from package.json
- `incrementVersion(version, type)` - Increment version (patch/minor/major/next)
- `updateLibVersion(packageDir, type)` - Update package and lib versions
- `prepareVersionUpdate(packageDir, type)` - Prepare version update (stores in temp file)
- `applyVersionUpdate(packageDir)` - Apply prepared version update
- `updateDependencies(newVersion, libName, packageDir)` - Update dependencies in package.lib.json
- `publishToNpm(packageDir)` - Publish package to npm with confirmation

**Used by:**
- Individual package publish scripts (`scripts/make.cjs` in each package)
- `publish-all.js` for batch publishing

### `package-make.cjs`

Wrapper script used by individual packages to access version management functions.

**Location:** Each package has `scripts/make.cjs` that imports from `../../../scripts/package-make.cjs`

**Exports:**
- `update(mode)` - Prepare version update (patch/minor/major/next)
- `publish()` - Publish package to npm

## Dependency Management

The scripts automatically manage `@tempots/*` package dependencies:

1. **Version Updates:** When a package version is updated, the change is reflected in both:
   - `package.json` (workspace version)
   - `package.lib.json` (published version)

2. **Peer Dependency Updates:** When a package is published, any packages that list it in `peerDependencies` have their `package.lib.json` updated with the new version.

3. **Dependency Order:** Packages are always processed in dependency order to ensure dependencies are published before dependents.

## Example Workflow

### Publishing Multiple Packages

```bash
# Run interactive publish script
pnpm publish:all

# For each package, choose:
# 1 = patch (0.1.0 → 0.1.1)
# 2 = minor (0.1.0 → 0.2.0)
# 3 = major (0.1.0 → 1.0.0)
# 4 = next  (0.1.0 → 0.1.0-next.0)
# 5 = skip

# Review summary and confirm
# Script builds and publishes all selected packages
```

### Publishing Single Package

```bash
cd packages/tempots-core

# Patch version
pnpm npm:publish

# Minor version
pnpm npm:publish:minor

# Major version
pnpm npm:publish:major

# Next (pre-release) version
pnpm npm:publish:next
```

### Publishing Package + Dependents

```bash
# Publish core + dom
cd packages/tempots-core
pnpm npm:publish-all

# Publish dom + ui
cd packages/tempots-dom
pnpm npm:publish-all
```

## How It Works

### Version Update Flow

1. **Prepare:** Version update info is stored in `.temp-version-update` file
2. **Build:** Package is built with the new version
3. **Apply:** Version is written to `package.json` and `package.lib.json`
4. **Update Deps:** Peer dependencies in dependent packages are updated
5. **Publish:** Package is published to npm from the `dist/` directory

### Confirmation Prompts

All publish operations include confirmation prompts that show:
- Package name
- Old version
- New version
- Option to proceed or cancel (default: proceed)

This prevents accidental publishes and gives you a chance to review changes.

## Files Modified During Publishing

For each package being published:

- `package.json` - Version updated
- `package.lib.json` - Version and peerDependencies updated
- `dist/package.json` - Copy of `package.lib.json` with updated version
- `dist/README.md` - Copy of package README

For dependent packages:

- `package.lib.json` - peerDependencies updated to reference new versions

## Troubleshooting

### Script Fails to Load

Ensure you're running from the repository root:
```bash
cd /path/to/tempo
pnpm publish:all
```

### Build Failures

If a build fails:
1. Fix the build issue in the package
2. Re-run the publish script
3. The script will prompt again for all packages

### Publish Failures

Common causes:
- Not logged into npm: `npm login`
- Insufficient permissions: Check npm package access
- Version already exists: Choose a different version bump

### Version Conflicts

If versions get out of sync:
1. Manually edit `package.json` and `package.lib.json`
2. Update `peerDependencies` in dependent packages
3. Run `pnpm build` to rebuild
4. Re-run publish script

## Adding New Packages

To add a new package to the publishing system:

1. **Add to `publish-all.js`:**
   ```javascript
   {
     name: '@tempots/new-package',
     dir: 'packages/tempots-new-package',
     priority: 5, // Set based on dependency order
     dependencies: ['@tempots/core'] // List @tempots/* dependencies
   }
   ```

2. **Create `scripts/make.cjs` in the package:**
   ```javascript
   module.exports = require('../../../scripts/package-make.cjs')
   ```

3. **Add publish scripts to `package.json`:**
   ```json
   {
     "scripts": {
       "package:patch": "node -e 'require(\"./scripts/make.cjs\").update(\"patch\")'",
       "package:minor": "node -e 'require(\"./scripts/make.cjs\").update(\"minor\")'",
       "package:major": "node -e 'require(\"./scripts/make.cjs\").update(\"major\")'",
       "package:next": "node -e 'require(\"./scripts/make.cjs\").update(\"next\")'",
       "npm:publish:impl": "node -e 'require(\"./scripts/make.cjs\").publish()'",
       "npm:publish": "pnpm package:patch && pnpm npm:publish:impl",
       "npm:publish:minor": "pnpm package:minor && pnpm npm:publish:impl",
       "npm:publish:major": "pnpm package:major && pnpm npm:publish:impl",
       "npm:publish:next": "pnpm package:next && pnpm npm:publish:impl"
     }
   }
   ```

4. **Create `package.lib.json`** with the published package configuration

5. **Add `peerDependencies`** in `package.lib.json` for any `@tempots/*` dependencies

