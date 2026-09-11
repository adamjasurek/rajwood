import { site } from '../content/site'

export type Inquiry = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export async function sendInquiry(values: Inquiry) {
  const to = site.email.trim()
  if (!to) {
    throw new Error('Missing inbox')
  }

  const fullName = `${values.firstName} ${values.lastName}`.trim()
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _subject: `Poptávka RAJWOOD — ${fullName}`,
        _template: 'box',
        _captcha: 'false',
        _honey: '',
        name: fullName,
        email: values.email || to,
        telefon: values.phone,
        zprava: values.message || '—',
        souhlas_gdpr: 'ano',
      }),
    },
  )

  if (!response.ok) {
    throw new Error('Send failed')
  }

  const payload: unknown = await response.json().catch(() => null)
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    payload.success === false
  ) {
    throw new Error('Send failed')
  }
}
