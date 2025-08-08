'use client'

import { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileUpload } from './FileUpload'
import { Send, Paperclip, X, Smile, Mic, Image } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface MessageInputProps {
  onSendMessage: (content: string, files?: File[]) => void
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files)
      setMessage('')
      setFiles([])
      textareaRef.current?.focus()
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (selectedFiles: File[]) => {
    setFiles(selectedFiles)
    setShowFileUpload(false)
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    const pastedFiles: File[] = []
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) pastedFiles.push(file)
      }
    }
    
    if (pastedFiles.length > 0) {
      setFiles([...files, ...pastedFiles])
    }
  }

  const canSend = message.trim() || files.length > 0

  return (
    <div className="space-y-3">
      {/* File Preview */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg"
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <Badge variant="secondary" className="pr-8 py-1.5 pl-3">
                  {file.type.startsWith('image/') ? (
                    <Image className="h-3 w-3 mr-1.5" />
                  ) : (
                    <Paperclip className="h-3 w-3 mr-1.5" />
                  )}
                  <span className="max-w-[150px] truncate text-xs">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-1.5">
                    ({formatFileSize(file.size)})
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-5 w-5 opacity-70 hover:opacity-100"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className={cn(
        "relative rounded-2xl border transition-all duration-200",
        isFocused 
          ? "border-primary/50 shadow-lg shadow-primary/10 bg-background" 
          : "border-border bg-muted/20",
        disabled && "opacity-50 cursor-not-allowed"
      )}>
        <div className="flex items-end gap-1 p-2">
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setShowFileUpload(!showFileUpload)}
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 hidden md:flex"
              disabled
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "h-9 w-9 shrink-0 hidden md:flex",
                isRecording && "text-destructive animate-pulse"
              )}
              onClick={() => setIsRecording(!isRecording)}
              disabled
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            placeholder="Escribe tu mensaje..."
            disabled={disabled}
            className={cn(
              "flex-1 min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent",
              "focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-muted-foreground/60 scrollbar-thin px-2"
            )}
            rows={1}
          />

          <Button
            onClick={handleSend}
            disabled={disabled || !canSend}
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 transition-all duration-200",
              canSend 
                ? "bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg scale-100" 
                : "bg-muted text-muted-foreground scale-95"
            )}
          >
            <Send className={cn(
              "h-4 w-4 transition-transform",
              canSend && "translate-x-0.5 -translate-y-0.5"
            )} />
          </Button>
        </div>

        {/* Character count for long messages */}
        {message.length > 500 && (
          <div className="absolute -top-6 right-2 text-xs text-muted-foreground">
            {message.length} / 5000
          </div>
        )}
      </div>

      {/* File Upload Dialog */}
      <AnimatePresence>
        {showFileUpload && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
          >
            <FileUpload
              onFileSelect={handleFileSelect}
              onClose={() => setShowFileUpload(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded">Enter</kbd> para enviar • 
          <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded ml-1">Shift + Enter</kbd> nueva línea
        </p>
        {disabled && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Esperando respuesta...
          </p>
        )}
      </div>
    </div>
  )
}