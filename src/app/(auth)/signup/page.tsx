// src/app/(auth)/signup/page.tsx
import { Metadata } from 'next'
import { SignupForm } from './signup-form'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Join Now',
  description: 'Create your New Bodies Gym account and start your fitness journey',
}

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[480px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join New Bodies Gym and start your fitness journey today
        </p>
      </div>
      <SignupForm />
    </div>
  )
}