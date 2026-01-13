// src/app/about/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Users, 
  Award, 
  Target,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'About Us | New Bodies Gym',
  description: 'Learn about New Bodies Gym - where everyone is welcome. Serving the Buxton community with world-class fitness facilities.',
  openGraph: {
    title: 'About New Bodies Gym',
    description: 'Where everyone is welcome. Learn about our story, values, and commitment to the Buxton community.',
  },
};

const values = [
  {
    icon: Heart,
    title: 'Welcoming Environment',
    description: 'We believe fitness is for everyone. Our gym is a judgement-free zone where all fitness levels are celebrated.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'More than just a gym, we\'re a community. Our members support and motivate each other every day.',
  },
  {
    icon: Award,
    title: 'Quality Equipment',
    description: 'We invest in the best equipment and facilities to give you everything you need for an effective workout.',
  },
  {
    icon: Target,
    title: 'Results Focused',
    description: 'Whether your goal is weight loss, muscle gain, or general fitness, we\'re here to help you achieve it.',
  },
];

const team = [
  {
    name: 'Team Member 1',
    role: 'Gym Manager',
    image: '/images/team/manager.jpg',
  },
  {
    name: 'Team Member 2',
    role: 'Personal Trainer',
    image: '/images/team/pt1.jpg',
  },
  {
    name: 'Team Member 3',
    role: 'Fitness Instructor',
    image: '/images/team/instructor1.jpg',
  },
  {
    name: 'Team Member 4',
    role: 'Personal Trainer',
    image: '/images/team/pt2.jpg',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">Est. Buxton</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              About <span className="text-primary">New Bodies Gym</span>
            </h1>
            <p className="text-xl text-zinc-300">
              Where everyone is welcome. We're proud to serve the Buxton community 
              with exceptional fitness facilities and a supportive environment.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Built by Fitness Enthusiasts, for Everyone
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  New Bodies Gym was founded with a simple mission: to create a fitness 
                  space where absolutely everyone feels welcome. We believe that fitness 
                  should be accessible, enjoyable, and free from intimidation.
                </p>
                <p>
                  Located in the heart of Buxton, we've built a gym that caters to all 
                  fitness levels – from complete beginners taking their first steps into 
                  fitness, to experienced athletes pushing their limits. Our diverse 
                  range of equipment and facilities ensures that everyone can find their 
                  perfect workout.
                </p>
                <p>
                  What sets us apart is our community. Our members aren't just 
                  customers – they're part of the New Bodies family. We celebrate 
                  every achievement, big or small, and support each other through 
                  every challenge.
                </p>
              </div>
              <div className="mt-8">
                <Link href="/contact">
                  <Button>
                    Get in Touch
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl font-bold text-primary mb-2">NB</div>
                  <div className="text-xl font-semibold">New Bodies Gym</div>
                  <div className="text-muted-foreground">Where everyone is welcome</div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do at New Bodies Gym.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Motto Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              "Where Everyone is Welcome"
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              This isn't just a motto – it's our promise. No matter your age, 
              fitness level, or background, you belong here.
            </p>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge className="mb-4">Find Us</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Visit New Bodies Gym
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      Unit 6<br />
                      Tongue Lane Ind. Estate<br />
                      Buxton<br />
                      SK17 7LF
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <a href="tel:01298 72006" className="text-muted-foreground hover:text-primary transition-colors">
                      01298 72006
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:newbodiesgym@hotmail.co.uk" className="text-muted-foreground hover:text-primary transition-colors">
                      newbodiesgym@hotmail.co.uk
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Opening Hours</h3>
                    <div className="text-muted-foreground text-sm space-y-1">
                      <p>Monday - Thursday: 6:00am - 9:30pm</p>
                      <p>Friday: 6:00am - 8:00pm</p>
                      <p>Sat/Sun & Bank Holidays: 9:00am - 3:00pm</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link href="/contact">
                  <Button>Contact Us</Button>
                </Link>
                <a 
                  href="https://maps.google.com/?q=Unit+6+Tongue+Lane+Ind+Estate+Buxton+SK17+7LF"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Get Directions</Button>
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative">
              <div className="aspect-square lg:aspect-auto lg:h-full min-h-[400px] rounded-2xl bg-muted flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive map would be displayed here
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Unit+6+Tongue+Lane+Ind+Estate+Buxton+SK17+7LF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block"
                  >
                    <Button variant="outline" size="sm">
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 text-white">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join the Family?
              </h2>
              <p className="text-zinc-300 mb-8 max-w-2xl mx-auto">
                Start your fitness journey with New Bodies Gym today. 
                Book a free tour or sign up now and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg">
                    Join Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-900">
                    Book a Tour
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}