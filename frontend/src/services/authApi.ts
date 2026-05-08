const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

async function handleResponse(res: Response) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message[0] : (data?.message ?? 'เกิดข้อผิดพลาด')
    throw new Error(msg)
  }
  return data
}

export async function apiLogin(username: string, password: string): Promise<string> {
  const data = await handleResponse(
    await fetch(`${API_URL}/v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  )
  return data.token as string
}

export async function apiRegister(username: string, email: string, password: string): Promise<void> {
  await handleResponse(
    await fetch(`${API_URL}/v1/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
  )
}
