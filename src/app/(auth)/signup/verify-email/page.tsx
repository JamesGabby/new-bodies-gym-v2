// src/app/(auth)/signup/verify-email/page.tsx
import { Metadata } from 'next'
import { VerifyEmailContent } from './verify-email-content'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Verify Your Email',
  description: 'Please verify your email to complete your registration',
}

export default function VerifyEmailPage() {
  return <VerifyEmailContent />
}