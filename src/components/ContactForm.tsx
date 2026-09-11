import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { sendInquiry } from '../lib/sendInquiry'
import { WoodBackdrop } from './WoodBackdrop'

const fieldClass =
  'mt-2 min-h-12 w-full border border-line bg-paper px-3.5 py-3 text-[16px] text-ink placeholder:text-mute/70 sm:px-4'

const errorClass = 'border-[#8a3428]'

type FieldKey = 'firstName' | 'lastName' | 'email' | 'phone' | 'message'
type FormValues = Record<FieldKey, string> & { consent: boolean }
type FormErrors = Partial<Record<FieldKey | 'consent' | 'send', string>>

const fieldOrder: Array<FieldKey | 'consent'> = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'message',
  'consent',
]

function readValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form)
  return {
    firstName: String(data.get('firstName') ?? '').trim(),
    lastName: String(data.get('lastName') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
    phone: String(data.get('phone') ?? '').trim(),
    message: String(data.get('message') ?? '').trim(),
    consent: data.get('consent') === 'on',
  }
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('420')) return digits.length === 12
  return digits.length === 9
}

function validate(values: FormValues): FormErrors {
  const copy = site.footer.form.errors
  const errors: FormErrors = {}

  if (!values.firstName) errors.firstName = copy.firstName
  if (!values.lastName) errors.lastName = copy.lastName
  if (!values.email) errors.email = copy.email
  else if (!isValidEmail(values.email)) errors.email = copy.emailInvalid
  if (!values.phone) errors.phone = copy.phone
  else if (!isValidPhone(values.phone)) errors.phone = copy.phoneInvalid
  if (!values.consent) errors.consent = copy.consent

  return errors
}

function Field({
  label,
  error,
  errorId,
  children,
}: {
  label: string
  error?: string
  errorId: string
  children: ReactNode
}) {
  return (
    <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
      {label}
      {children}
      {error ? (
        <span
          id={errorId}
          role="alert"
          className="mt-1.5 block text-[0.82rem] font-normal text-[#8a3428]"
        >
          {error}
        </span>
      ) : null}
    </label>
  )
}

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [attempted, setAttempted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const copy = site.footer.form

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return
    const form = event.currentTarget
    const values = readValues(form)
    const nextErrors = validate(values)
    setAttempted(true)
    setErrors(nextErrors)

    const firstInvalid = fieldOrder.find((name) => nextErrors[name])
    if (firstInvalid) {
      const field = form.elements.namedItem(firstInvalid)
      if (field instanceof HTMLElement) field.focus()
      return
    }

    setSending(true)
    try {
      await sendInquiry(values)
      setSent(true)
    } catch {
      setErrors({ send: copy.errors.send })
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div
        className="mx-auto mt-10 max-w-[36rem] text-center"
        role="status"
        aria-live="polite"
      >
        <p className="font-serif text-[2rem] font-medium tracking-[-0.02em] sm:text-[2.4rem]">
          {copy.successTitle}
        </p>
        <p className="mt-3 text-[1.05rem] text-mute">{copy.successText}</p>
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      onInput={(event) => {
        if (!attempted) return
        setErrors(validate(readValues(event.currentTarget)))
      }}
      onChange={(event) => {
        if (!attempted) return
        setErrors(validate(readValues(event.currentTarget)))
      }}
      className="mx-auto mt-8 grid max-w-[36rem] gap-4 text-left sm:mt-10"
      aria-busy={sending}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={copy.firstName}
          error={errors.firstName}
          errorId="contact-firstName-error"
        >
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            autoCapitalize="words"
            autoCorrect="off"
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? 'contact-firstName-error' : undefined}
            className={`${fieldClass} ${errors.firstName ? errorClass : ''}`}
          />
        </Field>
        <Field
          label={copy.lastName}
          error={errors.lastName}
          errorId="contact-lastName-error"
        >
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            autoCapitalize="words"
            autoCorrect="off"
            required
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? 'contact-lastName-error' : undefined}
            className={`${fieldClass} ${errors.lastName ? errorClass : ''}`}
          />
        </Field>
      </div>
      <Field
        label={copy.email}
        error={errors.email}
        errorId="contact-email-error"
      >
        <input
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
          className={`${fieldClass} ${errors.email ? errorClass : ''}`}
        />
      </Field>
      <Field
        label={copy.phone}
        error={errors.phone}
        errorId="contact-phone-error"
      >
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
          className={`${fieldClass} ${errors.phone ? errorClass : ''}`}
        />
      </Field>
      <Field
        label={copy.message}
        error={errors.message}
        errorId="contact-message-error"
      >
        <textarea
          name="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          className={`${fieldClass} min-h-[8.5rem] resize-y ${errors.message ? errorClass : ''}`}
        />
      </Field>
      <div>
        <div className="flex items-start gap-3 py-1">
          <input
            id="contact-consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#4a2d1c]"
          />
          <div className="min-w-0 text-[0.9rem] leading-relaxed text-ink">
            <label htmlFor="contact-consent">{copy.consent}{' '}</label>
            <Link
              to={site.legal.privacy.path}
              className="underline decoration-line underline-offset-2 hover:text-mute"
            >
              {copy.consentLink}
            </Link>
            .
          </div>
        </div>
        {errors.consent ? (
          <p
            id="contact-consent-error"
            role="alert"
            className="mt-1.5 text-[0.82rem] text-[#8a3428]"
          >
            {errors.consent}
          </p>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="btn-wood mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center text-[0.95rem] font-medium tracking-wide text-paper disabled:cursor-wait disabled:opacity-70"
      >
        <WoodBackdrop />
        <span className="relative z-[1]">
          {sending ? copy.sending : copy.submit}
        </span>
      </button>
      {errors.send ? (
        <p role="alert" className="text-center text-[0.95rem] text-[#8a3428]">
          {errors.send}
        </p>
      ) : null}
    </form>
  )
}
