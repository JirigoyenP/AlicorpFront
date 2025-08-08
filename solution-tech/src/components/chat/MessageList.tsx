'use client'

import { Message } from '@/types'
import { MessageItem } from './MessageItem'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-6 md:space-y-8">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <MessageItem message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}