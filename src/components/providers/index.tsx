// src/components/providers/index.tsx
'use client'

import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'
import { AuthProvider } from './auth-provider'
import { Toaster } from '@/components/ui/sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}