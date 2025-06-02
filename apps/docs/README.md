# Tempo Documentation Site

The official documentation website for Tempo, built with Tempo itself to showcase the framework's capabilities while providing comprehensive documentation for users and contributors.

## Overview

This documentation site serves multiple purposes:
- **User Documentation**: Guides, tutorials, and API reference for Tempo users
- **Framework Showcase**: Demonstrates Tempo's capabilities in a real application
- **Development Reference**: Examples and patterns for Tempo development

## Features

- **Interactive Examples**: Live code examples with Monaco Editor integration
- **API Documentation**: Auto-generated API docs from TypeScript source
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Search Functionality**: Full-text search across all documentation
- **Dark Mode**: Automatic dark/light theme switching
- **Static Generation**: Pre-rendered static site for fast loading

## Development Setup

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended package manager)

### Installation and Running

```bash
# From the project root
cd apps/docs

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The documentation site will be available at `http://localhost:5173`.

## Project Structure

```
apps/docs/
├── src/                    # Source code
│   ├── components/         # Reusable UI components
│   ├── services/          # Data services and utilities
│   ├── utils/             # Utility functions
│   ├── icons/             # Icon components
│   ├── model/             # Data models and types
│   └── main.ts            # Application entry point
├── pages/                 # Documentation pages (Markdown)
│   ├── index.md           # Homepage
│   ├── quick-start.md     # Getting started guide
│   ├── signals.md         # Signals documentation
│   ├── components.md      # Component building guide
│   └── ...                # Other documentation pages
├── scripts/               # Build and utility scripts
│   ├── generate-static-pages.ts  # Static site generation
│   └── prep-doc-contents.ts      # Documentation processing
├── public/                # Static assets
│   ├── api/               # Generated API documentation
│   ├── demos/             # Demo application builds
│   └── assets/            # Images, icons, etc.
├── assets/                # Source assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite build configuration
└── README.md             # This file
```

## Content Management

### Documentation Pages

Documentation pages are written in Markdown with frontmatter:

```markdown
---
title: Page Title
order: 10
description: Page description for SEO
---
# Page Content

Your markdown content here...
```

### Adding New Pages

1. Create a new `.md` file in the `pages/` directory
2. Add appropriate frontmatter with title, order, and description
3. Write content in Markdown format
4. The page will be automatically included in navigation

### Code Examples

Use fenced code blocks with language specification:

```typescript
import { html, render, prop } from '@tempots/dom'

const counter = prop(0)
render(html.div('Count: ', counter), document.body)
```

### Interactive Examples

For interactive examples, use the Monaco Editor integration:

```typescript
// This will be rendered as an interactive editor
import { html, render, prop, on } from '@tempots/dom'

function Counter() {
  const count = prop(0)
  return html.div(
    html.div('Count: ', count),
    html.button(on.click(() => count.value++), 'Increment')
  )
}

render(Counter(), document.getElementById('app'))
```

## Build Process

### Development Build

```bash
pnpm dev
```

- Hot module replacement for fast development
- Live reload for markdown changes
- Source maps for debugging

### Production Build

```bash
pnpm build
```

- Static site generation for all pages
- Asset optimization and minification
- API documentation generation
- Demo application builds

### Static Site Generation

The build process generates a static site:

1. **Page Processing**: Markdown files are processed and converted to HTML
2. **API Documentation**: TypeScript source is analyzed to generate API docs
3. **Demo Builds**: Demo applications are built and included
4. **Asset Optimization**: Images, CSS, and JS are optimized
5. **Static Generation**: All pages are pre-rendered for fast loading

## Deployment

The documentation site is deployed to GitHub Pages:

```bash
# Build the site
pnpm build

# Deploy to GitHub Pages (automated via GitHub Actions)
```

The site is automatically deployed when changes are pushed to the main branch.

## Contributing to Documentation

### Writing Guidelines

1. **Clear and Concise**: Write clear, concise explanations
2. **Code Examples**: Include practical code examples
3. **Progressive Complexity**: Start simple, build up complexity
4. **Cross-References**: Link to related concepts and pages
5. **Accessibility**: Use semantic HTML and proper heading structure

### Style Guide

- Use sentence case for headings
- Include code examples for all concepts
- Provide both basic and advanced examples
- Link to relevant demo applications
- Use consistent terminology throughout

### Review Process

1. Create a branch for your changes
2. Write or update documentation
3. Test locally with `pnpm dev`
4. Submit a pull request
5. Address review feedback
6. Merge when approved

## Technical Details

### Framework Integration

The documentation site is built with Tempo itself, demonstrating:
- **Routing**: Client-side routing with URL synchronization
- **State Management**: Application state with signals
- **Component Architecture**: Reusable component patterns
- **Performance**: Efficient rendering and updates

### Build Tools

- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Monaco Editor**: Code editor integration
- **Marked**: Markdown processing
- **Highlight.js**: Syntax highlighting

### Performance Optimizations

- **Code Splitting**: Automatic code splitting for optimal loading
- **Asset Optimization**: Image and asset optimization
- **Caching**: Aggressive caching for static assets
- **Preloading**: Critical resource preloading
- **Lazy Loading**: Lazy loading for non-critical content

## Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Hot Reload Issues**: Restart development server
3. **Missing Pages**: Check frontmatter format and file location
4. **Styling Issues**: Check Tailwind CSS configuration

### Getting Help

- Check existing issues in the GitHub repository
- Create a new issue with detailed description
- Join the community Discord for real-time help
- Review the contributing guidelines

## Learn More

- [Tempo Documentation](https://tempo-ts.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Markdown Guide](https://www.markdownguide.org/)
