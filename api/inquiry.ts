const INBOX = 'rajwood@seznam.cz'
const BRAND = 'RAJWOOD'
const PHONE = '+420 736 235 553'
const OWNER_SUBJECT = 'Nová poptávka!'
const CUSTOMER_SUBJECT = 'Poptávka u RAJWOOD'

type Inquiry = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function parseInquiry(input: unknown): Inquiry {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid inquiry')
  }

  const data = input as Record<string, unknown>
  const values: Inquiry = {
    firstName: asText(data.firstName),
    lastName: asText(data.lastName),
    email: asText(data.email),
    phone: asText(data.phone),
    message: asText(data.message),
  }

  const digits = values.phone.replace(/\D/g, '')
  const phoneOk = digits.startsWith('420') ? digits.length === 12 : digits.length === 9
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)

  if (!values.firstName || !values.lastName || !emailOk || !phoneOk || values.message.length > 5000) {
    throw new Error('Invalid inquiry')
  }

  return values
}

function customerSummary(values: Inquiry) {
  const message = values.message || '—'
  return [
    'Dobrý den,',
    '',
    'děkujeme za poptávku. Ozveme se vám co nejdříve.',
    'Níže je shrnutí odeslaných údajů:',
    '',
    `Jméno: ${values.firstName}`,
    `Příjmení: ${values.lastName}`,
    `E-mail: ${values.email}`,
    `Telefonní číslo: ${values.phone}`,
    `Zpráva: ${message}`,
    '',
    BRAND,
    PHONE,
    INBOX,
  ].join('\n')
}

function ownerSummary(values: Inquiry) {
  return [
    `Jméno: ${values.firstName}`,
    `Příjmení: ${values.lastName}`,
    `E-mail: ${values.email}`,
    `Telefonní číslo: ${values.phone}`,
    `Zpráva: ${values.message || '—'}`,
  ].join('\n')
}

async function postFormSubmit(payload: Record<string, string>, origin: string) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: JSON.stringify(payload),
    },
  )
  if (!response.ok) throw new Error('FormSubmit failed')
  const body: unknown = await response.json().catch(() => null)
  if (body && typeof body === 'object' && 'success' in body && body.success === false) {
    throw new Error('FormSubmit failed')
  }
}

async function sendViaFormSubmit(values: Inquiry, origin: string) {
  const fullName = `${values.firstName} ${values.lastName}`.trim()
  const summary = customerSummary(values)

  await postFormSubmit({
    _subject: OWNER_SUBJECT,
    _template: 'box',
    _captcha: 'false',
    _honey: '',
    _replyto: values.email,
    name: fullName,
    email: values.email,
    telefon: values.phone,
    zprava: values.message || '—',
  }, origin)

  await postFormSubmit({
    _subject: CUSTOMER_SUBJECT,
    _template: 'box',
    _captcha: 'false',
    _honey: '',
    _replyto: INBOX,
    _cc: values.email,
    _autoresponse: summary,
    email: values.email,
    zprava: summary,
  }, origin)
}

async function sendViaSmtp(values: Inquiry) {
  const user = process.env.SMTP_USER?.trim() || INBOX
  const pass = process.env.SMTP_PASS?.replace(/^\uFEFF/, '').trim()
  if (!pass) throw new Error('Missing SMTP credentials')

  const mod = (await import('nodemailer')) as unknown as {
    default?: { createTransport: typeof import('nodemailer')['createTransport'] }
    createTransport: typeof import('nodemailer')['createTransport']
  }
  const createTransport = mod.default?.createTransport ?? mod.createTransport

  const port = Number(process.env.SMTP_PORT || 465)
  const secure = port === 465
  const transport = createTransport({
    host: process.env.SMTP_HOST?.trim() || 'smtp.seznam.cz',
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  })

  const from = `"${BRAND}" <${user}>`
  try {
    await Promise.all([
      transport.sendMail({
        from,
        to: INBOX,
        replyTo: values.email,
        subject: OWNER_SUBJECT,
        text: ownerSummary(values),
      }),
      transport.sendMail({
        from,
        to: values.email,
        replyTo: INBOX,
        subject: CUSTOMER_SUBJECT,
        text: customerSummary(values),
      }),
    ])
  } finally {
    transport.close()
  }
}

export function GET() {
  return Response.json({ ok: true })
}

export async function POST(request: Request) {
  try {
    const values = parseInquiry(await request.json())
    const origin =
      request.headers.get('origin') ||
      'https://rajwood.adamjasurek.cz'
    try {
      await sendViaSmtp(values)
    } catch (error) {
      console.error('[inquiry] smtp', error)
      await sendViaFormSubmit(values, origin)
    }
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[inquiry]', error)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
