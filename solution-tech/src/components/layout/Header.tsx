'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Menu, Sun, Moon, Download, Settings, Sparkles, Trash2 } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useChatStore } from '@/stores/chatStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar, sidebarOpen } = useUIStore()
  const { getCurrentChat, clearAllChats } = useChatStore()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExportChat = () => {
    const currentChat = getCurrentChat()
    if (!currentChat) {
      toast({
        title: 'No hay chat activo',
        description: 'Crea o selecciona un chat para exportar',
        variant: 'destructive',
      })
      return
    }

    const exportData = {
      ...currentChat,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${currentChat.id}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: '✅ Chat exportado',
      description: 'El chat se ha descargado correctamente',
    })
  }

  const handleClearAllChats = () => {
    if (confirm('¿Estás seguro de que deseas eliminar todos los chats? Esta acción no se puede deshacer.')) {
      clearAllChats()
      toast({
        title: '🗑️ Chats eliminados',
        description: 'Se han eliminado todos los chats',
      })
    }
  }

  if (!mounted) {
    // Return a skeleton header to prevent layout shift
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 h-16" />
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 gap-3 md:gap-4">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hidden md:flex"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu className={cn(
            "h-5 w-5 transition-transform duration-200",
            !sidebarOpen && "rotate-180"
          )} />
        </Button>

        {/* Logo/Brand section */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-xl" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Solution Tech Chat
            </h1>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
              Sistema de Consultas Empresariales
            </p>
          </div>
          <Sparkles className="h-4 w-4 text-primary/60 animate-pulse hidden sm:block" />
        </div>

        {/* Action buttons */}
        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {/* Export chat button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExportChat}
            className="relative group"
            aria-label="Exportar chat"
          >
            <Download className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-8 right-0 text-xs bg-popover px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Exportar chat
            </span>
          </Button>

          {/* Theme toggle button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative group"
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            )}
            <span className="absolute -bottom-8 right-0 text-xs bg-popover px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Cambiar tema
            </span>
          </Button>

          {/* Settings dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group"
                aria-label="Configuración"
              >
                <Settings className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:rotate-90 duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Configuración</p>
                  <p className="text-xs text-muted-foreground">Gestiona tu aplicación</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleExportChat} 
                className="cursor-pointer"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Exportar chat actual</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleClearAllChats}
                className="text-destructive cursor-pointer hover:bg-destructive/10 focus:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Eliminar todos los chats</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}