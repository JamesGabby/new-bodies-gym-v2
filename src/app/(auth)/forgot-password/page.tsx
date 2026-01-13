// src/app/(auth)/forgot-password/page.tsx
import { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your New Bodies Gym password',
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
        <p className="text-sm text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}