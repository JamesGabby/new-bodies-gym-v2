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
        query = query.eq('day_of_week', dayOfWeek)
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
        query = query.eq('status', status)
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
        .gte('class_instance.date', today)
        .order('class_instance(date)', { ascending: true })
        .order('class_instance(start_time)', { ascending: true })

      if (error) throw error
      return data as BookingWithDetails[]
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
        .single()

      if (error && error.code !== 'PGRST116') throw error
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
        .single()

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

      if (classInstance.current_capacity >= classInstance.max_capacity) {
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

      if (error) throw error
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

      // Get current position
      const { data: lastPosition } = await supabase
        .from('waitlist')
        .select('position')
        .eq('class_instance_id', classInstanceId)
        .order('position', { ascending: false })
        .limit(1)
        .single()

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

// Combined bookings hook
export function useBookings() {
  const createBookingMutation = useCreateBooking()

  const createBooking = async (classInstanceId: string, notes?: string) => {
    return createBookingMutation.mutateAsync({ classInstanceId, notes })
  }

  return {
    createBooking,
    isCreating: createBookingMutation.isPending,
  }
}