import { useState, type FormEvent, type ReactNode } from 'react'
import { site } from '../content/site'
import { sendInquiry } from '../lib/sendInquiry'

const fieldClass =
  'mt-2 w-full border border-line bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-mute/70'

const errorClass = 'border-[#8a3428]'

type FieldKey = 'firstName' | 'lastName' | 'email' | 'phone' | 'message'
type FormValues = Record<FieldKey, string>
type FormErrors = Partial<Record<FieldKey | 'send', string>>

const fieldOrder: FieldKey[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'message',
]

function readValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form)
  return {
    firstName: String(data.get('firstName') ?? '').trim(),
    lastName: String(data.get('lastName') ?? '').trim(),
    email: String(data.get('email') ?? '').trim(),
    phone: String(data.get('phone') ?? '').trim(),
    message: String(data.get('message') ?? '').trim(),
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
  if (values.email && !isValidEmail(values.email)) errors.email = copy.email
  if (!values.phone) errors.phone = copy.phone
  else if (!isValidPhone(values.phone)) errors.phone = copy.phoneInvalid

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
      className="mx-auto mt-10 grid max-w-[36rem] gap-4 text-left"
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
      <button
        type="submit"
        disabled={sending}
        className="mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center bg-wood text-[0.95rem] font-medium tracking-wide text-paper transition-colors duration-300 hover:bg-wood-deep disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? copy.sending : copy.submit}
      </button>
      {errors.send ? (
        <p role="alert" className="text-center text-[0.95rem] text-[#8a3428]">
          {errors.send}
        </p>
      ) : null}
    </form>
  )
}
