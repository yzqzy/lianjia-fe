import type { Question, Result } from '@/types'

export async function chat(data: Question, apiKey: string): Promise<Result> {
  try {
    const result = await fetch(
      'https://chat.yueluo.club/api/chat/conversation',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
      }
    )
    return result.json()
  } catch (error) {
    throw error
  }
}
