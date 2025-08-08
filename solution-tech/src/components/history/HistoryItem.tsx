'use client'

import { Chat } from '@/types'
import { Button } from '@/components/ui/button'
import { MessageCircle, Trash2 } from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'
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

interface HistoryItemProps {
  chat: Chat
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
}

export function HistoryItem({ chat, isActive, onSelect, onDelete }: HistoryItemProps) {
  const lastMessage = chat.messages[chat.messages.length - 1]

  return (
    <TooltipProvider>
      <div
        className={cn(
          'group relative cursor-pointer rounded-lg border p-3 transition-all duration-200 hover:bg-accent hover:shadow-md hover:border-primary/30',
          isActive && 'border-primary bg-accent shadow-sm ring-1 ring-primary/20'
        )}
        onClick={onSelect}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className={cn(
                'rounded-full p-1.5',
                isActive ? 'bg-primary/20' : 'bg-muted/50'
              )}>
                <MessageCircle className={cn(
                  'h-3.5 w-3.5 shrink-0',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>
              <h3 className={cn(
                'truncate font-medium text-sm',
                isActive ? 'text-foreground' : 'text-foreground/90'
              )}>
                {truncateText(chat.title, 30)}
              </h3>
            </div>
            
            {lastMessage && (
              <p className="mt-1.5 ml-7 truncate text-xs text-muted-foreground">
                {truncateText(lastMessage.content, 45)}
              </p>
            )}
            
            <div className="mt-2 ml-7 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(chat.updatedAt)}</span>
              <span>•</span>
              <span>{chat.messages.length} mensajes</span>
            </div>
          </div>

          {/* Enhanced Delete Button */}
          <div className={cn(
            'flex-shrink-0 transition-all duration-200',
            // Make button more visible - show on active or hover
            isActive 
              ? 'opacity-100' 
              : 'opacity-0 group-hover:opacity-100 group-hover:scale-110'
          )}>
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'h-8 w-8 transition-all duration-200',
                        'hover:bg-destructive/10 hover:text-destructive',
                        'focus:bg-destructive/10 focus:text-destructive',
                        // Add subtle animation
                        'hover:scale-110 active:scale-95'
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Eliminar conversación</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                    ¿Eliminar conversación?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Se eliminará permanentemente la conversación "<strong>{chat.title}</strong>" 
                    y todos sus {chat.messages.length} mensajes. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Active indicator line */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
        )}
      </div>
    </TooltipProvider>
  )
}