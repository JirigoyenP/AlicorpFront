'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useState, useEffect } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  // Initialize MSW on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
      import('@/lib/msw/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' })
      })
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

// Separate ThemeProvider to handle hydration properly
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a div with the same dimensions as your layout to prevent layout shift
    return <div className="min-h-screen bg-background" />
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}