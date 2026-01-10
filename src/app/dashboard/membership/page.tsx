// src/app/dashboard/membership/page.tsx
'use client';

import { useUserMembership, useUserProfile } from '@/hooks/use-user-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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
} from '@/components/ui/alert-dialog';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Star,
  Shield,
  Zap,
  Crown,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';

const membershipBenefits = {
  monthly: [
    'Full gym access',
    'All group classes included',
    'Locker access',
    'Free parking',
    'Coffee machine access',
  ],
  annual: [
    'Everything in Monthly',
    '2 months free (pay for 10)',
    'Priority class booking',
    'Free guest passes (2/month)',
    '1 free PT session',
  ],
  premium: [
    'Everything in Annual',
    'Unlimited guest passes',
    'Towel service',
    'Personal locker',
    'Monthly PT sessions',
    'Nutrition consultation',
  ],
};

const membershipIcons = {
  monthly: Zap,
  annual: Star,
  premium: Crown,
};

export default function MembershipPage() {
  const { membership, loading: membershipLoading } = useUserMembership();
  const { profile, loading: profileLoading } = useUserProfile();

  const loading = membershipLoading || profileLoading;

  // Calculate days until renewal
  const daysUntilRenewal = membership?.end_date 
    ? differenceInDays(new Date(membership.end_date), new Date())
    : null;

  const renewalProgress = membership?.end_date && membership?.start_date
    ? Math.min(100, Math.max(0, 
        (differenceInDays(new Date(), new Date(membership.start_date)) / 
        differenceInDays(new Date(membership.end_date), new Date(membership.start_date))) * 100
      ))
    : 0;

  const getMembershipTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const MembershipIcon = membership?.membership_type 
    ? membershipIcons[membership.membership_type as keyof typeof membershipIcons] || Star
    : Star;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Membership</h1>
        <p className="text-muted-foreground">
          Manage your gym membership and billing
        </p>
      </div>

      {!membership ? (
        <NoMembershipCard />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Membership */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MembershipIcon className="h-5 w-5 text-primary" />
                  Current Membership
                </CardTitle>
                <Badge 
                  variant={membership.status === 'active' ? 'default' : 'destructive'}
                >
                  {membership.status === 'active' ? 'Active' : membership.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4">
                <p className="text-4xl font-bold capitalize">
                  {getMembershipTypeDisplay(membership.membership_type)}
                </p>
                <p className="text-2xl font-semibold text-primary mt-2">
                  £{Number(membership.price).toFixed(2)}
                  <span className="text-sm text-muted-foreground font-normal">
                    /{membership.membership_type === 'monthly' ? 'month' : 'year'}
                  </span>
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Start Date</span>
                  <span>{format(new Date(membership.start_date), 'dd MMM yyyy')}</span>
                </div>
                {membership.end_date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Renewal Date</span>
                    <span>{format(new Date(membership.end_date), 'dd MMM yyyy')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Auto-Renew</span>
                  <span className={membership.auto_renew ? 'text-green-600' : 'text-amber-600'}>
                    {membership.auto_renew ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {membership.payment_method && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {membership.payment_method}
                    </span>
                  </div>
                )}
              </div>

              {daysUntilRenewal !== null && daysUntilRenewal >= 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Days until renewal</span>
                    <span className={cn(
                      "font-medium",
                      daysUntilRenewal <= 7 && "text-amber-600"
                    )}>
                      {daysUntilRenewal} days
                    </span>
                  </div>
                  <Progress value={renewalProgress} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {membership.auto_renew ? 'Manage Auto-Renew' : 'Enable Auto-Renew'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Your Benefits
              </CardTitle>
              <CardDescription>
                Included with your {getMembershipTypeDisplay(membership.membership_type)} membership
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(membershipBenefits[membership.membership_type as keyof typeof membershipBenefits] || membershipBenefits.monthly).map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {membership.membership_type !== 'premium' && (
                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-primary" />
                    Upgrade to get more
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Unlock premium benefits with an upgraded membership
                  </p>
                  <Button size="sm">
                    View Upgrade Options
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent payments and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {membership ? (
            <div className="space-y-4">
              {/* Mock billing history */}
              {[
                { date: membership.start_date, amount: membership.price, status: 'paid' },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {getMembershipTypeDisplay(membership.membership_type)} Membership
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.date), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">£{Number(payment.amount).toFixed(2)}</p>
                    <Badge variant="outline" className="text-green-600">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No billing history available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Cancel Membership */}
      {membership && membership.status === 'active' && (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Cancel Membership
            </CardTitle>
            <CardDescription>
              We're sorry to see you go. Cancelling will end your membership at the end of your current billing period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Cancel Membership</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your membership will remain active until{' '}
                    <span className="font-medium">
                      {membership.end_date 
                        ? format(new Date(membership.end_date), 'dd MMMM yyyy')
                        : 'the end of your billing period'}
                    </span>
                    . You won't be charged again, but you'll lose access to all member benefits after this date.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Membership</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Confirm Cancellation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// No Membership Card
function NoMembershipCard() {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Active Membership</h3>
          <p className="text-muted-foreground mb-6">
            Join New Bodies Gym today and get access to all our facilities, classes, and more!
          </p>
          <div className="space-y-3">
            <Link href="/membership">
              <Button size="lg" className="w-full">
                View Membership Plans
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="w-full">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}