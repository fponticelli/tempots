import { describe, it, expect } from 'vitest'
import type { 
  RouteInfo, 
  RouteParam, 
  RouteLiteral, 
  RouteCatchAll, 
  RouteSegment, 
  Route,
  MakeParams,
  ExtractParamsFromTuple,
  ExtractParams
} from '../src/renderables/router/route-info'

describe('route-info.ts', () => {
  describe('Type definitions and exports', () => {
    it('should export RouteInfo type', () => {
      // Test that RouteInfo type is properly defined
      const routeInfo: RouteInfo<{ id: string }> = {
        params: { id: '123' },
        route: '/users/:id',
        path: '/users/123',
        search: { sort: 'name' },
        hash: 'section'
      }
      
      expect(routeInfo.params.id).toBe('123')
      expect(routeInfo.route).toBe('/users/:id')
      expect(routeInfo.path).toBe('/users/123')
      expect(routeInfo.search.sort).toBe('name')
      expect(routeInfo.hash).toBe('section')
    })

    it('should export RouteParam type', () => {
      const routeParam: RouteParam = {
        type: 'param',
        name: 'userId'
      }
      
      expect(routeParam.type).toBe('param')
      expect(routeParam.name).toBe('userId')
    })

    it('should export RouteLiteral type', () => {
      const routeLiteral: RouteLiteral = {
        type: 'literal',
        value: 'users'
      }
      
      expect(routeLiteral.type).toBe('literal')
      expect(routeLiteral.value).toBe('users')
    })

    it('should export RouteCatchAll type', () => {
      const routeCatchAll: RouteCatchAll = {
        type: 'catch-all'
      }
      
      expect(routeCatchAll.type).toBe('catch-all')
    })

    it('should export RouteCatchAll with optional name', () => {
      const routeCatchAll: RouteCatchAll = {
        type: 'catch-all',
        name: 'rest'
      }

      expect(routeCatchAll.type).toBe('catch-all')
      expect(routeCatchAll.name).toBe('rest')
    })

    it('should export RouteSegment union type', () => {
      const paramSegment: RouteSegment = {
        type: 'param',
        name: 'id'
      }
      
      const literalSegment: RouteSegment = {
        type: 'literal',
        value: 'users'
      }
      
      const catchAllSegment: RouteSegment = {
        type: 'catch-all'
      }
      
      expect(paramSegment.type).toBe('param')
      expect(literalSegment.type).toBe('literal')
      expect(catchAllSegment.type).toBe('catch-all')
    })

    it('should export Route type as array of RouteSegment', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' },
        { type: 'literal', value: 'posts' },
        { type: 'catch-all' }
      ]
      
      expect(route).toHaveLength(4)
      expect(route[0].type).toBe('literal')
      expect(route[1].type).toBe('param')
      expect(route[2].type).toBe('literal')
      expect(route[3].type).toBe('catch-all')
    })
  })

  describe('Type compatibility and usage', () => {
    it('should handle RouteInfo with no parameters', () => {
      const routeInfo: RouteInfo<{}> = {
        params: {},
        route: '/home',
        path: '/home',
        search: {},
        hash: undefined
      }
      
      expect(routeInfo.params).toEqual({})
      expect(routeInfo.route).toBe('/home')
    })

    it('should handle RouteInfo with multiple parameters', () => {
      const routeInfo: RouteInfo<{ userId: string; postId: string }> = {
        params: { userId: '123', postId: '456' },
        route: '/users/:userId/posts/:postId',
        path: '/users/123/posts/456',
        search: { sort: 'date' },
        hash: 'comments'
      }
      
      expect(routeInfo.params.userId).toBe('123')
      expect(routeInfo.params.postId).toBe('456')
    })

    it('should handle RouteInfo with custom route type', () => {
      const routeInfo: RouteInfo<{ id: string }, number> = {
        params: { id: '123' },
        route: 42,
        path: '/users/123',
        search: {},
        hash: undefined
      }
      
      expect(routeInfo.route).toBe(42)
      expect(typeof routeInfo.route).toBe('number')
    })

    it('should handle complex Route structures', () => {
      const complexRoute: Route = [
        { type: 'literal', value: 'api' },
        { type: 'literal', value: 'v1' },
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'userId' },
        { type: 'literal', value: 'posts' },
        { type: 'param', name: 'postId' },
        { type: 'literal', value: 'comments' },
        { type: 'catch-all' }
      ]
      
      expect(complexRoute).toHaveLength(8)
      
      // Verify each segment
      const [api, v1, users, userIdParam, posts, postIdParam, comments, catchAll] = complexRoute
      
      expect(api).toEqual({ type: 'literal', value: 'api' })
      expect(v1).toEqual({ type: 'literal', value: 'v1' })
      expect(users).toEqual({ type: 'literal', value: 'users' })
      expect(userIdParam).toEqual({ type: 'param', name: 'userId' })
      expect(posts).toEqual({ type: 'literal', value: 'posts' })
      expect(postIdParam).toEqual({ type: 'param', name: 'postId' })
      expect(comments).toEqual({ type: 'literal', value: 'comments' })
      expect(catchAll).toEqual({ type: 'catch-all' })
    })

    it('should handle empty Route', () => {
      const emptyRoute: Route = []
      expect(emptyRoute).toHaveLength(0)
    })

    it('should handle Route with only literals', () => {
      const literalRoute: Route = [
        { type: 'literal', value: 'static' },
        { type: 'literal', value: 'path' },
        { type: 'literal', value: 'here' }
      ]
      
      expect(literalRoute).toHaveLength(3)
      literalRoute.forEach(segment => {
        expect(segment.type).toBe('literal')
        expect('value' in segment).toBe(true)
      })
    })

    it('should handle Route with only parameters', () => {
      const paramRoute: Route = [
        { type: 'param', name: 'first' },
        { type: 'param', name: 'second' },
        { type: 'param', name: 'third' }
      ]
      
      expect(paramRoute).toHaveLength(3)
      paramRoute.forEach(segment => {
        expect(segment.type).toBe('param')
        expect('name' in segment).toBe(true)
      })
    })

    it('should handle Route with only catch-all', () => {
      const catchAllRoute: Route = [
        { type: 'catch-all' }
      ]
      
      expect(catchAllRoute).toHaveLength(1)
      expect(catchAllRoute[0].type).toBe('catch-all')
    })
  })

  describe('Type validation and constraints', () => {
    it('should enforce RouteParam structure', () => {
      const validParam: RouteParam = {
        type: 'param',
        name: 'validName'
      }
      
      expect(validParam.type).toBe('param')
      expect(typeof validParam.name).toBe('string')
    })

    it('should enforce RouteLiteral structure', () => {
      const validLiteral: RouteLiteral = {
        type: 'literal',
        value: 'validValue'
      }
      
      expect(validLiteral.type).toBe('literal')
      expect(typeof validLiteral.value).toBe('string')
    })

    it('should enforce RouteCatchAll structure', () => {
      const validCatchAll: RouteCatchAll = {
        type: 'catch-all'
      }
      
      expect(validCatchAll.type).toBe('catch-all')
      expect(Object.keys(validCatchAll)).toEqual(['type'])
    })

    it('should allow RouteCatchAll with name in structure', () => {
      const namedCatchAll: RouteCatchAll = {
        type: 'catch-all',
        name: 'tail'
      }

      expect(namedCatchAll.type).toBe('catch-all')
      expect(namedCatchAll.name).toBe('tail')
    })

    it('should handle RouteInfo with optional hash', () => {
      const withHash: RouteInfo<{}> = {
        params: {},
        route: '/test',
        path: '/test',
        search: {},
        hash: 'section'
      }
      
      const withoutHash: RouteInfo<{}> = {
        params: {},
        route: '/test',
        path: '/test',
        search: {}
      }
      
      expect(withHash.hash).toBe('section')
      expect(withoutHash.hash).toBeUndefined()
    })

    it('should handle RouteInfo with complex search parameters', () => {
      const routeInfo: RouteInfo<{}> = {
        params: {},
        route: '/search',
        path: '/search',
        search: {
          q: 'typescript',
          sort: 'relevance',
          page: '1',
          limit: '10'
        }
      }
      
      expect(Object.keys(routeInfo.search)).toHaveLength(4)
      expect(routeInfo.search.q).toBe('typescript')
      expect(routeInfo.search.sort).toBe('relevance')
    })
  })

  describe('Real-world usage patterns', () => {
    it('should support typical blog route structure', () => {
      const blogRoute: Route = [
        { type: 'literal', value: 'blog' },
        { type: 'param', name: 'year' },
        { type: 'param', name: 'month' },
        { type: 'param', name: 'slug' }
      ]
      
      const blogRouteInfo: RouteInfo<{ year: string; month: string; slug: string }> = {
        params: { year: '2024', month: '01', slug: 'my-post' },
        route: '/blog/:year/:month/:slug',
        path: '/blog/2024/01/my-post',
        search: { utm_source: 'twitter' },
        hash: 'introduction'
      }
      
      expect(blogRoute).toHaveLength(4)
      expect(blogRouteInfo.params.year).toBe('2024')
      expect(blogRouteInfo.params.month).toBe('01')
      expect(blogRouteInfo.params.slug).toBe('my-post')
    })

    it('should support API route with version and catch-all', () => {
      const apiRoute: Route = [
        { type: 'literal', value: 'api' },
        { type: 'param', name: 'version' },
        { type: 'catch-all' }
      ]
      
      const apiRouteInfo: RouteInfo<{ version: string }> = {
        params: { version: 'v2' },
        route: '/api/:version/*',
        path: '/api/v2/users/123/posts',
        search: { include: 'comments' }
      }
      
      expect(apiRoute).toHaveLength(3)
      expect(apiRoute[2].type).toBe('catch-all')
      expect(apiRouteInfo.params.version).toBe('v2')
    })

    it('should support named catch-all route structure', () => {
      const route: Route = [
        { type: 'literal', value: 'files' },
        { type: 'catch-all', name: 'rest' }
      ]

      const params: MakeParams<ExtractParams<'/files/*rest'>> = {
        rest: 'docs/report.pdf'
      }

      expect(route[1]).toEqual({ type: 'catch-all', name: 'rest' })
      expect(params.rest).toBe('docs/report.pdf')
    })

    it('should include named catch-all in combined params type', () => {
      const params: MakeParams<ExtractParams<'/:userId/*more'>> = {
        userId: '42',
        more: 'details/extra'
      }

      expect(params.userId).toBe('42')
      expect(params.more).toBe('details/extra')
    })

    it('should support file system route structure', () => {
      const fileRoute: Route = [
        { type: 'literal', value: 'files' },
        { type: 'catch-all' }
      ]
      
      const fileRouteInfo: RouteInfo<{}> = {
        params: {},
        route: '/files/*',
        path: '/files/documents/2024/report.pdf',
        search: { download: 'true' }
      }
      
      expect(fileRoute).toHaveLength(2)
      expect(fileRouteInfo.path).toContain('documents/2024/report.pdf')
    })
  })
})
