import { timingSafeEqual } from 'node:crypto'

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function tokensMatch(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length === 0 || a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function vercelUrl(path: string) {
  const url = new URL(`https://api.vercel.com${path}`)
  const teamId = process.env.VERCEL_ORG_ID?.trim()
  if (teamId) url.searchParams.set('teamId', teamId)
  return url
}

async function vercelFetch(path: string, init?: RequestInit) {
  const token = process.env.VERCEL_TOKEN?.trim()
  if (!token) throw new Error('Missing Vercel token')

  const response = await fetch(vercelUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error('Vercel API failed')
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as unknown) : null
}

async function saveSmtpPass(password: string) {
  const projectId = process.env.VERCEL_PROJECT_ID?.trim()
  if (!projectId) throw new Error('Missing project')

  await vercelFetch(`/v10/projects/${projectId}/env?upsert=true`, {
    method: 'POST',
    body: JSON.stringify({
      key: 'SMTP_PASS',
      value: password,
      type: 'sensitive',
      target: ['production', 'preview', 'development'],
      comment: 'Heslo k firemnímu e-mailu pro odesílání poptávek',
    }),
  })
}

async function redeploy() {
  const projectId = process.env.VERCEL_PROJECT_ID?.trim()
  if (!projectId) throw new Error('Missing project')

  const payload = (await vercelFetch(
    `/v6/deployments?projectId=${encodeURIComponent(projectId)}&target=production&limit=1`,
  )) as { deployments?: Array<{ uid?: string; id?: string }> }

  const deploymentId = payload.deployments?.[0]?.uid || payload.deployments?.[0]?.id
  if (!deploymentId) return

  await vercelFetch(`/v13/deployments/${deploymentId}/redeploy`, {
    method: 'POST',
    body: JSON.stringify({ name: 'rajwood' }),
  })
}

export async function processSmtpSetup(input: unknown) {
  const secret = process.env.SETUP_SECRET?.trim()
  if (!input || typeof input !== 'object' || !secret) {
    throw new Error('Invalid setup')
  }

  const data = input as Record<string, unknown>
  const token = asText(data.token)
  const password = asText(data.password)

  if (!tokensMatch(token, secret) || password.length < 4 || password.length > 200) {
    throw new Error('Invalid setup')
  }

  await saveSmtpPass(password)
  await redeploy()
}
