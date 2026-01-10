// src/app/(auth)/reset-password/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from './reset-password-form'
import { Loading } from '@/components/shared/loading'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Create a new password for your New Bodies Gym account',
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      <Suspense fallback={<Loading />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}