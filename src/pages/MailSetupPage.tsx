import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { WoodBackdrop } from '../components/WoodBackdrop'
import { site } from '../content/site'

const fieldClass =
  'mt-2 min-h-12 w-full border border-line bg-paper px-3.5 py-3 text-[16px] text-ink placeholder:text-mute/70 sm:px-4'

const errorClass = 'border-[#8a3428]'

export function MailSetupPage() {
  const { token = '' } = useParams()
  const copy = site.mailSetup
  const [password, setPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    if (!password.trim()) {
      setError(copy.passwordError)
      return
    }

    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/setup-smtp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })
      if (!response.ok) throw new Error('Setup failed')
      setSaved(true)
    } catch {
      setError(copy.error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="border-b border-line">
      <article className="mx-auto max-w-[36rem] px-4 py-10 sm:px-5 sm:py-16 lg:py-20">
        {saved ? (
          <div className="text-center" role="status" aria-live="polite">
            <h1 className="font-serif text-[1.85rem] font-medium tracking-[-0.02em] sm:text-[2.4rem]">
              {copy.successTitle}
            </h1>
            <p className="mt-3 text-[1.05rem] text-mute">{copy.successText}</p>
            <a
              href={`https://wa.me/${copy.whatsappTel}?text=${encodeURIComponent(copy.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wood mt-8 inline-flex h-12 w-full items-center justify-center text-[0.95rem] font-medium tracking-wide text-paper no-underline sm:w-auto sm:px-7"
            >
              <WoodBackdrop />
              <span className="relative z-[1]">{copy.whatsappCta}</span>
            </a>
          </div>
        ) : (
          <>
            <h1 className="text-balance font-serif text-[1.85rem] font-medium leading-tight tracking-[-0.02em] sm:text-[2.75rem]">
              {copy.title}
            </h1>
            <form onSubmit={onSubmit} className="mt-8 grid gap-4" aria-busy={saving}>
              <label className="block text-[0.82rem] font-medium tracking-wide text-mute">
                {copy.password}
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (error) setError('')
                  }}
                  required
                  className={`${fieldClass} ${error ? errorClass : ''}`}
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="btn-wood mt-2 inline-flex h-12 w-full cursor-pointer items-center justify-center text-[0.95rem] font-medium tracking-wide text-paper disabled:cursor-wait disabled:opacity-70"
              >
                <WoodBackdrop />
                <span className="relative z-[1]">
                  {saving ? copy.saving : copy.submit}
                </span>
              </button>
              {error ? (
                <p role="alert" className="text-center text-[0.95rem] text-[#8a3428]">
                  {error}
                </p>
              ) : null}
            </form>
          </>
        )}
      </article>
    </main>
  )
}
