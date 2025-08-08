'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatHistory } from '@/components/history/ChatHistory'
import { Plus, Search, X, MessageSquarePlus, HardDrive, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStorageUsage, formatFileSize } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  onLoadChat: (chatId: string) => void
  currentChatId: string | null
  isMobile?: boolean
}

export function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  onLoadChat,
  currentChatId,
  isMobile = false,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [storageInfo, setStorageInfo] = useState({ used: 0, total: 0, percentage: 0 })
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  useEffect(() => {
    const updateStorage = () => {
      setStorageInfo(getStorageUsage())
    }

    updateStorage()
    const interval = setInterval(updateStorage, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleNewChat = () => {
    onNewChat()
    if (isMobile) {
      onToggle()
    }
  }

  const handleLoadChat = (chatId: string) => {
    onLoadChat(chatId)
    if (isMobile) {
      onToggle()
    }
  }

  return (
    <div className="flex h-full flex-col bg-card/50 backdrop-blur-xl">
      {/* Header */}
      <div className="border-b bg-background/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Conversaciones</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <Button
          onClick={handleNewChat}
          className="w-full button-gradient group relative overflow-hidden"
          size="lg"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          <span className="relative">Nueva conversación</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b bg-background/30">
        <div className={cn(
          "relative transition-all duration-200",
          isSearchFocused && "scale-[1.02]"
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
            isSearchFocused ? "text-primary" : "text-muted-foreground"
          )} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Buscar conversaciones..."
            className={cn(
              "pl-10 pr-10 transition-all duration-200",
              "bg-background/50 backdrop-blur-sm",
              isSearchFocused && "ring-2 ring-primary/30 border-primary/50"
            )}
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-2">
        <div className="py-2">
          <ChatHistory
            searchQuery={searchQuery}
            currentChatId={currentChatId}
            onSelectChat={handleLoadChat}
          />
        </div>
      </ScrollArea>

      {/* Storage Info */}
      <div className="border-t bg-background/50 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Almacenamiento</span>
            </div>
            <span className="font-medium text-xs">
              {formatFileSize(storageInfo.used)} / {formatFileSize(storageInfo.total)}
            </span>
          </div>
          <div className="space-y-1">
            <Progress 
              value={storageInfo.percentage} 
              className="h-2 bg-muted/50"
            />
            <p className="text-xs text-muted-foreground text-center">
              {storageInfo.percentage.toFixed(1)}% usado
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}