# Contributing to Tempo

Thank you for your interest in contributing to Tempo! This guide will help you get started with development, testing, and contributing to the project.

## Development Setup

### Prerequisites

- **Node.js**: Version 16 or higher
- **pnpm**: Version 7 or higher (recommended package manager)
- **Git**: For version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fponticelli/tempots.git
   cd tempots
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build all packages**
   ```bash
   pnpm build
   ```

## Project Structure

```
tempots/
├── packages/                # Core packages
│   ├── tempots-dom/        # Core UI framework
│   ├── tempots-std/        # Standard library
│   └── tempots-ui/         # UI components
├── demo/                   # Example applications
│   ├── counter/           # Simple counter demo
│   ├── todomvc/           # TodoMVC implementation
│   ├── 7guis/             # 7GUIs benchmark
│   └── hnpwa/             # Hacker News PWA
├── apps/
│   └── docs/              # Documentation website
├── scripts/               # Build and utility scripts
└── docs/                  # Generated documentation
```

## Development Workflow

### Building Packages

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/tempots-dom
pnpm build

# Watch mode for development
pnpm build:watch
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/tempots-dom
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Linting and Formatting

```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm format
```

### Running Demos

```bash
# Run counter demo
cd demo/counter
pnpm dev

# Run TodoMVC demo
cd demo/todomvc
pnpm dev

# Run 7GUIs demo
cd demo/7guis
pnpm dev

# Run Hacker News PWA
cd demo/hnpwa
pnpm dev
```

### Documentation

```bash
# Run documentation site
cd apps/docs
pnpm dev

# Generate API documentation
cd packages/tempots-dom
pnpm docs
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes

- Follow the existing code style and patterns
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Test Your Changes

```bash
# Run tests
pnpm test

# Test in demo applications
cd demo/counter
pnpm dev
```

### 4. Commit Your Changes

We use conventional commits for clear commit messages:

```bash
git commit -m "feat: add new signal utility function"
git commit -m "fix: resolve memory leak in signal disposal"
git commit -m "docs: update README with new examples"
```

### 5. Submit a Pull Request

1. Push your branch to GitHub
2. Create a pull request with a clear description
3. Link any related issues
4. Wait for review and address feedback

## Code Style Guidelines

### TypeScript

- Use TypeScript for all code
- Prefer explicit types over `any`
- Use JSDoc comments for public APIs
- Follow existing naming conventions

#### Equality terminology

Use the following naming scheme for equality related features:

- **equal** – For modules and standalone functions that perform equality checks. Example: `strictEqual`, `deepEqual`.
- **equals** – For parameters or properties that accept an equality function. Example: `signal(value, equals)`.
- **equality** – Use in documentation when referring to the concept or a custom equality function.

Keeping these terms consistent improves readability across the project.

### Formatting

- Use Prettier for code formatting (configured automatically)
- Use ESLint for code quality (configured in each package)
- 2 spaces for indentation
- Single quotes for strings

### Testing

- Write tests for all new functionality
- Use Vitest for testing framework
- Aim for high test coverage (80%+ statements, 75%+ branches)
- Test both happy path and error cases
- Follow the comprehensive [Testing Guidelines](./TESTING_GUIDELINES.md)

## Package Development

### Adding New Features

1. **Design**: Consider the API design and how it fits with existing patterns
2. **Implement**: Write the implementation with proper TypeScript types
3. **Test**: Add comprehensive tests
4. **Document**: Add JSDoc comments and update README if needed
5. **Demo**: Add examples to relevant demo applications

### Breaking Changes

- Avoid breaking changes when possible
- If necessary, follow semantic versioning
- Document migration path in CHANGELOG
- Provide deprecation warnings when possible

## Documentation

### Code Documentation

- Use JSDoc comments for all public APIs
- Include `@param`, `@returns`, and `@example` tags
- Mark internal APIs with `@internal`
- Add `@public` tag for public APIs

### README Updates

- Update package READMEs when adding features
- Include practical examples
- Keep examples simple and focused
- Link to comprehensive documentation

### API Documentation

- Generated automatically from JSDoc comments
- Run `pnpm docs` to generate API docs
- Review generated docs for completeness

## Release Process

Releases are handled by maintainers:

1. **Version Bump**: Update version numbers
2. **Changelog**: Update CHANGELOG.md
3. **Build**: Ensure all packages build successfully
4. **Test**: Run full test suite
5. **Publish**: Publish to npm registry
6. **Tag**: Create git tag for release

## Getting Help

- **Issues**: Check existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server
- **Documentation**: Check the official documentation

## Code of Conduct

Please be respectful and inclusive in all interactions. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

## License

By contributing to Tempo, you agree that your contributions will be licensed under the Apache License 2.0.
