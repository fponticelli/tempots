# Hacker News PWA Demo

A Progressive Web Application (PWA) implementation of Hacker News using Tempo, demonstrating real-world application patterns including routing, API integration, error handling, and responsive design. This is a complete, production-ready application showcasing advanced Tempo concepts.

## What This Demo Shows

This demo demonstrates enterprise-level application patterns:

- **Client-Side Routing**: Multi-page navigation with URL synchronization
- **API Integration**: Fetching data from external APIs with error handling
- **Progressive Web App**: Offline capabilities and mobile-first design
- **State Management**: Complex application state with multiple data sources
- **Error Boundaries**: Graceful error handling and user feedback
- **Loading States**: Proper loading indicators and skeleton screens
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Efficient rendering and data fetching strategies
- **SEO Optimization**: Proper meta tags and semantic HTML

## Features

### ✅ Core Functionality
- **Browse Stories**: Top, New, Ask HN, Show HN, and Jobs feeds
- **Read Articles**: Full article view with comments
- **User Profiles**: View user information and submission history
- **Pagination**: Navigate through multiple pages of content
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Support**: Basic offline functionality with service worker

### ✅ Technical Features
- **Client-Side Routing**: URL-based navigation without page reloads
- **Lazy Loading**: Components and data loaded on demand
- **Error Handling**: Comprehensive error states and recovery
- **Loading States**: Skeleton screens and loading indicators
- **Type Safety**: Full TypeScript integration
- **Performance**: Optimized rendering and minimal re-renders

## Running the Demo

### Prerequisites
- Node.js (version 16 or higher)
- pnpm (recommended) or npm

### Setup and Run
```bash
# From the project root
cd demo/hnpwa

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The demo will be available at `http://localhost:5173` (or the next available port).

## Code Structure

```
demo/hnpwa/
├── src/
│   ├── components/          # UI components
│   │   ├── app.ts          # Main application shell
│   │   ├── article.ts      # Article detail view
│   │   ├── comments.ts     # Comment thread rendering
│   │   ├── page-feed.ts    # Story feed pages
│   │   ├── profile.ts      # User profile view
│   │   ├── loading.ts      # Loading states
│   │   ├── error.ts        # Error handling
│   │   └── ...             # Other components
│   ├── utils/              # Utility functions
│   │   ├── request.ts      # API request handling
│   │   ├── decoders.ts     # Data validation
│   │   ├── result.ts       # Result type utilities
│   │   └── ...             # Other utilities
│   ├── assets/
│   │   └── style.scss      # Application styles
│   ├── config.ts           # Configuration constants
│   ├── route.ts            # Routing logic
│   ├── types.ts            # Type definitions
│   └── main.ts             # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Key Architectural Patterns

### 1. Routing System
```typescript
export const globalRoute = makeRouteFlow()
const page = globalRoute
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe(v => v, Page.notFound)
```
Uses Tempo's routing system for client-side navigation.

### 2. API Integration
```typescript
const request = async <T>(url: string): Promise<Result<T, HttpError>> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return failure(new HttpError(response.status, response.statusText))
    }
    return success(await response.json())
  } catch (error) {
    return failure(new HttpError(0, 'Network Error'))
  }
}
```
Robust error handling with Result types.

### 3. Component Composition
```typescript
OneOfType(page, {
  Article: p => Article(p.at('item')),
  PageFeed: PageFeedView,
  Profile: e => ProfileView({ user: e.at('user') }),
  NotFound: NotFound,
  Error: ErrorView,
  Loading: Loading,
})
```
Type-safe page routing with different component types.

### 4. State Management
```typescript
const page = globalRoute
  .mapAsync(loadRoute, Page.loading)
  .mapMaybe(v => v, Page.notFound)
```
Reactive state management with automatic loading and error states.

## Data Flow

1. **Route Change**: User navigates or URL changes
2. **Route Processing**: Route is parsed and validated
3. **Data Loading**: Async data fetching with loading state
4. **Component Rendering**: Appropriate component renders with data
5. **Error Handling**: Errors are caught and displayed gracefully

## Learning Opportunities

This demo teaches:

### Beginner Level
- How to structure larger applications
- Basic routing and navigation patterns
- API integration fundamentals
- Error handling strategies

### Intermediate Level
- Advanced state management patterns
- Component composition techniques
- Performance optimization strategies
- Progressive Web App concepts

### Advanced Level
- Complex routing scenarios
- Advanced error recovery patterns
- Type-safe API integration
- Production deployment considerations

## Performance Considerations

- **Lazy Loading**: Components loaded only when needed
- **Efficient Rendering**: Minimal re-renders with precise signal dependencies
- **Data Caching**: Smart caching strategies for API responses
- **Bundle Optimization**: Code splitting and tree shaking
- **Network Optimization**: Efficient API usage patterns

## Comparison with Other Implementations

This implementation can be compared with other Hacker News PWA implementations:
- **React**: [hn.premii.com](https://github.com/kristoferbaxter/react-hn)
- **Vue**: [vue-hn.herokuapp.com](https://github.com/vuejs/vue-hackernews-2.0)
- **Angular**: [angular2-hn.firebaseapp.com](https://github.com/housseindjirdeh/angular2-hn)

## Deployment

The application can be deployed to any static hosting service:

```bash
# Build for production
pnpm build

# Deploy the dist/ folder to your hosting service
```

Recommended hosting platforms:
- **Vercel**: Zero-config deployment
- **Netlify**: Easy continuous deployment
- **GitHub Pages**: Free hosting for open source
- **Firebase Hosting**: Google's hosting platform

## Next Steps

After exploring this demo:

1. **Study the architecture**: Understand how large applications are structured
2. **Extend functionality**: Add features like search, favorites, or offline reading
3. **Performance analysis**: Use browser dev tools to analyze performance
4. **Deploy your own**: Deploy to a hosting service and share it

## Learn More

- [Hacker News API](https://github.com/HackerNews/API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Tempo Routing Guide](https://tempo-ts.com/page/routing.html)
- [Tempo Documentation](https://tempo-ts.com/)
