export type Inquiry = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

const INBOX = 'rajwood@seznam.cz'

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
    'RAJWOOD',
    '+420 736 235 553',
    INBOX,
  ].join('\n')
}

async function postFormSubmit(payload: Record<string, string>) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(INBOX)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )
  if (!response.ok) throw new Error('Send failed')
  const body: unknown = await response.json().catch(() => null)
  if (body && typeof body === 'object' && 'success' in body && body.success === false) {
    throw new Error('Send failed')
  }
}

async function sendViaFormSubmit(values: Inquiry) {
  const fullName = `${values.firstName} ${values.lastName}`.trim()
  const summary = customerSummary(values)

  await postFormSubmit({
    _subject: 'Nová poptávka!',
    _template: 'box',
    _captcha: 'false',
    _honey: '',
    _replyto: values.email,
    name: fullName,
    email: values.email,
    telefon: values.phone,
    zprava: values.message || '—',
  })

  await postFormSubmit({
    _subject: 'Poptávka u RAJWOOD',
    _template: 'box',
    _captcha: 'false',
    _honey: '',
    _replyto: INBOX,
    _cc: values.email,
    _autoresponse: summary,
    email: values.email,
    zprava: summary,
  })
}

export async function sendInquiry(values: Inquiry) {
  try {
    const response = await fetch('/api/inquiry', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    if (response.ok) return
  } catch {
    // Fall through to FormSubmit from the browser.
  }

  await sendViaFormSubmit(values)
}
