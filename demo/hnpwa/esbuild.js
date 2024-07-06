import esbuild from 'esbuild'
import pluginsJsxRuntime from '@uppercod/esbuild-jsx-runtime'
import { sassPlugin } from 'esbuild-sass-plugin'
import process from 'process'

const args = process.argv.slice(2)
const watch = await (async () => {
  if (args.includes('--server')) {
    const { server: superstatic } = await import('superstatic')

    const config = {
      port: 3474,
      config: {
        public: './dist',
        rewrites: [
          {"source":"/top","destination":"/index.html"},
          {"source":"/new","destination":"/index.html"},
          {"source":"/ask","destination":"/index.html"},
          {"source":"/show","destination":"/index.html"},
          {"source":"/jobs","destination":"/index.html"},
          {"source":"/item/*","destination":"/index.html"},
          {"source":"/user/*","destination":"/index.html"}
        ],
      },

      // cwd: __dirname,
      // errorPage: __dirname + "/error.html",
      compression: true,
      debug: true
    }

    const app = superstatic(config)

    app.listen(() => {
      console.log(`Server start at http://localhost:${config.port}`)
    })
    return true
  } else {
    return false
  }
})()

await esbuild.build({
  entryPoints: ['./src/main.tsx'],
  bundle: true,
  minify: !watch,
  outfile: 'dist/main.js',
  jsx: 'transform',
  watch,
  plugins: [
    pluginsJsxRuntime({
      jsxFactory: '_jsx',
      jsxFragment: '_jsx',
      jsxImportSource: '@tempots/dom'
    }),
    sassPlugin()
  ]
})
