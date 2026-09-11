export type Inquiry = {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export async function sendInquiry(values: Inquiry) {
  const response = await fetch('/api/inquiry', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error('Send failed')
  }
}
