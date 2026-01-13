// src/hooks/use-admin.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Profile, 
  ClassType, 
  ClassSchedule, 
  ClassInstance, 
  Booking, 
  Announcement,
  Membership,
  Instructor,
  ContactSubmission
} from '@/types';

// Dashboard Stats Hook
export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  totalBookings: number;
  todayBookings: number;
  totalClasses: number;
  todayClasses: number;
  revenue: number;
  newMembersThisMonth: number;
  bookingsTrend: { date: string; count: number }[];
  membershipDistribution: { type: string; count: number }[];
  popularClasses: { name: string; bookings: number }[];
  attendanceRate: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Fetch all data in parallel
      const [
        membersResult,
        activeMembersResult,
        bookingsResult,
        todayBookingsResult,
        classesResult,
        todayClassesResult,
        newMembersResult,
        membershipDistResult,
        popularClassesResult,
        attendanceResult,
        bookingsTrendResult,
      ] = await Promise.all([
        // Total members
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'member'),
        // Active members (with active membership)
        supabase.from('memberships').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        // Total bookings
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        // Today's bookings
        supabase.from('bookings')
          .select('id, class_instances!inner(date)', { count: 'exact', head: true })
          .eq('class_instances.date', today),
        // Total scheduled classes
        supabase.from('class_instances').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
        // Today's classes
        supabase.from('class_instances').select('id', { count: 'exact', head: true }).eq('date', today),
        // New members this month
        supabase.from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'member')
          .gte('created_at', startOfMonth),
        // Membership distribution
        supabase.from('memberships')
          .select('membership_type')
          .eq('status', 'active'),
        // Popular classes
        supabase.from('bookings')
          .select('class_instances!inner(class_types!inner(name))')
          .eq('status', 'confirmed')
          .gte('booked_at', thirtyDaysAgo),
        // Attendance rate
        supabase.from('bookings')
          .select('attended, status')
          .eq('status', 'confirmed')
          .not('attended', 'is', null),
        // Bookings trend (last 30 days)
        supabase.from('bookings')
          .select('booked_at')
          .gte('booked_at', thirtyDaysAgo)
          .order('booked_at', { ascending: true }),
      ]);

      // Process membership distribution
      const membershipDist = membershipDistResult.data?.reduce((acc: Record<string, number>, m: any) => {
        acc[m.membership_type] = (acc[m.membership_type] || 0) + 1;
        return acc;
      }, {}) || {};

      const membershipDistribution = Object.entries(membershipDist).map(([type, count]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        count: count as number,
      }));

      // Process popular classes
      const classCount = popularClassesResult.data?.reduce((acc: Record<string, number>, b: any) => {
        const name = b.class_instances?.class_types?.name;
        if (name) {
          acc[name] = (acc[name] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const popularClasses = Object.entries(classCount)
        .map(([name, bookings]) => ({ name, bookings: bookings as number }))
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

      // Calculate attendance rate
      const attendanceData = attendanceResult.data || [];
      const attendedCount = attendanceData.filter((b: any) => b.attended === true).length;
      const attendanceRate = attendanceData.length > 0 
        ? Math.round((attendedCount / attendanceData.length) * 100) 
        : 0;

      // Process bookings trend
      const trendData = bookingsTrendResult.data?.reduce((acc: Record<string, number>, b: any) => {
        const date = new Date(b.booked_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const bookingsTrend = Object.entries(trendData)
        .map(([date, count]) => ({ date, count: count as number }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate revenue (sum of active memberships)
      const revenueResult = await supabase
        .from('memberships')
        .select('price')
        .eq('status', 'active');
      
      const revenue = revenueResult.data?.reduce((sum, m) => sum + Number(m.price), 0) || 0;

      setStats({
        totalMembers: membersResult.count || 0,
        activeMembers: activeMembersResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        todayBookings: todayBookingsResult.count || 0,
        totalClasses: classesResult.count || 0,
        todayClasses: todayClassesResult.count || 0,
        revenue,
        newMembersThisMonth: newMembersResult.count || 0,
        bookingsTrend,
        membershipDistribution,
        popularClasses,
        attendanceRate,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

// Members Management Hook
export function useMembers() {
  const [members, setMembers] = useState<(Profile & { membership?: Membership })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          memberships (
            id,
            membership_type,
            status,
            start_date,
            end_date,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const membersWithMembership = data?.map(member => ({
        ...member,
        membership: member.memberships?.[0] || null,
      })) || [];

      setMembers(membersWithMembership);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateMember = async (id: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchMembers();
  };

  const deleteMember = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchMembers();
  };

  const updateMembership = async (userId: string, updates: Partial<Membership>) => {
    const { error } = await supabase
      .from('memberships')
      .update(updates)
      .eq('user_id', userId);
    
    if (error) throw error;
    await fetchMembers();
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers, updateMember, deleteMember, updateMembership };
}

// Class Types Management Hook
export function useClassTypes() {
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchClassTypes = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_types')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClassTypes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch class types');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createClassType = async (classType: Omit<ClassType, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('class_types')
      .insert(classType);
    
    if (error) throw error;
    await fetchClassTypes();
  };

  const updateClassType = async (id: string, updates: Partial<ClassType>) => {
    const { error } = await supabase
      .from('class_types')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchClassTypes();
  };

  const deleteClassType = async (id: string) => {
    const { error } = await supabase
      .from('class_types')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchClassTypes();
  };

  useEffect(() => {
    fetchClassTypes();
  }, [fetchClassTypes]);

  return { classTypes, loading, error, refetch: fetchClassTypes, createClassType, updateClassType, deleteClassType };
}

// Schedule Management Hook
export function useSchedule() {
  const [schedules, setSchedules] = useState<(ClassSchedule & { class_type?: ClassType; instructor?: Instructor })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('class_schedule')
        .select(`
          *,
          class_types (*),
          instructors (*)
        `)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      
      const processedData = data?.map(schedule => ({
        ...schedule,
        class_type: schedule.class_types,
        instructor: schedule.instructors,
      })) || [];
      
      setSchedules(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createSchedule = async (schedule: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('class_schedule')
      .insert(schedule);
    
    if (error) throw error;
    await fetchSchedules();
  };

  const updateSchedule = async (id: string, updates: Partial<ClassSchedule>) => {
    const { error } = await supabase
      .from('class_schedule')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchSchedules();
  };

  const deleteSchedule = async (id: string) => {
    const { error } = await supabase
      .from('class_schedule')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchSchedules();
  };

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return { schedules, loading, error, refetch: fetchSchedules, createSchedule, updateSchedule, deleteSchedule };
}

// Bookings Management Hook
export function useAdminBookings() {
  const [bookings, setBookings] = useState<(Booking & { 
    user?: Profile; 
    class_instance?: ClassInstance & { class_type?: ClassType } 
  })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profiles (*),
          class_instances (
            *,
            class_types (*)
          )
        `)
        .order('booked_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      const processedData = data?.map(booking => ({
        ...booking,
        user: booking.profiles,
        class_instance: {
          ...booking.class_instances,
          class_type: booking.class_instances?.class_types,
        },
      })) || [];
      
      setBookings(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchBookings();
  };

  const cancelBooking = async (id: string, reason?: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq('id', id);
    
    if (error) throw error;
    await fetchBookings();
  };

  const checkInBooking = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({
        attended: true,
        check_in_time: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
    await fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings, updateBooking, cancelBooking, checkInBooking };
}

// Announcements Management Hook
export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('announcements')
      .insert(announcement);
    
    if (error) throw error;
    await fetchAnnouncements();
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    const { error } = await supabase
      .from('announcements')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchAnnouncements();
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return { announcements, loading, error, refetch: fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement };
}

// Instructors Management Hook
export function useInstructors() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchInstructors = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setInstructors(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const createInstructor = async (instructor: Omit<Instructor, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('instructors')
      .insert(instructor);
    
    if (error) throw error;
    await fetchInstructors();
  };

  const updateInstructor = async (id: string, updates: Partial<Instructor>) => {
    const { error } = await supabase
      .from('instructors')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    await fetchInstructors();
  };

  const deleteInstructor = async (id: string) => {
    const { error } = await supabase
      .from('instructors')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchInstructors();
  };

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  return { instructors, loading, error, refetch: fetchInstructors, createInstructor, updateInstructor, deleteInstructor };
}

// Contact Submissions Hook
export function useContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
    await fetchSubmissions();
  };

  const markAsResponded = async (id: string, respondedBy: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ 
        responded_at: new Date().toISOString(),
        responded_by: respondedBy,
      })
      .eq('id', id);
    
    if (error) throw error;
    await fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchSubmissions();
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return { submissions, loading, error, refetch: fetchSubmissions, markAsRead, markAsResponded, deleteSubmission };
}