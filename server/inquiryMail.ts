import nodemailer from 'nodemailer'
import { site } from '../src/content/site'

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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('420')) return digits.length === 12
  return digits.length === 9
}

export function parseInquiry(input: unknown): Inquiry {
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

  if (
    !values.firstName ||
    !values.lastName ||
    !isValidEmail(values.email) ||
    !isValidPhone(values.phone) ||
    values.message.length > 5000
  ) {
    throw new Error('Invalid inquiry')
  }

  return values
}

function customerSummary(values: Inquiry) {
  const form = site.footer.form
  const message = values.message.trim() || '—'

  return [
    'Dobrý den,',
    '',
    form.autoresponse,
    '',
    `${form.firstName}: ${values.firstName}`,
    `${form.lastName}: ${values.lastName}`,
    `${form.email}: ${values.email}`,
    `${form.phone}: ${values.phone}`,
    `${form.messageSummary}: ${message}`,
    '',
    site.name,
    site.phone.display,
    site.email,
  ].join('\n')
}

function ownerSummary(values: Inquiry) {
  const form = site.footer.form
  const message = values.message.trim() || '—'

  return [
    `${form.firstName}: ${values.firstName}`,
    `${form.lastName}: ${values.lastName}`,
    `${form.email}: ${values.email}`,
    `${form.phone}: ${values.phone}`,
    `${form.messageSummary}: ${message}`,
  ].join('\n')
}

function smtpAuth() {
  const user = process.env.SMTP_USER?.trim() || site.email
  const pass = process.env.SMTP_PASS?.replace(/^\uFEFF/, '').trim()
  if (!user || !pass) {
    throw new Error('Missing SMTP credentials')
  }
  return { user, pass }
}

function createTransport(port: number) {
  const secure = port === 465

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || 'smtp.seznam.cz',
    port,
    secure,
    requireTLS: !secure,
    auth: smtpAuth(),
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    tls: { minVersion: 'TLSv1.2' },
  })
}

async function sendBoth(values: Inquiry, port: number) {
  const from = `"${site.name}" <${smtpAuth().user}>`
  const to = site.email.trim()
  const form = site.footer.form
  const transport = createTransport(port)

  try {
    await Promise.all([
      transport.sendMail({
        from,
        to,
        replyTo: values.email,
        subject: form.inquirySubject,
        text: ownerSummary(values),
      }),
      transport.sendMail({
        from,
        to: values.email,
        replyTo: to,
        subject: form.customerSubject,
        text: customerSummary(values),
      }),
    ])
  } finally {
    transport.close()
  }
}

export async function processInquiry(input: unknown) {
  const values = parseInquiry(input)
  const preferred = Number(process.env.SMTP_PORT || 465)
  const ports = [...new Set([preferred, preferred === 587 ? 465 : 587])]

  let lastError: unknown
  for (const port of ports) {
    try {
      await sendBoth(values, port)
      return
    } catch (error) {
      lastError = error
      console.error('[inquiry] smtp', port, error)
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Send failed')
}
