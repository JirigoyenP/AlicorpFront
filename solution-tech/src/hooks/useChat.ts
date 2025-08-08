import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useChatStore } from '@/stores/chatStore'
import { ChatService } from '@/services/chatService'
import { Message, FileAttachment } from '@/types'
import { generateId } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

export function useChat() {
    const [isTyping, setIsTyping] = useState(false)
    const { addMessage, getCurrentChat, currentChatId } = useChatStore()

    const sendMessageMutation = useMutation({
        mutationFn: async ({ content, files }: { content: string; files?: File[] }) => {
            // Process files if any
            let attachments: FileAttachment[] = []
            if (files && files.length > 0) {
                attachments = await Promise.all(
                    files.map(async (file) => ({
                        id: generateId(),
                        name: file.name,
                        size: file.size,
                        type: getFileType(file),
                        mimeType: file.type,
                        url: URL.createObjectURL(file),
                        uploadedAt: new Date(),
                    }))
                )
            }

            // Create user message
            const userMessage: Message = {
                id: generateId(),
                role: 'user',
                content,
                timestamp: new Date(),
                attachments,
            }

            // Add user message to store
            addMessage(userMessage)

            // Send to API and get response
            setIsTyping(true)
            const response = await ChatService.sendMessage({
                id: generateId(),
                role: 'user',
                content,
                timestamp: new Date(),
                attachments,
            })

            return response
        },
        onSuccess: (response) => {
            // Add assistant message to store
            addMessage(response.message)
            setIsTyping(false)
        },
        onError: (error) => {
            setIsTyping(false)
            toast({
                title: 'Error',
                description: 'No se pudo enviar el mensaje. Por favor, intenta de nuevo.',
                variant: 'destructive',
            })
            console.error('Error sending message:', error)
        },
    })

    const sendMessage = async (content: string, files?: File[]) => {
        if (!content.trim() && (!files || files.length === 0)) return
        await sendMessageMutation.mutateAsync({ content, files })
    }

    const getFileType = (file: File): FileAttachment['type'] => {
        if (file.type.startsWith('image/')) return 'image'
        if (file.type === 'video/mp4') return 'video'
        if (file.type === 'application/pdf') return 'pdf'
        return 'other'
    }

    return {
        sendMessage,
        isTyping,
        isLoading: sendMessageMutation.isPending,
        currentChat: getCurrentChat(),
    }
}