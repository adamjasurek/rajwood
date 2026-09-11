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

function createTransport() {
  const user = process.env.SMTP_USER?.trim() || site.email
  const pass = process.env.SMTP_PASS
  if (!user || !pass) {
    throw new Error('Missing SMTP credentials')
  }

  const port = Number(process.env.SMTP_PORT || 465)

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.seznam.cz',
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function processInquiry(input: unknown) {
  const values = parseInquiry(input)
  const from = `"${site.name}" <${process.env.SMTP_USER?.trim() || site.email}>`
  const to = site.email.trim()
  const form = site.footer.form
  const transport = createTransport()

  await transport.sendMail({
    from,
    to,
    replyTo: values.email,
    subject: form.inquirySubject,
    text: ownerSummary(values),
  })

  await transport.sendMail({
    from,
    to: values.email,
    replyTo: to,
    subject: form.customerSubject,
    text: customerSummary(values),
  })
}
