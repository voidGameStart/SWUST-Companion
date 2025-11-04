export async function sendToAgent(message: string): Promise<string> {
  const res = await fetch('/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  if (!res.ok) throw new Error('agent request failed')
  const data = await res.json()
  // 期望后端返回 { reply: '...' }
  return data.reply ?? ''
}
