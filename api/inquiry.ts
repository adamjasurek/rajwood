export const runtime = 'nodejs'

const INBOX = 'rajwood@seznam.cz'
const BRAND = 'RAJWOOD'
const PHONE = '+420 736 235 553'
const OWNER_SUBJECT = 'Nová poptávka!'
const CUSTOMER_SUBJECT = 'Poptávka u RAJWOOD'

export type Inquiry = {
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
    `Zpráva: ${values.message || '—'}`,
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

function encodeSubject(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`
}

function buildMessage(options: {
  from: string
  to: string
  replyTo: string
  subject: string
  text: string
}) {
  const body = Buffer.from(options.text, 'utf8').toString('base64').replace(/(.{76})/g, '$1\r\n')
  return [
    `From: "${BRAND}" <${options.from}>`,
    `To: <${options.to}>`,
    `Reply-To: <${options.replyTo}>`,
    `Subject: ${encodeSubject(options.subject)}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    body,
    '',
  ].join('\r\n')
}

type SmtpSocket = {
  write: (chunk: string) => void
  on: (event: string, listener: (data: Buffer | Error) => void) => void
  off: (event: string, listener: (data: Buffer | Error) => void) => void
  destroy: () => void
}

async function connectSmtp(host: string, port: number): Promise<SmtpSocket> {
  const tls = await import('node:tls')
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        timeout: 10000,
        minVersion: 'TLSv1.2',
      },
      () => resolve(socket),
    )
    socket.once('error', reject)
    socket.once('timeout', () => reject(new Error('SMTP timeout')))
  })
}

function smtpReader(socket: SmtpSocket) {
  let buffer = ''
  const lines: string[] = []
  let notify: (() => void) | null = null

  const onData = (data: Buffer | Error) => {
    if (data instanceof Error) return
    buffer += data.toString('utf8')
    let index = buffer.indexOf('\r\n')
    while (index >= 0) {
      lines.push(buffer.slice(0, index))
      buffer = buffer.slice(index + 2)
      index = buffer.indexOf('\r\n')
    }
    notify?.()
  }

  socket.on('data', onData)

  async function readLine() {
    const started = Date.now()
    while (!lines.length) {
      if (Date.now() - started > 10000) throw new Error('SMTP timeout')
      await new Promise<void>((resolve) => {
        notify = resolve
        setTimeout(resolve, 25)
      })
    }
    return lines.shift() as string
  }

  async function readReply() {
    const collected: string[] = []
    for (;;) {
      const line = await readLine()
      collected.push(line)
      if (/^\d{3} /.test(line)) return collected.join('\n')
    }
  }

  async function command(text: string, expected: number) {
    socket.write(`${text}\r\n`)
    const reply = await readReply()
    if (!reply.startsWith(String(expected))) {
      throw new Error(reply.slice(0, 180))
    }
    return reply
  }

  return { readReply, command, close: () => socket.destroy() }
}

async function sendSmtp(options: {
  from: string
  to: string
  replyTo: string
  subject: string
  text: string
}) {
  const host = process.env.SMTP_HOST?.trim() || 'smtp.seznam.cz'
  const port = Number(process.env.SMTP_PORT || 465)
  const user = process.env.SMTP_USER?.trim() || INBOX
  const pass = process.env.SMTP_PASS?.replace(/^\uFEFF/, '').trim()
  if (!pass) throw new Error('Missing SMTP credentials')

  const socket = await connectSmtp(host, port)
  const smtp = smtpReader(socket)

  try {
    await smtp.readReply()
    await smtp.command(`EHLO ${host}`, 250)
    const plain = Buffer.from(`\0${user}\0${pass}`).toString('base64')
    try {
      await smtp.command(`AUTH PLAIN ${plain}`, 235)
    } catch {
      await smtp.command('AUTH LOGIN', 334)
      await smtp.command(Buffer.from(user).toString('base64'), 334)
      await smtp.command(Buffer.from(pass).toString('base64'), 235)
    }
    await smtp.command(`MAIL FROM:<${options.from}>`, 250)
    await smtp.command(`RCPT TO:<${options.to}>`, 250)
    await smtp.command('DATA', 354)
    socket.write(`${buildMessage({ ...options, from: user })}\r\n.\r\n`)
    const dataReply = await smtp.readReply()
    if (!dataReply.startsWith('250')) throw new Error(dataReply.slice(0, 180))
    await smtp.command('QUIT', 221).catch(() => undefined)
  } finally {
    smtp.close()
  }
}

export async function deliverInquiry(input: unknown) {
  const values = parseInquiry(input)
  const from = process.env.SMTP_USER?.trim() || INBOX

  await sendSmtp({
    from,
    to: INBOX,
    replyTo: values.email,
    subject: OWNER_SUBJECT,
    text: ownerSummary(values),
  })

  await sendSmtp({
    from,
    to: values.email,
    replyTo: INBOX,
    subject: CUSTOMER_SUBJECT,
    text: customerSummary(values),
  })
}

export function GET() {
  return Response.json({ ok: true })
}

export async function POST(request: Request) {
  try {
    await deliverInquiry(await request.json())
    return Response.json({ ok: true })
  } catch (error) {
    console.error('[inquiry]', error)
    return Response.json({ ok: false }, { status: 500 })
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204 })
}
