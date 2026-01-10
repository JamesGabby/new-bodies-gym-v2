// src/app/(main)/welcome/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  CheckCircle,
  Calendar,
  Dumbbell,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Welcome to New Bodies Gym',
  description: 'Your account has been verified. Get started with your fitness journey!',
}

export default async function WelcomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  const firstName = profile?.first_name || 'there'

  const nextSteps = [
    {
      icon: User,
      title: 'Complete Your Profile',
      description: 'Add your emergency contact and health information',
      href: '/dashboard/profile',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Calendar,
      title: 'Book Your First Class',
      description: 'Check our timetable and book a class that suits you',
      href: '/booking',
      color: 'text-brand-lime-500',
      bgColor: 'bg-brand-lime-500/10',
    },
    {
      icon: Dumbbell,
      title: 'Explore Our Facilities',
      description: 'Discover everything New Bodies Gym has to offer',
      href: '/facilities',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-lime-500/10 mb-6">
            <CheckCircle className="h-10 w-10 text-brand-lime-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Welcome to New Bodies Gym, {firstName}! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            Your account has been verified. You're now part of our fitness family
            where everyone is welcome!
          </p>
        </div>

        {/* Special Offer Banner */}
        <Card className="mb-8 border-brand-lime-500/50 bg-brand-lime-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-lime-500">
              <Sparkles className="h-6 w-6 text-brand-charcoal-900" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">New Member Offer</h3>
              <p className="text-sm text-muted-foreground">
                Book a free induction session to get started safely
              </p>
            </div>
            <Button
              asChild
              className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
            >
              <Link href="/booking?type=induction">Book Now</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="grid gap-4">
            {nextSteps.map((step, index) => (
              <Link key={step.href} href={step.href}>
                <Card className="group hover:border-brand-lime-500/50 transition-all hover:shadow-md">
                  <CardContent className="flex items-center gap-4 py-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${step.bgColor}`}
                    >
                      <step.icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-brand-lime-500 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-lime-500 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/timetable">View Timetable</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Need help getting started?{' '}
            <Link href="/contact" className="text-brand-lime-500 hover:underline">
              Contact our team
            </Link>{' '}
            or call us at{' '}
            <a
              href="tel:01298 72006"
              className="text-brand-lime-500 hover:underline"
            >
              01298 72006
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}