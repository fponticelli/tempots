# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages (turbo)
pnpm test             # Run all tests (turbo)
pnpm lint             # Run ESLint across packages
pnpm typecheck        # Run TypeScript type checking
pnpm format           # Format code with Prettier
pnpm check            # Run lint, typecheck, build, and test:coverage
```

### Package-specific commands

```bash
# Run tests for a specific package
pnpm --filter @tempots/dom test

# Run a single test file
pnpm --filter @tempots/dom exec vitest run test/signal.spec.ts

# Watch mode for tests
pnpm --filter @tempots/dom exec vitest

# Build a single package
pnpm --filter @tempots/dom build
```

## Architecture

Tempo is a **reactive UI framework** built on fine-grained Signals with zero external runtime dependencies. It supports multiple rendering targets (DOM, Native iOS/Android) through a platform-agnostic render layer.

### Package Dependency Graph (build order)

```
@tempots/core          (priority 1) - Signals, Prop, Computed, DisposalScope
      |
@tempots/render        (priority 1.5) - platform-agnostic renderables
      |
  +---+--------+
  |            |
@tempots/dom  @tempots/native   (priority 2) - platform implementations
  |
@tempots/ui            (priority 3) - higher-level UI components
```

Additional packages:
- `@tempots/std` — standard library (independent, no framework deps)
- `@tempots/server` — SSR utilities (depends on core + dom)
- `@tempots/client` — hydration utilities (depends on core + dom)
- `@tempots/vite` — Vite plugin for SSR/SSG/Islands/HMR (depends on dom + server)
- `@tempots/eslint-plugin` — signal disposal linting (independent, published from src)

### Monorepo Structure

```
packages/       # 10 framework packages
apps/           # Documentation site, iOS demos
demo/           # Example apps (counter, 7guis, todomvc, hnpwa, ssr-demo)
config/         # Shared tsconfig, eslint, api-extractor configs
```

### Workspace Layout

- **pnpm workspaces** with Turborepo orchestration
- Package manager: pnpm 9.15.9
- Build: Vite 7.x with vite-plugin-dts for type generation
- Output: ES modules and CommonJS

## Key Conventions

### Code Style

- **Single quotes**, **no semicolons** (`.prettierrc.yaml`: `singleQuote: true`, `semi: false`)
- Applies to all files including config `.js` files
- Trailing comma: `es5`
- Print width: 80

### Externalization (Critical)

Packages MUST externalize their workspace dependencies in Vite build config:
- `@tempots/render` externalizes `@tempots/core`
- `@tempots/dom` externalizes `@tempots/core` and `@tempots/render`
- `@tempots/native` externalizes `@tempots/core` and `@tempots/render`

Without this, tests fail due to dual instances of Signal/DisposalScope (one from bundled dist, one from workspace source).

### Factory Pattern (createRenderKit)

`@tempots/render` exports `createRenderKit(config)` that each platform calls with its own `create` factory. Returns all shared renderables (When, ForEach, Repeat, OneOf, etc.) branded for that platform:

```ts
// DOM platform
const domKit = createRenderKit<DOMContext, typeof DOM_RENDERABLE_TYPE>({...})

// Native platform
const nativeKit = createRenderKit<NativeContext, typeof NATIVE_RENDERABLE_TYPE>({...})
```

### Type Specialization for Backward Compatibility

Generic types from `@tempots/render` have `CTX extends BaseRenderContext = BaseRenderContext`. Platform packages re-export these specialized to their context type:

```ts
// In @tempots/dom
export type Provider<T, O = any> = BaseProvider<T, O, DOMContext>
```

### Context Classes

- Must use `makeRef(): this` with polymorphic `this` return type (cast internally)
- Arrow function syntax (`readonly method = () => ...`) for methods passed as callbacks
- `HierarchicalContext.makeRef()` returns `this` type

### Signal Reactivity in Tests

- Mapped signals propagate asynchronously (microtask)
- Use `await waitForUpdate()` where `waitForUpdate = () => new Promise(resolve => setTimeout(resolve, 0))`
- Test renderables must properly clean up (use string TNodes for auto-cleanup via shared text helpers)

### DOM TNode

- Uses `Signal<string>` (not `ReadSignal<string>`) to align with core's `TNode` definition
- `Value<string>` = `string | Signal<string>` covers all concrete signal types since they all extend `Signal`

## Testing

- **Vitest 4.x** with v8 coverage provider
- Test files in `packages/*/test/*.spec.ts`
- DOM packages use **happy-dom** environment
- Coverage thresholds: 97% statements, 98% branches, 98% functions, 97% lines

## Linting

- **ESLint 10** with flat config (`eslint.config.js`)
- TypeScript-eslint with type-checked rules
- `@tempots/eslint-plugin` for signal disposal linting
- Shared base config in `config/eslint.base.js`

## TypeScript

- Base config: `config/tsconfig.base.json`
- Target: ES2020, Module: ESNext
- Strict mode enabled
