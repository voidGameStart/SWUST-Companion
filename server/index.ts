import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

app.post('/api/agent', async (req, res) => {
  const { message } = req.body
  if (!message) return res.status(400).json({ error: 'missing message' })

  // 简单示例：如果使用 OpenAI REST，请替换为你的请求逻辑/SDK
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 替换为可用模型
        messages: [{ role: 'user', content: message }]
      })
    })
    const json = await resp.json()
    const reply = json.choices?.[0]?.message?.content ?? '没有返回内容'
    res.json({ reply })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'proxy failed' })
  }
})

app.listen(3000, () => console.log('Agent proxy running on http://localhost:3000'))
