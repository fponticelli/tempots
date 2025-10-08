# Repository Guidelines

## Project Structure & Module Organization
Tempo is a pnpm workspace orchestrated by Turbo. Primary source lives under `packages/`:
- `tempots-dom` for the DOM runtime and reactive core
- `tempots-std` for standard signal utilities
- `tempots-ui` for composable UI widgets
Demos in `demo/` (e.g., `counter`, `todomvc`, `7guis`, `hnpwa`) support manual validation. Documentation resides in `apps/docs`. Shared tooling sits in `scripts/`. Generated outputs (such as `dist/` or `docs/`) are build artefacts—never edit them in place.

## Build, Test, and Development Commands
Use pnpm 9+. `pnpm install` bootstraps all workspaces. `pnpm build` compiles every package; prefer `pnpm build:demos` for demo-only checks and `pnpm build:watch` while iterating. `pnpm test`, `pnpm test:watch`, and `pnpm test:coverage` run the Vitest suite. `pnpm lint`, `pnpm format`, and `pnpm typecheck` keep ESLint, Prettier, and TypeScript happy; `pnpm check` chains them with the build. Regenerate documentation with `pnpm docs`.

## Coding Style & Naming Conventions
Write strict TypeScript, keeping source in `src/` and tests in `test/`. Follow the project defaults: 2-space indentation, single quotes, trailing commas. Run `pnpm format` before committing. Leverage ESLint autofix where possible. Equality helpers follow the established vocabulary—modules named `*equal*`, callback parameters `*equals`, and documentation references `equality`. Exported types/interfaces use PascalCase, functions camelCase, and file names kebab-case.

## Testing Guidelines
Vitest powers the unit suite; mirror `src/` layouts under `test/` using filenames like `signal.spec.ts`. Aim for ≥80% statements and ≥75% branches as tracked in `COVERAGE.md`. Use `pnpm test:coverage` to confirm metrics. Exercise new behaviour through the demos (`pnpm --filter demo/<name> dev`) and update `TESTING_GUIDELINES.md` when introducing novel patterns.

## Commit & Pull Request Guidelines
Commits follow Conventional Commits (e.g., `feat(tempots-dom): add async effect`). Keep scopes aligned with package names for clarity. Before pushing, ensure `pnpm check` passes and docs are regenerated when API surface changes. Pull requests need a concise summary, links to issues, and screenshots or screen recordings for UI work. Highlight breaking changes explicitly and ping maintainers when adjustments touch publishing scripts or release automation.
