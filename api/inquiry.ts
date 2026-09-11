import { getMethod, jsonReply, readJsonBody } from '../server/http'
import { processInquiry } from '../server/inquiryMail'

export const config = {
  runtime: 'nodejs',
  maxDuration: 20,
}

export default async function handler(req: unknown, res?: unknown) {
  const method = getMethod(req)
  if (method === 'OPTIONS') {
    return jsonReply(res, 204, { ok: true })
  }
  if (method !== 'POST') {
    return jsonReply(res, 405, { ok: false })
  }

  try {
    await processInquiry(await readJsonBody(req))
    return jsonReply(res, 200, { ok: true })
  } catch (error) {
    console.error('[inquiry]', error)
    return jsonReply(res, 500, { ok: false })
  }
}
