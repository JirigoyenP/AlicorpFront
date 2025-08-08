import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/ui/error-boundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Solution Tech Chat - Sistema de Consultas Empresariales',
  description: 'Chat inteligente para consultas sobre Solution Tech. Obtén información instantánea sobre nuestra empresa, proyectos y servicios.',
  keywords: 'chat, solution tech, consultas, empresa, software, desarrollo, tecnología, IA',
  authors: [{ name: 'Solution Tech Team' }],
  openGraph: {
    title: 'Solution Tech Chat',
    description: 'Sistema de consultas empresariales con IA',
    type: 'website',
    locale: 'es_ES',
    siteName: 'Solution Tech Chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solution Tech Chat',
    description: 'Sistema de consultas empresariales con IA',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ErrorBoundary>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}