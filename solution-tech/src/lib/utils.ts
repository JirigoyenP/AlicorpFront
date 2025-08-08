import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes} min`
  if (hours < 24) return `Hace ${hours} h`
  if (days < 7) return `Hace ${days} días`
  
  return d.toLocaleDateString('es', {
    day: 'numeric',
    month: 'short',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return '🖼️'
  if (fileType === 'application/pdf') return '📄'
  if (fileType.startsWith('video/')) return '🎥'
  if (fileType.startsWith('audio/')) return '🎵'
  return '📎'
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760') // 10MB default
  const allowedTypes = (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,video/mp4,application/pdf').split(',')
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. El tamaño máximo es ${formatFileSize(maxSize)}`,
    }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Tipo de archivo no permitido',
    }
  }
  
  return { valid: true }
}

export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, percentage: 0 }
  }
  
  let used = 0
  const total = 5 * 1024 * 1024 // 5MB limit
  
  try {
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length
      }
    }
  } catch (e) {
    console.error('Error calculating storage:', e)
  }
  
  const percentage = (used / total) * 100
  
  return { used, total, percentage }
}