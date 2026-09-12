import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import { deliverInquiry } from './api/inquiry'

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, body: { ok: boolean }) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inquiry-api',
        configureServer(server) {
          const post = (
            path: string,
            run: (body: unknown) => Promise<void>,
          ) => {
            server.middlewares.use(path, (req, res) => {
              void (async () => {
                if (req.method !== 'POST') {
                  json(res, 405, { ok: false })
                  return
                }

                try {
                  await run(JSON.parse(await readBody(req)))
                  json(res, 200, { ok: true })
                } catch {
                  json(res, 500, { ok: false })
                }
              })()
            })
          }

          post('/api/inquiry', deliverInquiry)
        },
      },
    ],
  }
})
