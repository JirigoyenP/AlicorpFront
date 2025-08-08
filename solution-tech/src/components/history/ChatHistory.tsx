'use client'

import { useState } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { HistoryItem } from './HistoryItem'
import { 
  MessageCircle, 
  Filter, 
  Trash2, 
  Calendar,
  MessageSquare,
  Clock,
  SortAsc,
  SortDesc,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import type { Chat } from '@/stores/chatStore'

interface ChatHistoryProps {
  searchQuery: string
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
}

type SortOption = 'newest' | 'oldest' | 'messages' | 'title'
type FilterOption = 'all' | 'today' | 'week' | 'month' | 'empty'

export function ChatHistory({
  searchQuery,
  currentChatId,
  onSelectChat,
}: ChatHistoryProps) {
  const { chats, searchChats, deleteChat, clearAllChats } = useChatStore()
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter chats based on search and filters
  const getFilteredChats = (): Chat[] => {
    let filteredChats = searchQuery ? searchChats(searchQuery) : chats

    // Apply date filters
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (filterBy) {
      case 'today':
        filteredChats = filteredChats.filter(chat => 
          new Date(chat.updatedAt) >= today
        )
        break
      case 'week':
        filteredChats = filteredChats.filter(chat => 
          new Date(chat.updatedAt) >= weekAgo
        )
        break
      case 'month':
        filteredChats = filteredChats.filter(chat => 
          new Date(chat.updatedAt) >= monthAgo
        )
        break
      case 'empty':
        filteredChats = filteredChats.filter(chat => 
          chat.messages.length === 0
        )
        break
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filteredChats.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        break
      case 'oldest':
        filteredChats.sort((a, b) => 
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        )
        break
      case 'messages':
        filteredChats.sort((a, b) => b.messages.length - a.messages.length)
        break
      case 'title':
        filteredChats.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return filteredChats
  }

  const filteredChats = getFilteredChats()

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    try {
      clearAllChats()
      toast({
        title: '✅ Todas las conversaciones eliminadas',
        description: 'Se han eliminado todas las conversaciones',
      })
    } catch (error) {
      toast({
        title: '❌ Error',
        description: 'No se pudieron eliminar las conversaciones',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getFilterLabel = (filter: FilterOption): string => {
    switch (filter) {
      case 'all': return 'Todas'
      case 'today': return 'Hoy'
      case 'week': return 'Esta semana'
      case 'month': return 'Este mes'
      case 'empty': return 'Vacías'
      default: return 'Todas'
    }
  }

  const getSortLabel = (sort: SortOption): string => {
    switch (sort) {
      case 'newest': return 'Más recientes'
      case 'oldest': return 'Más antiguas'
      case 'messages': return 'Más mensajes'
      case 'title': return 'Por título'
      default: return 'Más recientes'
    }
  }

  const getActiveFiltersCount = (): number => {
    let count = 0
    if (filterBy !== 'all') count++
    if (sortBy !== 'newest') count++
    return count
  }

  const clearAllFilters = () => {
    setFilterBy('all')
    setSortBy('newest')
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {/* Filters and Actions Bar */}
        {chats.length > 0 && (
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-8 px-2 text-xs',
                      (filterBy !== 'all' || sortBy !== 'newest') && 'border-primary'
                    )}
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Filtrar
                    {getActiveFiltersCount() > 0 && (
                      <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filtrar por fecha</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                    <DropdownMenuRadioItem value="all">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Todas
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="today">
                      <Calendar className="mr-2 h-4 w-4" />
                      Hoy
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="week">
                      <Clock className="mr-2 h-4 w-4" />
                      Esta semana
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="month">
                      <Calendar className="mr-2 h-4 w-4" />
                      Este mes
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="empty">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Conversaciones vacías
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <DropdownMenuRadioItem value="newest">
                      <SortDesc className="mr-2 h-4 w-4" />
                      Más recientes
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="oldest">
                      <SortAsc className="mr-2 h-4 w-4" />
                      Más antiguas
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Más mensajes
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title">
                      <SortAsc className="mr-2 h-4 w-4" />
                      Por título (A-Z)
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters Button */}
              {getActiveFiltersCount() > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={clearAllFilters}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Limpiar filtros</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Delete All Button */}
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar todas las conversaciones</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    ¿Eliminar todas las conversaciones?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminarán permanentemente <strong>todas las {chats.length} conversaciones</strong> y 
                    todos sus mensajes. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAll}
                    disabled={isDeleting}
                    className={cn(
                      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                      isDeleting && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isDeleting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar todas
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Active Filters Display */}
        {(filterBy !== 'all' || sortBy !== 'newest' || searchQuery) && (
          <div className="px-2">
            <div className="flex flex-wrap gap-1">
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  Búsqueda: "{searchQuery}"
                </Badge>
              )}
              {filterBy !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  {getFilterLabel(filterBy)}
                </Badge>
              )}
              {sortBy !== 'newest' && (
                <Badge variant="secondary" className="text-xs">
                  {getSortLabel(sortBy)}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredChats.length !== chats.length && chats.length > 0 && (
          <div className="px-2">
            <p className="text-xs text-muted-foreground">
              Mostrando {filteredChats.length} de {chats.length} conversaciones
            </p>
          </div>
        )}

        {/* Chat List */}
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery || filterBy !== 'all'
                ? 'No se encontraron conversaciones'
                : 'No hay conversaciones aún'}
            </p>
            {!searchQuery && filterBy === 'all' && (
              <p className="mt-1 text-xs text-muted-foreground">
                Crea una nueva conversación para comenzar
              </p>
            )}
            {(searchQuery || filterBy !== 'all') && chats.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={clearAllFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <HistoryItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onSelect={() => onSelectChat(chat.id)}
                onDelete={() => deleteChat(chat.id)}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}