type NodeResponse = {
  status: (code: number) => {
    json: (body: { ok: boolean }) => void
    end?: () => void
  }
}

function isNodeResponse(res: unknown): res is NodeResponse {
  return Boolean(res && typeof (res as NodeResponse).status === 'function')
}

function isWebRequest(req: unknown): req is Request {
  return Boolean(
    req &&
      typeof (req as Request).json === 'function' &&
      typeof (req as Request).arrayBuffer === 'function',
  )
}

export function getMethod(req: unknown) {
  if (isWebRequest(req)) return req.method
  return String((req as { method?: string }).method || 'GET').toUpperCase()
}

export async function readJsonBody(req: unknown) {
  if (isWebRequest(req)) {
    return req.json().catch(() => null)
  }

  const nodeReq = req as {
    body?: unknown
    [Symbol.asyncIterator]?: () => AsyncIterator<unknown>
  }

  if (typeof nodeReq.body === 'string' && nodeReq.body.trim()) {
    return JSON.parse(nodeReq.body) as unknown
  }

  if (nodeReq.body && typeof nodeReq.body === 'object') {
    return nodeReq.body
  }

  if (typeof nodeReq[Symbol.asyncIterator] === 'function') {
    const chunks: Buffer[] = []
    for await (const chunk of nodeReq as AsyncIterable<unknown>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
    }
    const raw = Buffer.concat(chunks).toString('utf8').trim()
    return raw ? (JSON.parse(raw) as unknown) : null
  }

  return null
}

export function jsonReply(res: unknown, status: number, body: { ok: boolean }) {
  if (isNodeResponse(res)) {
    res.status(status).json(body)
    return
  }

  if (status === 204) {
    return new Response(null, { status: 204 })
  }

  return Response.json(body, { status })
}
