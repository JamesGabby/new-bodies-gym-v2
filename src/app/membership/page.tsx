// src/app/membership/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Check, 
  X,
  Star,
  Zap,
  Crown,
  ChevronRight,
  Phone,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Membership Plans | New Bodies Gym',
  description: 'Choose the perfect membership plan for your fitness journey. All memberships include full access to facilities and group classes.',
  openGraph: {
    title: 'Membership Plans | New Bodies Gym',
    description: 'Flexible membership options to suit your lifestyle. Join today and start your fitness journey.',
  },
};

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    description: 'Flexible month-to-month membership',
    price: 35,
    period: 'month',
    icon: Zap,
    popular: false,
    features: [
      { name: 'Full gym access', included: true },
      { name: 'All group classes', included: true },
      { name: 'Locker access', included: true },
      { name: 'Free parking', included: true },
      { name: 'Coffee machine', included: true },
      { name: 'Guest passes', included: false },
      { name: 'Priority booking', included: false },
      { name: 'PT sessions', included: false },
    ],
    cta: 'Start Monthly',
    color: 'border-zinc-200 dark:border-zinc-800',
  },
  {
    id: 'annual',
    name: 'Annual',
    description: 'Best value - save 2 months!',
    price: 29,
    period: 'month',
    annualPrice: 350,
    icon: Star,
    popular: true,
    features: [
      { name: 'Full gym access', included: true },
      { name: 'All group classes', included: true },
      { name: 'Locker access', included: true },
      { name: 'Free parking', included: true },
      { name: 'Coffee machine', included: true },
      { name: '2 guest passes/month', included: true },
      { name: 'Priority booking', included: true },
      { name: '1 free PT session', included: true },
    ],
    cta: 'Get Annual',
    color: 'border-primary',
    badge: 'Most Popular',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'The ultimate gym experience',
    price: 49,
    period: 'month',
    icon: Crown,
    popular: false,
    features: [
      { name: 'Full gym access', included: true },
      { name: 'All group classes', included: true },
      { name: 'Personal locker', included: true },
      { name: 'Free parking', included: true },
      { name: 'Complimentary drinks', included: true },
      { name: 'Unlimited guest passes', included: true },
      { name: 'Priority booking', included: true },
      { name: 'Monthly PT session', included: true },
      { name: 'Towel service', included: true },
      { name: 'Nutrition consultation', included: true },
    ],
    cta: 'Go Premium',
    color: 'border-amber-500',
  },
];

const faqs = [
  {
    question: 'Is there a joining fee?',
    answer: 'No! We don\'t charge any joining fees or admin fees. The price you see is the price you pay.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Monthly memberships can be cancelled with 30 days notice. Annual memberships are for a 12-month term.',
  },
  {
    question: 'Are classes included?',
    answer: 'Yes! All group fitness classes are included in every membership at no extra cost.',
  },
  {
    question: 'Can I freeze my membership?',
    answer: 'Yes, you can freeze your membership for up to 3 months per year for medical reasons or extended travel.',
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! Students with valid ID get 20% off all membership plans. Contact us for details.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Absolutely! We offer a free day pass so you can experience our facilities before committing.',
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">No Joining Fees</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Membership <span className="text-primary">Plans</span>
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              Simple, transparent pricing. All memberships include full access to 
              facilities and group classes. No hidden fees, ever.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* Non-member booking info */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Not ready to commit? Non-members can book individual classes by calling us.
            </p>
            <Link href="tel:01298 72006">
              <Button variant="outline">
                <Phone className="mr-2 h-4 w-4" />
                Call 01298 72006
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Included in All Memberships
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every membership gives you access to our world-class facilities and classes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Full Gym Access', description: 'All equipment and training areas' },
              { title: 'Group Classes', description: '20+ classes per week included' },
              { title: 'Changing Facilities', description: 'Showers, lockers, and amenities' },
              { title: 'Free Parking', description: 'Ample parking for all members' },
              { title: 'Ladies Zone', description: 'Dedicated women-only area' },
              { title: 'Cardio Equipment', description: 'Treadmills, bikes, rowers & more' },
              { title: 'Free Weights', description: 'Dumbbells, barbells, and plates' },
              { title: 'Coffee Machine', description: 'Complimentary coffee' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <Link href="/contact">
              <Button variant="outline">
                Contact Us
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join New Bodies Gym today and become part of our welcoming community. 
              Where everyone is welcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Book a Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Pricing Card Component
interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    period: string;
    annualPrice?: number;
    icon: React.ComponentType<{ className?: string }>;
    popular: boolean;
    features: { name: string; included: boolean }[];
    cta: string;
    color: string;
    badge?: string;
  };
}

function PricingCard({ plan }: PricingCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
      plan.popular && "scale-105 shadow-lg",
      plan.color
    )}>
      {plan.badge && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg">
            {plan.badge}
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4",
          plan.popular ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          <plan.icon className="h-7 w-7" />
        </div>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center">
        <div className="mb-6">
          <span className="text-5xl font-bold">£{plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
          {plan.annualPrice && (
            <p className="text-sm text-muted-foreground mt-1">
              £{plan.annualPrice} billed annually
            </p>
          )}
        </div>
        
        <Separator className="mb-6" />
        
        <ul className="space-y-3 text-left">
          {plan.features.map((feature) => (
            <li key={feature.name} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <span className={cn(
                "text-sm",
                !feature.included && "text-muted-foreground"
              )}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Link href="/signup" className="w-full">
          <Button 
            className="w-full" 
            size="lg"
            variant={plan.popular ? "default" : "outline"}
          >
            {plan.cta}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}