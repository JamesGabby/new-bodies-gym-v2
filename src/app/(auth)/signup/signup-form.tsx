// src/app/(auth)/signup/signup-form.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Mail, User, Phone, Calendar, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { signUpSchema, SignUpInput, SignUpFormInput } from '@/lib/validations'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const { signUp, signInWithGoogle, isLoading } = useAuth()

  const form = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      termsAccepted: false,
      marketingConsent: false,
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: SignUpInput) => {
    await signUp(data)
  }

  // Password strength indicator
  const password = form.watch('password')
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (/[a-z]/.test(password)) strength += 25
    if (/[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 25
    return strength
  }
  const passwordStrength = getPasswordStrength(password || '')

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'bg-red-500'
    if (strength <= 50) return 'bg-orange-500'
    if (strength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthText = (strength: number) => {
    if (strength <= 25) return 'Weak'
    if (strength <= 50) return 'Fair'
    if (strength <= 75) return 'Good'
    return 'Strong'
  }

  // Step navigation
  const nextStep = async () => {
    if (step === 1) {
      const isValid = await form.trigger(['firstName', 'lastName', 'email'])
      if (isValid) setStep(2)
    } else if (step === 2) {
      const isValid = await form.trigger(['password', 'confirmPassword'])
      if (isValid) setStep(3)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Sign up</CardTitle>
          <span className="text-sm text-muted-foreground">Step {step} of 3</span>
        </div>
        <Progress value={(step / 3) * 100} className="h-1" />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Social Signup - Only on step 1 */}
        {step === 1 && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signInWithGoogle()}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        {/* Signup Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="John"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Doe"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="you@example.com"
                            type="email"
                            autoComplete="email"
                            className="pl-10"
                            disabled={isLoading}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone <span className="text-muted-foreground">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="07123 456789"
                              type="tel"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Date of Birth <span className="text-muted-foreground">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              type="date"
                              className="pl-10"
                              disabled={isLoading}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Create a strong password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      {password && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  'h-full transition-all',
                                  getStrengthColor(passwordStrength)
                                )}
                                style={{ width: `${passwordStrength}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {getStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            <li className={cn('flex items-center gap-1', password.length >= 8 && 'text-green-500')}>
                              <Check className={cn('h-3 w-3', password.length >= 8 ? 'opacity-100' : 'opacity-30')} />
                              At least 8 characters
                            </li>
                            <li className={cn('flex items-center gap-1', /[a-z]/.test(password) && 'text-green-500')}>
                              <Check className={cn('h-3 w-3', /[a-z]/.test(password) ? 'opacity-100' : 'opacity-30')} />
                              One lowercase letter
                            </li>
                            <li className={cn('flex items-center gap-1', /[A-Z]/.test(password) && 'text-green-500')}>
                              <Check className={cn('h-3 w-3', /[A-Z]/.test(password) ? 'opacity-100' : 'opacity-30')} />
                              One uppercase letter
                            </li>
                            <li className={cn('flex items-center gap-1', /\d/.test(password) && 'text-green-500')}>
                              <Check className={cn('h-3 w-3', /\d/.test(password) ? 'opacity-100' : 'opacity-30')} />
                              One number
                            </li>
                          </ul>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm your password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            disabled={isLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Step 3: Terms & Submit */}
            {step === 3 && (
              <>
                <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
                  <h3 className="font-medium">Almost there!</h3>
                  <p className="text-sm text-muted-foreground">
                    Please review and accept our terms to complete your registration.
                  </p>

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the{' '}
                            <Link
                              href="/terms"
                              className="text-brand-lime-500 hover:text-brand-lime-400 underline"
                              target="_blank"
                            >
                              Terms & Conditions
                            </Link>{' '}
                            and{' '}
                            <Link
                              href="/privacy"
                              className="text-brand-lime-500 hover:text-brand-lime-400 underline"
                              target="_blank"
                            >
                              Privacy Policy
                            </Link>
                            <span className="text-destructive"> *</span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marketingConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I&apos;d like to receive news, offers, and updates from New Bodies Gym
                          </FormLabel>
                          <FormDescription className="text-xs">
                            You can unsubscribe at any time.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Summary */}
                <div className="rounded-lg border border-border p-4 space-y-2 text-sm">
                  <h4 className="font-medium">Account Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <span>Name:</span>
                    <span className="text-foreground">
                      {form.getValues('firstName')} {form.getValues('lastName')}
                    </span>
                    <span>Email:</span>
                    <span className="text-foreground truncate">{form.getValues('email')}</span>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={prevStep}
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  className="flex-1 bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
                  onClick={nextStep}
                  disabled={isLoading}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
                  disabled={isLoading || !form.watch('termsAccepted')}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <div className="text-center text-sm text-muted-foreground w-full">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand-lime-500 hover:text-brand-lime-400 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}