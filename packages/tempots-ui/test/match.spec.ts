import { describe, it, expect } from 'vitest'
import {
  matchesRoute,
  _parseRouteSegments,
  _makeRouteMatcher,
  type MatchResult,
  type MatchResultWithRoute
} from '../src/renderables/router/match'
import type { Route, RouteSegment } from '../src/renderables/router/route-info'

describe('match.ts', () => {
  describe('_parseRouteSegments', () => {
    it('should parse simple literal route', () => {
      const result = _parseRouteSegments('/home')

      expect(result).toEqual([
        { type: 'literal', value: 'home' }
      ])
    })

    it('should parse route with parameters', () => {
      const result = _parseRouteSegments('/users/:id')

      expect(result).toEqual([
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ])
    })

    it('should parse route with catch-all', () => {
      const result = _parseRouteSegments('/files/*')

      expect(result).toEqual([
        { type: 'literal', value: 'files' },
        { type: 'catch-all' }
      ])
    })

    it('should parse route with named catch-all', () => {
      const result = _parseRouteSegments('/files/*rest')

      expect(result).toEqual([
        { type: 'literal', value: 'files' },
        { type: 'catch-all', name: 'rest' }
      ])
    })

    it('should parse complex route', () => {
      const result = _parseRouteSegments('/users/:userId/posts/:postId')

      expect(result).toEqual([
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'userId' },
        { type: 'literal', value: 'posts' },
        { type: 'param', name: 'postId' }
      ])
    })

    it('should handle root route', () => {
      const result = _parseRouteSegments('/')

      expect(result).toEqual([])
    })

    it('should filter out empty segments', () => {
      const result = _parseRouteSegments('//users///:id//')

      expect(result).toEqual([
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ])
    })

    it('should handle route without leading slash', () => {
      const result = _parseRouteSegments('users/:id')

      expect(result).toEqual([
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ])
    })
  })

  describe('matchesRoute', () => {
    it('should match simple literal route', () => {
      const route: Route = [{ type: 'literal', value: 'home' }]
      const result = matchesRoute(route, '/home')

      expect(result).toEqual({
        params: {},
        path: '/home'
      })
    })

    it('should not match different literal route', () => {
      const route: Route = [{ type: 'literal', value: 'home' }]
      const result = matchesRoute(route, '/about')

      expect(result).toBeNull()
    })

    it('should match route with parameters', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ]
      const result = matchesRoute(route, '/users/123')

      expect(result).toEqual({
        params: { id: '123' },
        path: '/users/123'
      })
    })

    it('should match multiple parameters', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'userId' },
        { type: 'literal', value: 'posts' },
        { type: 'param', name: 'postId' }
      ]
      const result = matchesRoute(route, '/users/123/posts/456')

      expect(result).toEqual({
        params: { userId: '123', postId: '456' },
        path: '/users/123/posts/456'
      })
    })

    it('should match catch-all route', () => {
      const route: Route = [
        { type: 'literal', value: 'files' },
        { type: 'catch-all' }
      ]
      const result = matchesRoute(route, '/files/docs/readme.txt')

      expect(result).toEqual({
        params: {},
        path: '/files/docs/readme.txt'
      })
    })

    it('should match named catch-all route', () => {
      const route: Route = [
        { type: 'literal', value: 'files' },
        { type: 'catch-all', name: 'rest' }
      ]
      const result = matchesRoute(route, '/files/docs/readme.txt')

      expect(result).toEqual({
        params: { rest: 'docs/readme.txt' },
        path: '/files/docs/readme.txt'
      })
    })

    it('should match catch-all at root', () => {
      const route: Route = [{ type: 'catch-all' }]
      const result = matchesRoute(route, '/any/path/here')

      expect(result).toEqual({
        params: {},
        path: '/any/path/here'
      })
    })

    it('should match named catch-all at root', () => {
      const route: Route = [{ type: 'catch-all', name: 'more' }]
      const result = matchesRoute(route, '/any/path/here')

      expect(result).toEqual({
        params: { more: 'any/path/here' },
        path: '/any/path/here'
      })
    })

    it('should not match when path is too short', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ]
      const result = matchesRoute(route, '/users')

      expect(result).toBeNull()
    })

    it('should not match when path is too long', () => {
      const route: Route = [{ type: 'literal', value: 'home' }]
      const result = matchesRoute(route, '/home/extra')

      expect(result).toBeNull()
    })

    it('should handle empty path', () => {
      const route: Route = []
      const result = matchesRoute(route, '/')

      expect(result).toEqual({
        params: {},
        path: '/'
      })
    })

    it('should handle path without leading slash', () => {
      const route: Route = [{ type: 'literal', value: 'home' }]
      const result = matchesRoute(route, 'home')

      expect(result).toEqual({
        params: {},
        path: 'home'
      })
    })

    it('should not match when literal segment does not match', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' }
      ]
      const result = matchesRoute(route, '/posts/123')

      expect(result).toBeNull()
    })

    it('should handle missing path segment for non-catch-all', () => {
      const route: Route = [
        { type: 'literal', value: 'users' },
        { type: 'param', name: 'id' },
        { type: 'literal', value: 'edit' }
      ]
      const result = matchesRoute(route, '/users/123')

      expect(result).toBeNull()
    })
  })

  describe('_makeRouteMatcher', () => {
    it('should create matcher for single route', () => {
      const matcher = _makeRouteMatcher(['/home'])
      const result = matcher('/home')

      expect(result).toEqual({
        params: {},
        path: '/home',
        route: '/home'
      })
    })

    it('should create matcher for multiple routes', () => {
      const matcher = _makeRouteMatcher(['/home', '/about', '/users/:id'])

      expect(matcher('/home')).toEqual({
        params: {},
        path: '/home',
        route: '/home'
      })

      expect(matcher('/about')).toEqual({
        params: {},
        path: '/about',
        route: '/about'
      })

      expect(matcher('/users/123')).toEqual({
        params: { id: '123' },
        path: '/users/123',
        route: '/users/:id'
      })
    })

    it('should return null for non-matching path', () => {
      const matcher = _makeRouteMatcher(['/home', '/about'])
      const result = matcher('/contact')

      expect(result).toBeNull()
    })

    it('should match first matching route', () => {
      const matcher = _makeRouteMatcher(['/users/:id', '/users/admin'])
      const result = matcher('/users/admin')

      // Should match the first route pattern, not the more specific one
      expect(result).toEqual({
        params: { id: 'admin' },
        path: '/users/admin',
        route: '/users/:id'
      })
    })

    it('should handle catch-all routes', () => {
      const matcher = _makeRouteMatcher(['/api/*', '/files/*'])

      expect(matcher('/api/v1/users')).toEqual({
        params: {},
        path: '/api/v1/users',
        route: '/api/*'
      })

      expect(matcher('/files/docs/readme.txt')).toEqual({
        params: {},
        path: '/files/docs/readme.txt',
        route: '/files/*'
      })
    })

    it('should handle named catch-all routes', () => {
      const matcher = _makeRouteMatcher(['/files/*rest'])

      expect(matcher('/files/docs/readme.txt')).toEqual({
        params: { rest: 'docs/readme.txt' },
        path: '/files/docs/readme.txt',
        route: '/files/*rest'
      })
    })

    it('should include named catch-all with other params', () => {
      const matcher = _makeRouteMatcher(['/:userId/*rest'])

      expect(matcher('/123/files/doc.pdf')).toEqual({
        params: { userId: '123', rest: 'files/doc.pdf' },
        path: '/123/files/doc.pdf',
        route: '/:userId/*rest'
      })
    })

    it('should handle empty routes array', () => {
      const matcher = _makeRouteMatcher([])
      const result = matcher('/any-path')

      expect(result).toBeNull()
    })

    it('should handle complex route patterns', () => {
      const matcher = _makeRouteMatcher([
        '/',
        '/users',
        '/users/:id',
        '/users/:id/posts/:postId',
        '/admin/*'
      ])

      expect(matcher('/')).toEqual({
        params: {},
        path: '/',
        route: '/'
      })

      expect(matcher('/users')).toEqual({
        params: {},
        path: '/users',
        route: '/users'
      })

      expect(matcher('/users/123')).toEqual({
        params: { id: '123' },
        path: '/users/123',
        route: '/users/:id'
      })

      expect(matcher('/users/123/posts/456')).toEqual({
        params: { id: '123', postId: '456' },
        path: '/users/123/posts/456',
        route: '/users/:id/posts/:postId'
      })

      expect(matcher('/admin/dashboard/settings')).toEqual({
        params: {},
        path: '/admin/dashboard/settings',
        route: '/admin/*'
      })
    })
  })
})
