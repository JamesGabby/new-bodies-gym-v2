// src/app/(main)/contact/opening-hours-card.tsx
import { Clock } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

function getCurrentDay(): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

function isGymOpenNow(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours + minutes / 60

  // Weekend: 9am - 3pm
  if (day === 0 || day === 6) {
    return currentTime >= 9 && currentTime < 15
  }
  
  // Friday: 6am - 8pm
  if (day === 5) {
    return currentTime >= 6 && currentTime < 20
  }
  
  // Mon-Thu: 6am - 9:30pm
  return currentTime >= 6 && currentTime < 21.5
}

export function OpeningHoursCard() {
  const currentDay = getCurrentDay()
  const isOpen = isGymOpenNow()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-lime-500/10">
            <Clock className="h-5 w-5 text-brand-lime-500" />
          </div>
          <CardTitle>Opening Hours</CardTitle>
        </div>
        <Badge
          variant={isOpen ? 'default' : 'secondary'}
          className={cn(
            isOpen
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : 'bg-red-500/10 text-red-500 border-red-500/20'
          )}
        >
          {isOpen ? 'Open Now' : 'Closed'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {siteConfig.openingHours.map((hours) => {
            const isToday = hours.day.toLowerCase() === currentDay ||
              (hours.day === 'Saturday' && currentDay === 'saturday') ||
              (hours.day === 'Sunday' && currentDay === 'sunday')

            return (
              <div
                key={hours.day}
                className={cn(
                  'flex justify-between py-2 px-3 rounded-lg transition-colors',
                  isToday && 'bg-brand-lime-500/10'
                )}
              >
                <span className={cn('font-medium', isToday && 'text-brand-lime-500')}>
                  {hours.day}
                  {isToday && <span className="ml-2 text-xs">(Today)</span>}
                </span>
                <span className="text-muted-foreground">
                  {hours.open} – {hours.close}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}