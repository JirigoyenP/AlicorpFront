'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, FileText, Image, Video, File } from 'lucide-react'
import { validateFile, formatFileSize } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  onClose: () => void
}

export function FileUpload({ onFileSelect, onClose }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const validFiles: File[] = []
    
    for (const file of files) {
      const validation = validateFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        toast({
          title: 'Error',
          description: validation.error,
          variant: 'destructive',
        })
      }
    }

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFileSelect(selectedFiles)
      onClose()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('video/')) return Video
    if (file.type === 'application/pdf') return FileText
    return File
  }

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Adjuntar archivos</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleChange}
            accept="image/*,video/mp4,application/pdf"
            className="hidden"
          />

          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Arrastra y suelta archivos aquí o{' '}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => inputRef.current?.click()}
            >
              selecciona archivos
            </Button>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Formatos permitidos: JPG, PNG, GIF, MP4, PDF (máx. 10MB)
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Archivos seleccionados:</h4>
            {selectedFiles.map((file, index) => {
              const Icon = getFileIcon(file)
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-muted p-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({formatFileSize(file.size)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
            Adjuntar {selectedFiles.length > 0 && `(${selectedFiles.length})`}
          </Button>
        </div>
      </div>
    </Card>
  )
}