import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { appendFileSync } from 'node:fs'

/** Read a Node request body. */
const readBody = (req) => new Promise((resolve, reject) => {
  const chunks = []
  req.on('data', (c) => chunks.push(c))
  req.on('end', () => resolve(Buffer.concat(chunks)))
  req.on('error', reject)
})

/** In `npm run dev`, serve /api/* from the same code Vercel runs in production. */
function devApi() {
  const route = (path, file, method) => async (server, req, res) => {
    try {
      const mod = await server.ssrLoadModule(file)
      const url = `http://${req.headers.host}${path}`
      const body = method === 'POST' ? await readBody(req) : undefined
      const r = await mod[method](new Request(url, { method, headers: req.headers, body }))
      const text = await r.text()
      if (path === '/api/ask' && r.ok) {
        // Dev-only cost log (production logs usage to Vercel's function logs instead)
        const j = JSON.parse(text)
        appendFileSync('docs/rag-ask-log.jsonl', `${JSON.stringify({ at: new Date().toISOString(), model: j.model, input_tokens: j.usage?.input_tokens, output_tokens: j.usage?.output_tokens, cached: Boolean(j.cached), costUsd: j.costUsd })}\n`)
      }
      res.statusCode = r.status
      r.headers.forEach((v, k) => res.setHeader(k, v))
      res.end(text)
    } catch (e) {
      res.statusCode = 500
      res.end(JSON.stringify({ error: String(e.message || e) }))
    }
  }
  const routes = { '/api/rates': route('/api/rates', '/api/rates.js', 'GET'), '/api/ask': route('/api/ask', '/api/ask.js', 'POST') }
  return {
    name: 'front-door-dev-api',
    configureServer(server) {
      for (const [path, handler] of Object.entries(routes)) server.middlewares.use(path, (req, res) => handler(server, req, res))
    },
  }
}

export default defineConfig(({ mode }) => {
  // Make the server-side key available to the dev API routes only (never exposed to the browser: no VITE_ prefix).
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  return { plugins: [react(), tailwindcss(), devApi()] }
})
