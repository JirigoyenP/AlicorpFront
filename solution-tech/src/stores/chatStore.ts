import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Chat, Message } from  '@/types'
import { generateId } from '@/lib/utils'

interface ChatStore {
  chats: Chat[]
  currentChatId: string | null
  
  // Actions
  createNewChat: () => string
  loadChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  addMessage: (message: Message) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  getCurrentChat: () => Chat | null
  searchChats: (query: string) => Chat[]
  clearAllChats: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,

      createNewChat: () => {
        const newChat: Chat = {
          id: generateId(),
          title: 'Nueva conversación',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }))

        return newChat.id
      },

      loadChat: (chatId) => {
        set({ currentChatId: chatId })
      },

      deleteChat: (chatId) => {
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        }))
      },

      addMessage: (message) => {
        const { currentChatId, chats } = get()
        
        if (!currentChatId) {
          // Create a new chat if none exists
          const newChatId = get().createNewChat()
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === newChatId
                ? {
                    ...chat,
                    messages: [message],
                    title: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
                    updatedAt: new Date(),
                  }
                : chat
            ),
          }))
        } else {
          set((state) => ({
            chats: state.chats.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: [...chat.messages, message],
                    title: chat.messages.length === 0 
                      ? message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '')
                      : chat.title,
                    updatedAt: new Date(),
                  }
                : chat
            ),
          }))
        }
      },

      updateChat: (chatId, updates) => {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? { ...chat, ...updates, updatedAt: new Date() }
              : chat
          ),
        }))
      },

      getCurrentChat: () => {
        const { chats, currentChatId } = get()
        return chats.find((chat) => chat.id === currentChatId) || null
      },

      searchChats: (query) => {
        const { chats } = get()
        const lowerQuery = query.toLowerCase()
        
        return chats.filter((chat) => {
          const titleMatch = chat.title.toLowerCase().includes(lowerQuery)
          const messagesMatch = chat.messages.some((msg) =>
            msg.content.toLowerCase().includes(lowerQuery)
          )
          return titleMatch || messagesMatch
        })
      },

      clearAllChats: () => {
        set({ chats: [], currentChatId: null })
      },
    }),
    {
      name: 'solution-tech-chat-storage',
      partialize: (state) => ({
        chats: state.chats,
        currentChatId: state.currentChatId,
      }),
    }
  )
)

export { Chat }
