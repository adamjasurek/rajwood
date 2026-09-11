import { processSmtpSetup } from '../server/setupSmtp'

type SetupRequest = {
  method?: string
  body?: unknown
}

type SetupResponse = {
  status: (code: number) => {
    json: (body: { ok: boolean }) => void
  }
}

export default async function handler(req: SetupRequest, res: SetupResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false })
    return
  }

  try {
    await processSmtpSetup(req.body)
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
}
