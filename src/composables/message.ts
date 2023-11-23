import { ref } from 'vue'

import { conversation } from '@/api/chat'
import type { ChatMessage, Result } from '@/types'

export const useMessage = () => {
  const isTalking = ref(false)

  const chatId = ref()
  const messageContent = ref('')

  const messageList = ref<ChatMessage[]>([
    {
      role: 'assistant',
      content: `你好，我是智能 AI 客服，我可以提供针对链家房源的咨询服务，例如：
  
  1. 天津有哪些楼盘？
  2. 北京丰台区有哪些楼盘？
  
  请告诉我你需要哪方面的帮助，我会根据你的需求给你提供相应的信息和建议。`
    }
  ])

  const clearMessageContent = () => (messageContent.value = '')

  const sendChatMessage = async (
    content: string = messageContent.value,
    apiKey: string
  ) => {
    try {
      isTalking.value = true
      if (messageList.value.length === 2) {
        messageList.value.pop()
      }
      messageList.value.push({ role: 'user', content })
      clearMessageContent()
      messageList.value.push({ role: 'assistant', content: '' })

      const data = await conversation(
        {
          chatId: chatId.value,
          question: content
        },
        apiKey
      )

      await readData(data)
    } catch (error: any) {
      appendLastMessageContent(error)
    } finally {
      isTalking.value = false
    }
  }

  const readData = async (result: Result) => {
    if (result.code !== 200) {
      appendLastMessageContent(result.message)
      return
    }

    if (!result.data) {
      appendLastMessageContent('未查询到结果')
      return
    }

    const { chatId: id, answer } = result.data

    chatId.value = id

    let content = `| Title | CityName | StoreAddr |\n| ---- | --- | ---- |`

    if (answer && Array.isArray(answer.queries)) {
      answer.queries.forEach(query => {
        const { newHouses } = query.data

        newHouses.forEach(house => {
          content += `\n| ${house.title} | ${house.city_name} | ${house.store_addr} |`
        })
      })
    }

    appendLastMessageContent(content)
  }

  const appendLastMessageContent = (content: string) =>
    (messageList.value[messageList.value.length - 1].content += content)

  return {
    isTalking,
    messageContent,
    messageList,

    sendChatMessage,
    clearMessageContent
  }
}
