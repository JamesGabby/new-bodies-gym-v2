// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { GoBackButton } from '@/components/ui/go-back-button';

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="text-8xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <GoBackButton />
        </div>
        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/timetable">
              <Button variant="ghost" size="sm">Timetable</Button>
            </Link>
            <Link href="/facilities">
              <Button variant="ghost" size="sm">Facilities</Button>
            </Link>
            <Link href="/membership">
              <Button variant="ghost" size="sm">Membership</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}