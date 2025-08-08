'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bot, Target, Users, Briefcase, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WelcomeScreenProps {
  onQuickAction: (message: string) => void
}

export function WelcomeScreen({ onQuickAction }: WelcomeScreenProps) {
  const quickActions = [
    {
      icon: Target,
      title: 'Misión y Visión',
      description: 'Conoce nuestros objetivos',
      message: '¿Cuál es la misión y visión de Solution Tech?',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      title: 'Organigrama',
      description: 'Estructura organizacional',
      message: 'Muéstrame el organigrama de la empresa',
      color: 'text-green-500',
    },
    {
      icon: Briefcase,
      title: 'Proyectos',
      description: 'Iniciativas actuales',
      message: '¿Qué proyectos están en desarrollo?',
      color: 'text-purple-500',
    },
    {
      icon: Phone,
      title: 'Contacto',
      description: 'Información de contacto',
      message: '¿Cómo puedo contactar con la empresa?',
      color: 'text-orange-500',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
          <Bot className="h-10 w-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold">¡Bienvenido a Solution Tech Chat!</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Soy tu asistente virtual. Puedo ayudarte con información sobre nuestra
          empresa, proyectos, organigrama y mucho más.
        </p>
      </div>

      <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.title}
              className="cursor-pointer p-4 transition-all hover:shadow-md"
              onClick={() => onQuickAction(action.message)}
            >
              <div className="flex items-start gap-3">
                <div className={cn('mt-1', action.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          O simplemente escribe tu pregunta en el campo de texto abajo
        </p>
      </div>
    </div>
  )
}