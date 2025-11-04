<template>
  <section class="chat">
    <div class="messages">
      <div v-for="(m, i) in messages" :key="i" :class="['msg', m.role]">
        <strong>{{ m.role === 'user' ? '你' : '智能体' }}:</strong>
        <span>{{ m.content }}</span>
      </div>
    </div>

    <form @submit.prevent="onSend" class="composer">
      <input v-model="input" placeholder="输入消息..." />
      <button type="submit" :disabled="sending">发送</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { sendToAgent } from '../services/agent'

type Msg = { role: 'user' | 'agent'; content: string }

const messages = ref<Msg[]>([
  { role: 'agent', content: '你好，我是智能体。你想聊什么？' }
])
const input = ref('')
const sending = ref(false)

async function onSend() {
  const text = input.value && input.value.trim()
  if (!text) return
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  sending.value = true
  try {
    const reply = await sendToAgent(text)
    messages.value.push({ role: 'agent', content: reply })
  } catch (e) {
    messages.value.push({ role: 'agent', content: '请求失败，请稍后再试。' })
    console.error(e)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.chat { border: 1px solid #ddd; padding: 12px; border-radius: 6px; max-width: 760px; margin: 1rem auto; }
.messages { max-height: 360px; overflow:auto; margin-bottom:8px; }
.msg { padding:6px 8px; border-radius:4px; margin-bottom:6px; }
.msg.user { background:#e6f7ff; text-align:right; }
.msg.agent { background:#fafafa; text-align:left; }
.composer { display:flex; gap:8px; }
input { flex:1; padding:8px; }
button { padding:8px 12px; }
</style>
