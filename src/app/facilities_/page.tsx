// src/app/facilities/page.tsx
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Users, 
  Bike, 
  Heart,
  Zap,
  Target,
  Coffee,
  Car,
  Droplets,
  Sun,
  Utensils,
  Award,
  ChevronRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Facilities | New Bodies Gym',
  description: 'Explore our state-of-the-art gym facilities including mixed gyms, ladies only zone, cardio suites, Olympic gym, boxing studio, and more.',
  openGraph: {
    title: 'World-Class Facilities | New Bodies Gym',
    description: 'Discover our comprehensive range of fitness facilities designed for everyone.',
  },
};

const facilities = [
  {
    id: 'mixed-gym',
    name: 'Large Mixed Gyms',
    description: 'Spacious workout areas with a comprehensive range of equipment suitable for all fitness levels. Our mixed gym floor provides everything you need for a complete workout.',
    icon: Dumbbell,
    features: ['Free weights area', 'Cable machines', 'Functional training zone', 'Stretching area'],
    image: '/images/facilities/mixed-gym.jpg',
    color: 'bg-green-500',
  },
  {
    id: 'ladies-zone',
    name: 'Ladies Only Zone',
    description: 'A dedicated, comfortable space exclusively for women. Fully equipped with cardio and resistance machines in a supportive environment.',
    icon: Heart,
    features: ['Private entrance', 'Full equipment range', 'Dedicated changing rooms', 'Female staff'],
    image: '/images/facilities/ladies-zone.jpg',
    color: 'bg-pink-500',
  },
  {
    id: 'cardio-suites',
    name: 'Cardio Suites',
    description: 'State-of-the-art cardiovascular equipment including treadmills, cross trainers, rowing machines, and bikes with personal entertainment screens.',
    icon: Bike,
    features: ['Treadmills', 'Cross trainers', 'Rowing machines', 'Stationary bikes'],
    image: '/images/facilities/cardio.jpg',
    color: 'bg-blue-500',
  },
  {
    id: 'olympic-gym',
    name: 'Fully Equipped Olympic Gym',
    description: 'Professional-grade Olympic lifting platforms, competition bars, and bumper plates for serious strength athletes and powerlifters.',
    icon: Award,
    features: ['Olympic platforms', 'Competition bars', 'Bumper plates', 'Chalk stations'],
    image: '/images/facilities/olympic.jpg',
    color: 'bg-yellow-500',
  },
  {
    id: 'power-zone',
    name: 'Power Zone',
    description: 'Dedicated area for heavy lifting with power racks, squat racks, and deadlift platforms. Built for those who want to push their limits.',
    icon: Zap,
    features: ['Power racks', 'Squat racks', 'Deadlift platforms', 'Heavy dumbbells'],
    image: '/images/facilities/power-zone.jpg',
    color: 'bg-red-500',
  },
  {
    id: 'resistance-machines',
    name: 'Resistance Machines & Free Weights',
    description: 'Full range of resistance machines targeting every muscle group, plus an extensive free weights section with dumbbells up to 50kg.',
    icon: Target,
    features: ['Full machine circuit', 'Dumbbells 1-50kg', 'Barbells', 'EZ bars'],
    image: '/images/facilities/weights.jpg',
    color: 'bg-purple-500',
  },
  {
    id: 'boxing-studio',
    name: 'Boxing Studio',
    description: 'Fully equipped boxing studio with heavy bags, speed bags, and a boxing ring. Perfect for boxing classes and personal training.',
    icon: Target,
    features: ['Heavy bags', 'Speed bags', 'Boxing ring', 'Gloves available'],
    image: '/images/facilities/boxing.jpg',
    color: 'bg-orange-500',
  },
  {
    id: 'spin-studio',
    name: 'Virtual Spin Studio',
    description: 'Immersive spin studio with premium bikes and virtual ride experiences. Join instructor-led classes or ride solo with on-demand content.',
    icon: Bike,
    features: ['Premium spin bikes', 'Virtual rides', 'Climate controlled', 'Sound system'],
    image: '/images/facilities/spin.jpg',
    color: 'bg-cyan-500',
  },
  {
    id: 'fitness-studio',
    name: 'Fitness Studio',
    description: 'Versatile studio space for group classes including yoga, pilates, HIIT, and more. Sprung floor and full-length mirrors.',
    icon: Users,
    features: ['Sprung floor', 'Mirror walls', 'Sound system', 'All equipment provided'],
    image: '/images/facilities/studio.jpg',
    color: 'bg-indigo-500',
  },
  {
    id: 'personal-training',
    name: 'Personal Training',
    description: 'Expert personal trainers available to help you achieve your goals with customized programs and one-on-one guidance.',
    icon: Users,
    features: ['Certified trainers', 'Custom programs', 'Progress tracking', 'Nutrition advice'],
    image: '/images/facilities/pt.jpg',
    color: 'bg-teal-500',
  },
  {
    id: 'easyline-circuit',
    name: 'Easyline Circuit',
    description: 'Beginner-friendly hydraulic resistance machines in a guided circuit format. Perfect for those new to the gym.',
    icon: Heart,
    features: ['Guided circuit', 'Low impact', 'Beginner friendly', 'Timed intervals'],
    image: '/images/facilities/easyline.jpg',
    color: 'bg-lime-500',
  },
  {
    id: 'calisthenics-zone',
    name: 'Calisthenics Zone',
    description: 'Dedicated bodyweight training area with pull-up bars, dip stations, parallettes, and gymnastics rings.',
    icon: Zap,
    features: ['Pull-up bars', 'Dip stations', 'Parallettes', 'Gymnastics rings'],
    image: '/images/facilities/calisthenics.jpg',
    color: 'bg-amber-500',
  },
];

const amenities = [
  {
    name: 'Protein & Smoothie Bar',
    description: 'Refuel with our range of protein shakes, smoothies, and healthy snacks.',
    icon: Utensils,
  },
  {
    name: 'Sundome',
    description: 'UV tanning facilities to maintain your glow year-round.',
    icon: Sun,
  },
  {
    name: 'Changing & Shower Facilities',
    description: 'Clean, modern changing rooms with showers and secure lockers.',
    icon: Droplets,
  },
  {
    name: 'Free Parking',
    description: 'Ample free parking available for all members.',
    icon: Car,
  },
  {
    name: 'Coffee Machine',
    description: 'Complimentary coffee for all members.',
    icon: Coffee,
  },
];

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4">World-Class Equipment</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our <span className="text-primary">Facilities</span>
            </h1>
            <p className="text-xl text-zinc-300 mb-8">
              Everything you need for the perfect workout, all under one roof. 
              From beginners to elite athletes, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership">
                <Button size="lg" className="w-full sm:w-auto">
                  Join Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Book a Tour
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Areas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive range of training facilities, each designed 
              to help you achieve your fitness goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We go beyond just workout equipment to make your gym experience complete.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {amenities.map((amenity) => (
              <Card key={amenity.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <amenity.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{amenity.name}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Inclusive Banner */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All Facilities Included in Every Membership
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              No hidden fees, no restricted areas. Every member gets full access to 
              all our facilities and group classes.
            </p>
            <Link href="/membership">
              <Button size="lg" variant="secondary">
                View Membership Options
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Experience Our Facilities?
                  </h2>
                  <p className="text-zinc-300 mb-6">
                    Book a free tour and see for yourself why New Bodies Gym is 
                    where everyone is welcome.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact">
                      <Button size="lg">Book a Free Tour</Button>
                    </Link>
                    <Link href="/membership">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-zinc-900">
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="grid grid-cols-2 gap-4">
                    {[Dumbbell, Bike, Heart, Zap].map((Icon, i) => (
                      <div key={i} className="h-24 rounded-lg bg-white/10 flex items-center justify-center">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Facility Card Component
interface FacilityCardProps {
  facility: {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
    image: string;
    color: string;
  };
}

function FacilityCard({ facility }: FacilityCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className={`h-2 ${facility.color}`} />
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-lg ${facility.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
            <facility.icon className={`h-6 w-6 text-${facility.color.replace('bg-', '')}`} />
          </div>
          <div>
            <CardTitle className="text-lg">{facility.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          {facility.description}
        </CardDescription>
        <div className="flex flex-wrap gap-2">
          {facility.features.map((feature) => (
            <Badge key={feature} variant="secondary" className="text-xs">
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}