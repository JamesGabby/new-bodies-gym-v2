// src/hooks/use-user-dashboard.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { 
  Profile, 
  Booking, 
  Membership, 
  ClassInstance, 
  ClassType,
  Announcement 
} from '@/types/database';

// User Profile Hook
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) throw error;
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile, updateProfile };
}

// User Membership Hook
export function useUserMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMembership = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setMembership(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch membership');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  return { membership, loading, error, refetch: fetchMembership };
}

// User Bookings Hook
export interface BookingWithDetails extends Booking {
  class_instance?: ClassInstance & {
    class_type?: ClassType;
  };
}

export function useUserBookings(options?: { 
  upcoming?: boolean; 
  past?: boolean;
  limit?: number;
}) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase
        .from('bookings')
        .select(`
          *,
          class_instances (
            *,
            class_types (*)
          )
        `)
        .eq('user_id', user.id);

      if (options?.upcoming) {
        query = query.gte('class_instances.date', today);
      }
      
      if (options?.past) {
        query = query.lt('class_instances.date', today);
      }

      query = query.order('booked_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const processedBookings = (data || []).map(booking => ({
        ...booking,
        class_instance: booking.class_instances ? {
          ...booking.class_instances,
          class_type: booking.class_instances.class_types,
        } : undefined,
      }));

      // Filter and sort based on options
      let filteredBookings = processedBookings;
      
      if (options?.upcoming) {
        filteredBookings = filteredBookings
          .filter(b => b.class_instance?.date && new Date(b.class_instance.date) >= new Date(today))
          .sort((a, b) => {
            const dateA = a.class_instance?.date || '';
            const dateB = b.class_instance?.date || '';
            return dateA.localeCompare(dateB);
          });
      }
      
      if (options?.past) {
        filteredBookings = filteredBookings
          .filter(b => b.class_instance?.date && new Date(b.class_instance.date) < new Date(today))
          .sort((a, b) => {
            const dateA = a.class_instance?.date || '';
            const dateB = b.class_instance?.date || '';
            return dateB.localeCompare(dateA);
          });
      }

      setBookings(filteredBookings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase, options?.upcoming, options?.past, options?.limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

// User Stats Hook
export interface UserStats {
  totalBookings: number;
  attendedClasses: number;
  cancelledBookings: number;
  upcomingBookings: number;
  favoriteClass: string | null;
  memberSince: string | null;
  streakDays: number;
}

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Fetch all user bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          class_instances (
            date,
            class_types (name)
          )
        `)
        .eq('user_id', user.id);

      if (bookingsError) throw bookingsError;

      // Fetch profile for member since date
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();

      const totalBookings = bookings?.length || 0;
      const attendedClasses = bookings?.filter(b => b.attended === true).length || 0;
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0;
      const upcomingBookings = bookings?.filter(
        b => b.class_instances?.date && 
        new Date(b.class_instances.date) >= new Date(today) &&
        b.status === 'confirmed'
      ).length || 0;

      // Calculate favorite class
      const classCount: Record<string, number> = {};
      bookings?.forEach(b => {
        const className = b.class_instances?.class_types?.name;
        if (className && b.status === 'confirmed') {
          classCount[className] = (classCount[className] || 0) + 1;
        }
      });
      
      const favoriteClass = Object.entries(classCount).length > 0
        ? Object.entries(classCount).sort((a, b) => b[1] - a[1])[0][0]
        : null;

      // Calculate streak (simplified - consecutive days with bookings)
      const attendedDates = bookings
        ?.filter(b => b.attended === true && b.class_instances?.date)
        .map(b => b.class_instances!.date)
        .sort()
        .reverse() || [];
      
      let streakDays = 0;
      // Simplified streak calculation
      if (attendedDates.length > 0) {
        streakDays = Math.min(attendedDates.length, 7); // Cap at 7 for simplicity
      }

      setStats({
        totalBookings,
        attendedClasses,
        cancelledBookings,
        upcomingBookings,
        favoriteClass,
        memberSince: profile?.created_at || null,
        streakDays,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [user?.id, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Active Announcements Hook
export function useActiveAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Failed to fetch announcements:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements, loading, refetch: fetchAnnouncements };
}