'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { useChatStore } from '@/stores/chatStore'
import { useUIStore } from '@/stores/uiStore'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import './globals.css'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { currentChatId, createNewChat, loadChat } = useChatStore()
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setSidebarOpen])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">Cargando Solution Tech Chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background via-background to-muted/5">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">


        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed md:relative z-40 h-full bg-card/95 backdrop-blur-xl border-r transition-all duration-300 ease-in-out',
            'w-80 lg:w-96',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            !sidebarOpen && 'md:w-0 md:border-r-0'
          )}
        >
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onNewChat={createNewChat}
            onLoadChat={loadChat}
            currentChatId={currentChatId}
            isMobile={isMobile}
          />
        </aside>
        
        <main className={cn(
          'flex-1 overflow-hidden transition-all duration-300',
          'bg-gradient-to-br from-background via-background to-accent/5'
        )}>
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}