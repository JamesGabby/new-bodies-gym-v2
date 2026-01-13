// src/components/auth/sign-out-button.tsx
'use client'

import { useState, ComponentProps } from 'react'
import { LogOut, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface SignOutButtonProps extends Omit<ComponentProps<typeof Button>, 'onClick'> {
  showIcon?: boolean
  showConfirmation?: boolean
}

export function SignOutButton({
  showIcon = true,
  showConfirmation = false,
  children,
  className,
  variant = 'ghost',
  ...props
}: SignOutButtonProps) {
  const { signOut, isLoading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const buttonContent = (
    <>
      {isLoading ? (
        <Loader2 className={cn('h-4 w-4 animate-spin', children && 'mr-2')} />
      ) : (
        showIcon && <LogOut className={cn('h-4 w-4', children && 'mr-2')} />
      )}
      {children || 'Sign Out'}
    </>
  )

  if (showConfirmation) {
    return (
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={variant}
            className={cn('text-destructive hover:text-destructive', className)}
            disabled={isLoading}
            {...props}
          >
            {buttonContent}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out of your account? You'll need to
              sign in again to access your bookings and profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSignOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                'Sign Out'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button
      variant={variant}
      className={cn('text-destructive hover:text-destructive', className)}
      onClick={handleSignOut}
      disabled={isLoading}
      {...props}
    >
      {buttonContent}
    </Button>
  )
}