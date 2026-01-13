// src/app/(auth)/login/page.tsx
import { Metadata } from 'next'
import { LoginForm } from './login-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your New Bodies Gym account',
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>
      <LoginForm />
    </div>
  )
}