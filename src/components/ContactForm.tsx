import { useState, type FormEvent } from 'react'
import { site } from '../content/site'

const fieldClass =
  'mt-2 w-full border border-line bg-paper px-4 py-3 text-[1rem] text-ink placeholder:text-mute/70'

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const copy = site.footer.form

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const firstName = String(data.get('firstName') ?? '').trim()
    const lastName = String(data.get('lastName') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const fullName = `${firstName} ${lastName}`.trim()
    const subject = encodeURIComponent(`Poptávka RAJWOOD — ${fullName}`)
    const body = encodeURIComponent(
      `Jméno: ${firstName}\nPříjmení: ${lastName}\nE-mail: ${email}\nTelefon: ${phone}\n\n${message}`,
    )
    const to = site.email
    window.location.href = to
      ? `mailto:${to}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto mt-10 grid max-w-[36rem] gap-4 text-left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
          {copy.firstName}
          <input
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
          {copy.lastName}
          <input
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            className={fieldClass}
          />
        </label>
      </div>
      <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
        {copy.email}
        <input
          name="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
        {copy.phone}
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className={fieldClass}
        />
      </label>
      <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
        {copy.message}
        <textarea
          name="message"
          required
          rows={5}
          className={`${fieldClass} min-h-[8.5rem] resize-y`}
        />
      </label>
      <button
        type="submit"
        className="mt-2 inline-flex h-12 w-full items-center justify-center bg-wood text-[0.95rem] font-medium tracking-wide text-paper"
      >
        {copy.submit}
      </button>
      {sent ? (
        <p className="text-center text-[0.95rem] text-mute">
          Otevře se e-mail. Pokud ne, zavolejte.
        </p>
      ) : null}
    </form>
  )
}
