# Publish Confirmation Feature

The publish scripts now include an optional confirmation step that shows the old and new version before publishing.

## How it works

When you run any of the publish commands (e.g., `pnpm npm:publish`, `pnpm npm:publish:minor`), the system will:

1. **Show package information**: Display the package name, old version, and new version
2. **Ask for confirmation**: Prompt you to confirm the publish operation
3. **Default to "Yes"**: Simply pressing Enter will proceed with publishing
4. **Allow cancellation**: Typing "n", "no", or any other response will cancel

## Example output

```
📦 Publishing Package
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Package: @tempots/dom
Old version: 4.0.2
New version: 4.0.3
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Do you want to proceed with publishing? (Y/n):
```

## Skipping confirmation

You can skip the confirmation in two ways:

### 1. Environment variable
```bash
SKIP_PUBLISH_CONFIRM=true pnpm npm:publish
```

### 2. Command line flag
```bash
pnpm npm:publish --no-confirm
```

## How version detection works

The system tries to detect the old version in this priority order:

1. **From temporary file**: Created during the version update process (highest priority)
2. **From Git**: Retrieves the previous version from the last commit (fallback)
3. **Fallback**: Uses the current version (not ideal, but prevents errors)

The temporary file approach ensures accuracy when using the standard publish workflow (`npm:publish`, `npm:publish:minor`, etc.) since it captures the exact version before the update.

## Integration with existing workflows

All existing publish commands work exactly the same way:

- `pnpm npm:publish` (patch)
- `pnpm npm:publish:minor`
- `pnpm npm:publish:major`
- `pnpm npm:publish:next`
- `pnpm npm:publish-all` (publishes multiple packages)

The confirmation is shown for each package being published.

## Testing

You can test the confirmation feature without actually publishing by running:

```bash
node test-publish-confirmation.js
```

This creates a temporary package structure and tests the confirmation dialog.
