'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot } from 'lucide-react'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-secondary text-secondary-foreground">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="rounded-lg bg-muted px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">El asistente está escribiendo</span>
          <div className="typing-indicator flex gap-1 ml-1">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}