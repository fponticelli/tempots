import { once } from 'node:events'
import { createServer as createHttpServer } from 'node:http'
import { createServer, type Plugin } from 'vite'

export async function serveFixture(root: string, plugins: Plugin[]) {
  const vite = await createServer({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins,
    server: { middlewareMode: true, watch: null, ws: false },
  })
  const server = createHttpServer(vite.middlewares)
  const close = async () => {
    try {
      if (server.listening) {
        await new Promise<void>((resolve, reject) => {
          server.close(error => (error ? reject(error) : resolve()))
        })
      }
    } finally {
      await vite.close()
    }
  }

  try {
    const listening = once(server, 'listening')
    server.listen(0, '127.0.0.1')
    await listening
    const address = server.address()
    if (address === null || typeof address === 'string') {
      throw new Error('Expected an HTTP server address')
    }
    return { baseUrl: `http://127.0.0.1:${address.port}`, close }
  } catch (error) {
    await close()
    throw error
  }
}
