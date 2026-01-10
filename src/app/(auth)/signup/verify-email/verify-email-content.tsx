// src/app/(auth)/signup/verify-email/verify-email-content.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'

export function VerifyEmailContent() {
  const [email, setEmail] = useState('')
  const [isResent, setIsResent] = useState(false)
  const { resendVerificationEmail, isLoading } = useAuth()

  const handleResend = async () => {
    if (!email) return
    const result = await resendVerificationEmail(email)
    if (result.success) {
      setIsResent(true)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-lime-500/10">
            <Mail className="h-8 w-8 text-brand-lime-500" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription className="text-base">
              We&apos;ve sent you a verification link. Please check your inbox and
              click the link to verify your email address.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email illustration */}
          <div className="relative mx-auto w-48 h-32">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center">
                <Mail className="h-12 w-12 text-muted-foreground/50" />
              </div>
            </div>
            <div className="absolute top-0 right-8 w-4 h-4 bg-brand-lime-500 rounded-full animate-bounce" />
          </div>

          {/* Tips */}
          <div className="space-y-3 text-sm">
            <p className="font-medium">Didn&apos;t receive the email?</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Wait a few minutes and try again</li>
            </ul>
          </div>

          {/* Resend Form */}
          <div className="space-y-3">
            {!isResent ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Enter your email to resend the verification link:
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleResend}
                    disabled={!email || isLoading}
                    className="shrink-0"
                  >
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      'Resend'
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 rounded-lg p-3">
                <CheckCircle className="h-5 w-5" />
                <span>Verification email resent! Please check your inbox.</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Having trouble?{' '}
            <Link href="/contact" className="text-brand-lime-500 hover:underline">
              Contact support
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}