// src/hooks/use-bookings.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import {
  ClassInstanceWithDetails,
  BookingWithDetails,
} from '@/types'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants'

// Fetch class schedule (recurring)
export function useClassSchedule(dayOfWeek?: string) {
  return useQuery({
    queryKey: ['class-schedule', dayOfWeek],
    queryFn: async () => {
      const supabase = createClient()

      let query = supabase
        .from('class_schedule')
        .select(`
          *,
          class_type:class_types (*),
          instructor:instructors (*)
        `)
        .eq('is_active', true)
        .order('start_time', { ascending: true })

      if (dayOfWeek) {
        query = query.eq('day_of_week', dayOfWeek as any)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Fetch class instances for a date range
export function useClassInstances(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ['class-instances', startDate, endDate],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('class_instances')
        .select(`
          *,
          class_type:class_types (*),
          instructor:instructors (*)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('status', 'scheduled')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      return data as ClassInstanceWithDetails[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Fetch single class instance
export function useClassInstance(id: string) {
  return useQuery({
    queryKey: ['class-instance', id],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('class_instances')
        .select(`
          *,
          class_type:class_types (*),
          instructor:instructors (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ClassInstanceWithDetails
    },
    enabled: !!id,
  })
}

// Fetch user's bookings
export function useUserBookings(status?: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['user-bookings', user?.id, status],
    queryFn: async () => {
      if (!user) return []

      const supabase = createClient()

      let query = supabase
        .from('bookings')
        .select(`
          *,
          class_instance:class_instances (
            *,
            class_type:class_types (*),
            instructor:instructors (*)
          )
        `)
        .eq('user_id', user.id)
        .order('booked_at', { ascending: false })

      if (status) {
        query = query.eq('status', status as any)
      }

      const { data, error } = await query

      if (error) throw error
      return data as BookingWithDetails[]
    },
    enabled: !!user,
  })
}

// Fetch upcoming bookings for user
export function useUpcomingBookings() {
  const { user } = useAuthStore()
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['upcoming-bookings', user?.id],
    queryFn: async () => {
      if (!user) return []

      const supabase = createClient()

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          class_instance:class_instances!inner (
            *,
            class_type:class_types (*),
            instructor:instructors (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'confirmed')
        .order('booked_at', { ascending: true })

      if (error) throw error

      // Filter and sort upcoming bookings client-side — PostgREST doesn't
      // support filtering/ordering on embedded resource columns via the JS client.
      const upcoming = (data as BookingWithDetails[])
        .filter((b) => b.class_instance && b.class_instance.date >= today)
        .sort((a, b) => {
          const dateA = a.class_instance?.date ?? ''
          const dateB = b.class_instance?.date ?? ''
          if (dateA !== dateB) return dateA < dateB ? -1 : 1
          const timeA = a.class_instance?.start_time ?? ''
          const timeB = b.class_instance?.start_time ?? ''
          return timeA < timeB ? -1 : 1
        })

      return upcoming
    },
    enabled: !!user,
  })
}

// Check if user has booked a specific class
export function useHasBooked(classInstanceId: string) {
  const { user } = useAuthStore()

  return useQuery({
    queryKey: ['has-booked', user?.id, classInstanceId],
    queryFn: async () => {
      if (!user) return false

      const supabase = createClient()

      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .eq('class_instance_id', classInstanceId)
        .eq('status', 'confirmed')
        .maybeSingle()

      if (error) throw error
      return !!data
    },
    enabled: !!user && !!classInstanceId,
  })
}

// Create booking mutation
export function useCreateBooking() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async ({
      classInstanceId,
      notes,
    }: {
      classInstanceId: string
      notes?: string
    }) => {
      if (!user) throw new Error('You must be logged in to book a class')

      const supabase = createClient()

      // Check if already booked
      const { data: existingBooking } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', user.id)
        .eq('class_instance_id', classInstanceId)
        .eq('status', 'confirmed')
        .maybeSingle()

      if (existingBooking) {
        throw new Error(ERROR_MESSAGES.alreadyBooked)
      }

      // Check availability
      const { data: classInstance } = await supabase
        .from('class_instances')
        .select('max_capacity, current_capacity')
        .eq('id', classInstanceId)
        .single()

      if (!classInstance) {
        throw new Error('Class not found')
      }

      if ((classInstance.current_capacity ?? 0) >= classInstance.max_capacity) {
        throw new Error(ERROR_MESSAGES.bookingFull)
      }

      // Atomically increment capacity — only succeeds if capacity hasn't changed
      // since we read it (optimistic locking against concurrent bookings).
      const currentCapacity = classInstance.current_capacity ?? 0
      const { count, error: capacityError } = await supabase
        .from('class_instances')
        .update({ current_capacity: currentCapacity + 1 })
        .eq('id', classInstanceId)
        .eq('current_capacity', currentCapacity)
        .lt('current_capacity', classInstance.max_capacity)
        .select('id', { count: 'exact', head: true })

      if (capacityError) throw capacityError
      if (!count || count === 0) {
        throw new Error(ERROR_MESSAGES.bookingFull)
      }

      // Create booking
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          class_instance_id: classInstanceId,
          status: 'confirmed',
          notes: notes || null,
        })
        .select()
        .single()

      if (error) {
        // Roll back the capacity increment if the booking insert failed
        await supabase
          .from('class_instances')
          .update({ current_capacity: currentCapacity })
          .eq('id', classInstanceId)
        throw error
      }

      return data
    },
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.bookingCreated)
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['class-instances'] })
      queryClient.invalidateQueries({ queryKey: ['has-booked'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || ERROR_MESSAGES.generic)
    },
  })
}

// Cancel booking mutation
export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      bookingId,
      reason,
    }: {
      bookingId: string
      reason?: string
    }) => {
      const supabase = createClient()

      // Get the booking first to update class capacity
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('class_instance_id, status')
        .eq('id', bookingId)
        .single()

      if (fetchError) throw fetchError

      if (booking.status === 'cancelled') {
        throw new Error('This booking is already cancelled')
      }

      // Update booking status
      const { data, error } = await supabase
        .from('bookings')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason || null,
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (error) throw error

      // Atomically decrement capacity — reads current value then applies a
      // compare-and-swap update so concurrent cancellations can't go negative.
      if (booking.class_instance_id) {
        const { data: classInstance } = await supabase
          .from('class_instances')
          .select('current_capacity')
          .eq('id', booking.class_instance_id)
          .single()

        if (classInstance && (classInstance.current_capacity ?? 0) > 0) {
          const currentCapacity = classInstance.current_capacity ?? 0
          await supabase
            .from('class_instances')
            .update({ current_capacity: currentCapacity - 1 })
            .eq('id', booking.class_instance_id)
            .eq('current_capacity', currentCapacity)
            .gt('current_capacity', 0)
        }
      }

      return data
    },
    onSuccess: () => {
      toast.success(SUCCESS_MESSAGES.bookingCancelled)
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['class-instances'] })
      queryClient.invalidateQueries({ queryKey: ['has-booked'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || ERROR_MESSAGES.generic)
    },
  })
}

// Join waitlist mutation
export function useJoinWaitlist() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (classInstanceId: string) => {
      if (!user) throw new Error('You must be logged in')

      const supabase = createClient()

      // Check if already on waitlist
      const { data: existingEntry } = await supabase
        .from('waitlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('class_instance_id', classInstanceId)
        .maybeSingle()

      if (existingEntry) {
        throw new Error('You are already on the waitlist for this class')
      }

      // Get current position
      const { data: lastPosition } = await supabase
        .from('waitlist')
        .select('position')
        .eq('class_instance_id', classInstanceId)
        .order('position', { ascending: false })
        .limit(1)
        .maybeSingle()

      const newPosition = (lastPosition?.position || 0) + 1

      const { data, error } = await supabase
        .from('waitlist')
        .insert({
          user_id: user.id,
          class_instance_id: classInstanceId,
          position: newPosition,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      toast.success('Added to waitlist')
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || ERROR_MESSAGES.generic)
    },
  })
}

// Leave waitlist mutation
export function useLeaveWaitlist() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (classInstanceId: string) => {
      if (!user) throw new Error('You must be logged in')

      const supabase = createClient()

      const { error } = await supabase
        .from('waitlist')
        .delete()
        .eq('user_id', user.id)
        .eq('class_instance_id', classInstanceId)

      if (error) throw error
    },
    onSuccess: () => {
      toast.success('Removed from waitlist')
      queryClient.invalidateQueries({ queryKey: ['waitlist'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || ERROR_MESSAGES.generic)
    },
  })
}

// Fetch class types
export function useClassTypes() {
  return useQuery({
    queryKey: ['class-types'],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Fetch instructors
export function useInstructors() {
  return useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (error) throw error
      return data
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  })
}

// Wrapper for class instances with friendlier return values
export function useClassInstancesData(startDate: string, endDate: string) {
  const query = useClassInstances(startDate, endDate)

  return {
    classes: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Combined bookings hook - main hook for components
export function useBookings() {
  const createBookingMutation = useCreateBooking()
  const cancelBookingMutation = useCancelBooking()

  return {
    // Create booking
    createBooking: (classInstanceId: string, notes?: string) =>
      createBookingMutation.mutateAsync({ classInstanceId, notes }),
    isCreating: createBookingMutation.isPending,
    createError: createBookingMutation.error,

    // Cancel booking
    cancelBooking: (bookingId: string, reason?: string) =>
      cancelBookingMutation.mutateAsync({ bookingId, reason }),
    isCancelling: cancelBookingMutation.isPending,
    cancelError: cancelBookingMutation.error,
  }
}