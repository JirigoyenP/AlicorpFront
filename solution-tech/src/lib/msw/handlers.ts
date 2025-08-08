import { http, HttpResponse, delay } from 'msw'
import { ChatResponse, Message } from '@/types'
import { generateId } from '@/lib/utils'
import { chatService } from '@/services/chatService'

export const handlers = [
  // Send message endpoint
  http.post('/api/chat', async ({ request }) => {
    // Simulate network delay
    await delay(1000 + Math.random() * 1000)

    const formData = await request.formData()
    const message = formData.get('message') as string
    const chatId = formData.get('chatId') as string | null

    // Generate AI response
    const aiResponseContent = chatService.generateAIResponse(message)

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: aiResponseContent,
      timestamp: new Date(),
    }

    const response: ChatResponse = {
      message: assistantMessage,
      suggestedQuestions: getSuggestedQuestions(message),
    }

    return HttpResponse.json(response)
  }),

  // Get chat history endpoint
  http.get('/api/chat/history', async ({ request }) => {
    await delay(500)

    // Return empty array for now (would be populated from a database)
    return HttpResponse.json([])
  }),

  // Delete chat endpoint
  http.delete('/api/chat/:chatId', async ({ params }) => {
    await delay(300)
    
    return HttpResponse.json({ success: true })
  }),
]

function getSuggestedQuestions(userMessage: string): string[] {
  const lowerMessage = userMessage.toLowerCase()

  if (lowerMessage.includes('misión') || lowerMessage.includes('visión')) {
    return [
      '¿Cuáles son los valores de la empresa?',
      '¿Qué proyectos están en desarrollo?',
      '¿Cuál es la estructura organizacional?',
    ]
  }

  if (lowerMessage.includes('proyecto')) {
    return [
      '¿Qué tecnologías utilizan?',
      '¿Cuántos empleados tiene la empresa?',
      '¿Cómo puedo contactar con Solution Tech?',
    ]
  }

  if (lowerMessage.includes('departamento') || lowerMessage.includes('organigrama')) {
    return [
      '¿Quiénes son los gerentes de cada área?',
      '¿Cuántos empleados hay en total?',
      '¿Qué hace el departamento de I+D?',
    ]
  }

  // Default suggestions
  return [
    '¿Cuál es la misión de Solution Tech?',
    '¿Qué servicios ofrecen?',
    '¿Cómo puedo contactar con la empresa?',
  ]
}