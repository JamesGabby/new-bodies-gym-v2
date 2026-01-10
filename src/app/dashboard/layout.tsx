// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-16 lg:pt-20">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
      <Footer />
    </div>
  )
}