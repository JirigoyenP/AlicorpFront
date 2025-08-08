'use client'

import { useEffect, useRef } from 'react'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import { WelcomeScreen } from './WelcomeScreen'
import { TypingIndicator } from './TypingIndicator'
import { useChatStore } from '@/stores/chatStore'
import { useChat } from '@/hooks/useChat'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ChatInterface() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { currentChatId, getCurrentChat } = useChatStore()
  const { sendMessage, isTyping } = useChat()
  const currentChat = getCurrentChat()
  const [showScrollButton, setShowScrollButton] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, isTyping])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => scrollContainer.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return
    await sendMessage(content, files)
  }

  const handleQuickAction = (message: string) => {
    handleSendMessage(message)
  }

  return (
    <div className="flex h-full flex-col relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-30 pointer-events-none" />

      {/* Messages Area */}
      <ScrollArea
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin relative"
      >
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {!currentChat || currentChat.messages.length === 0 ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <WelcomeScreen onQuickAction={handleQuickAction} />
              </motion.div>
            ) : (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MessageList messages={currentChat.messages} />
                {isTyping && <TypingIndicator />}
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-32 right-4 md:right-8 z-10"
          >
            <Button
              onClick={scrollToBottom}
              size="icon"
              variant="outline"
              className="rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group"
            >
              <ArrowDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-xl relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="mx-auto max-w-4xl px-4 py-4 md:px-6 lg:px-8">
          <MessageInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'