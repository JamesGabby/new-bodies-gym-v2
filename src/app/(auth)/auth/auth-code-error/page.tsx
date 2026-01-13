// src/app/(auth)/auth/auth-code-error/page.tsx

import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Button style classes extracted
const buttonBase = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 py-2"
const buttonOutline = "border border-input hover:bg-accent hover:text-accent-foreground"
const buttonGhost = "hover:bg-accent hover:text-accent-foreground"

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl">Authentication Error</CardTitle>
            <CardDescription>
              There was a problem authenticating your account. This could happen
              if:
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>The verification link has expired</li>
            <li>The link has already been used</li>
            <li>The link was copied incorrectly</li>
            <li>There was a temporary server issue</li>
          </ul>

          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-1">What you can do:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Request a new verification email</li>
              <li>Try signing in again</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="flex gap-2 w-full">
            <Link 
              href="/login"
              className={cn(buttonBase, buttonOutline, "flex-1")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Sign In
            </Link>
            <Link 
              href="/signup"
              className={cn(
                buttonBase, 
                "flex-1 bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
              )}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Sign Up
            </Link>
          </div>
          <Link 
            href="/contact"
            className={cn(buttonBase, buttonGhost, "w-full")}
          >
            Contact Support
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}