import { ChatRequest, ChatResponse, Message } from '@/types'
import { generateId } from '@/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export class ChatService {
    static async sendMessage(message: Message): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('message', message.content);
            if (message.chatId) formData.append('chatId', message.chatId);

            const response = await fetch('/api/chat', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw new Error('Failed to send message. Please try again later.');
        }
    }


    async getChatHistory(limit = 50): Promise<Message[]> {
        const response = await fetch(`${API_URL}/chat/history?limit=${limit}`)

        if (!response.ok) {
            throw new Error('Failed to fetch chat history')
        }

        return response.json()
    }

    async deleteChat(chatId: string): Promise<void> {
        const response = await fetch(`${API_URL}/chat/${chatId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete chat')
        }
    }

    // Mock AI response generator (will be replaced by MSW)
    generateAIResponse(userMessage: string): string {
        const companyInfo = {
            name: 'Solution Tech',
            mission: 'Transformar ideas en soluciones tecnológicas innovadoras que impulsen el éxito de nuestros clientes.',
            vision: 'Ser líderes reconocidos en el desarrollo de software empresarial en América Latina.',
            values: ['Innovación', 'Calidad', 'Transparencia', 'Trabajo en equipo', 'Orientación al cliente'],
            departments: [
                { name: 'Desarrollo de Software', employees: 45 },
                { name: 'Consultoría IT', employees: 20 },
                { name: 'Innovación y R&D', employees: 15 },
                { name: 'Recursos Humanos', employees: 8 },
                { name: 'Marketing y Ventas', employees: 12 },
            ],
            projects: [
                'ERP Cloud Enterprise',
                'AI Customer Service',
                'Mobile Banking App',
                'IoT Smart Factory',
            ],
        }

        const lowerMessage = userMessage.toLowerCase()

        if (lowerMessage.includes('misión') || lowerMessage.includes('mision')) {
            return `**Misión de ${companyInfo.name}:**\n\n${companyInfo.mission}\n\nNuestra misión refleja nuestro compromiso con la excelencia y la innovación.`
        }

        if (lowerMessage.includes('visión') || lowerMessage.includes('vision')) {
            return `**Visión de ${companyInfo.name}:**\n\n${companyInfo.vision}\n\nTrabajamos cada día para hacer realidad esta visión.`
        }

        if (lowerMessage.includes('valores')) {
            return `**Nuestros Valores Corporativos:**\n\n${companyInfo.values.map((v, i) => `${i + 1}. ${v}`).join('\n')}\n\nEstos valores guían todas nuestras decisiones.`
        }

        if (lowerMessage.includes('departamentos') || lowerMessage.includes('organigrama')) {
            let response = `**Estructura Organizacional:**\n\n`
            companyInfo.departments.forEach((dept) => {
                response += `• **${dept.name}**: ${dept.employees} empleados\n`
            })
            return response
        }

        if (lowerMessage.includes('proyectos')) {
            return `**Proyectos Actuales:**\n\n${companyInfo.projects.map((p) => `• ${p}`).join('\n')}\n\nTodos nuestros proyectos utilizan tecnologías de vanguardia.`
        }

        if (lowerMessage.includes('hola') || lowerMessage.includes('buenos días')) {
            return `¡Hola! Bienvenido a ${companyInfo.name}. 👋\n\nSoy tu asistente virtual y estoy aquí para ayudarte con cualquier consulta sobre nuestra empresa.\n\n¿En qué puedo ayudarte hoy?`
        }

        // Default response
        return `Gracias por tu consulta. En ${companyInfo.name} nos especializamos en desarrollo de software empresarial.\n\nPuedo ayudarte con información sobre:\n• Misión y visión\n• Valores corporativos\n• Estructura organizacional\n• Proyectos actuales\n\n¿Sobre qué tema te gustaría saber más?`
    }
}

export const chatService = new ChatService()