import { processInquiry } from '../server/inquiryMail'

type InquiryRequest = {
  method?: string
  body?: unknown
}

type InquiryResponse = {
  status: (code: number) => {
    json: (body: { ok: boolean }) => void
  }
}

export default async function handler(req: InquiryRequest, res: InquiryResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false })
    return
  }

  try {
    await processInquiry(req.body)
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ ok: false })
  }
}
