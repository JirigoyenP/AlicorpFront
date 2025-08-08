'use client'

import { Message, FileAttachment } from '@/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Bot, Download, FileText, Video, Image as ImageIcon, Copy, Check } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface MessageItemProps {
    message: Message
}

export function MessageItem({ message }: MessageItemProps) {
    const isUser = message.role === 'user'
    const [copied, setCopied] = useState(false)
    const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({})

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const renderAttachment = (attachment: FileAttachment) => {
        if (attachment.type === 'image') {
            return (
                <div className="mt-3 relative group">
                    {imageLoading[attachment.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
                        </div>
                    )}
                    <img
                        src={attachment.url}
                        alt={attachment.name}
                        onLoad={() => setImageLoading(prev => ({ ...prev, [attachment.id]: false }))}
                        onLoadStart={() => setImageLoading(prev => ({ ...prev, [attachment.id]: true }))}
                        className="max-w-full rounded-lg border shadow-md cursor-pointer hover:shadow-xl transition-all duration-200 group-hover:scale-[1.02]"
                        onClick={() => window.open(attachment.url, '_blank')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
                </div>
            )
        }

        const Icon = attachment.type === 'video' ? Video :
            attachment.type === 'pdf' ? FileText :
                ImageIcon

        return (
            <a
                href={attachment.url}
                download={attachment.name}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border bg-card/50 px-4 py-2.5 text-sm hover:bg-card transition-all duration-200 hover:shadow-md group"
            >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="max-w-[200px] truncate">{attachment.name}</span>
                <Download className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
        )
    }

    return (
        <motion.div
            className={cn(
                'flex gap-3 md:gap-4 group',
                isUser ? 'flex-row-reverse' : 'flex-row'
            )}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            <Avatar className={cn(
                "h-8 w-8 md:h-10 md:w-10 shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all duration-200",
                isUser
                    ? "ring-primary/20 group-hover:ring-primary/40"
                    : "ring-muted/20 group-hover:ring-muted/40"
            )}>
                <AvatarFallback
                    className={cn(
                        isUser
                            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                            : 'bg-gradient-to-br from-muted to-muted/80 text-muted-foreground'
                    )}
                >
                    {isUser ? <User className="h-4 w-4 md:h-5 md:w-5" /> : <Bot className="h-4 w-4 md:h-5 md:w-5" />}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    'flex max-w-[85%] md:max-w-[75%] flex-col gap-1',
                    isUser ? 'items-end' : 'items-start'
                )}
            >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        {isUser ? 'Tú' : 'Solution Tech Assistant'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(message.timestamp), 'HH:mm', { locale: es })}
                    </span>
                </div>

                <div
                    className={cn(
                        'relative rounded-2xl px-4 py-3 shadow-sm transition-all duration-200',
                        isUser
                            ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm'
                            : 'bg-card border border-border/50 text-foreground rounded-tl-sm hover:shadow-md'
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>
                    ) : (
                        <>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    code: ({ inline, children }) =>
                                        inline ? (
                                            <code className="rounded bg-muted px-1 py-0.5 text-sm">{children}</code>
                                        ) : (
                                            <pre className="rounded bg-muted p-2 text-sm overflow-x-auto">
                                                <code>{children}</code>
                                            </pre>
                                        ),
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>

                            {!isUser && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 shadow-sm hover:shadow-md"
                                >
                                    {copied ? (
                                        <Check className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <Copy className="h-3 w-3" />
                                    )}
                                </Button>
                            )}
                        </>
                    )}

                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment) => (
                                <div key={attachment.id}>{renderAttachment(attachment)}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}