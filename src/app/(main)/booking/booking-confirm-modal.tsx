// src/app/(main)/booking/booking-confirm-modal.tsx (continued)
'use client'

import { format } from 'date-fns'
import {
  Clock,
  MapPin,
  Calendar,
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ClassInstanceWithDetails } from '@/types'

interface BookingConfirmModalProps {
  classInstance: ClassInstanceWithDetails | null
  isOpen: boolean
  isLoading: boolean
  onConfirm: () => void
  onClose: () => void
}

export function BookingConfirmModal({
  classInstance,
  isOpen,
  isLoading,
  onConfirm,
  onClose,
}: BookingConfirmModalProps) {
  if (!classInstance) return null

  const classType = classInstance.class_type
  const instructor = classInstance.instructor

  const formatTime = (time: string) => time.slice(0, 5)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogDescription>
            Please review your booking details before confirming
          </DialogDescription>
        </DialogHeader>

        {/* Booking Details */}
        <div className="rounded-xl bg-muted/50 p-4 space-y-4">
          {/* Class Info */}
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${classType?.color}20` || '#ADFF2F20' }}
            >
              <div
                className="h-7 w-7 rounded-full"
                style={{ backgroundColor: classType?.color || '#ADFF2F' }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{classType?.name || 'Class'}</h3>
              {instructor && (
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {instructor.name}
                </p>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="rounded-lg bg-background p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Date</span>
              </div>
              <p className="font-medium text-sm">
                {format(new Date(classInstance.date), 'EEE, MMM d, yyyy')}
              </p>
            </div>

            {/* Time */}
            <div className="rounded-lg bg-background p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Time</span>
              </div>
              <p className="font-medium text-sm">
                {formatTime(classInstance.start_time)} - {formatTime(classInstance.end_time)}
              </p>
            </div>

            {/* Location */}
            <div className="rounded-lg bg-background p-3 col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span className="text-xs">Location</span>
              </div>
              <p className="font-medium text-sm">
                {classInstance.location || 'Fitness Studio'}
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <Alert className="bg-brand-lime-500/10 border-brand-lime-500/30">
          <AlertCircle className="h-4 w-4 text-brand-lime-500" />
          <AlertDescription className="text-sm">
            Please arrive <strong>5-10 minutes early</strong>. Cancellations must be made
            at least <strong>2 hours before</strong> class time to avoid penalties.
          </AlertDescription>
        </Alert>

        {/* What to Bring */}
        <div className="text-sm">
          <p className="font-medium mb-2">What to bring:</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>Water bottle</li>
            <li>Towel</li>
            <li>Comfortable workout clothing</li>
            <li>Indoor trainers</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-brand-lime-500 text-brand-charcoal-900 hover:bg-brand-lime-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Booking
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}