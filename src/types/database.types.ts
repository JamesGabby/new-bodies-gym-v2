// src/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          avatar_url: string | null
          role: 'member' | 'staff' | 'admin' | 'super_admin'
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          health_conditions: string | null
          marketing_consent: boolean
          terms_accepted: boolean
          terms_accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          role?: 'member' | 'staff' | 'admin' | 'super_admin'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_conditions?: string | null
          marketing_consent?: boolean
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          avatar_url?: string | null
          role?: 'member' | 'staff' | 'admin' | 'super_admin'
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          health_conditions?: string | null
          marketing_consent?: boolean
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      memberships: {
        Row: {
          id: string
          user_id: string
          membership_type: 'monthly' | 'annual' | 'pay_as_you_go' | 'student' | 'senior' | 'family'
          status: 'active' | 'inactive' | 'suspended' | 'cancelled' | 'expired'
          start_date: string
          end_date: string | null
          price: number
          auto_renew: boolean
          payment_method: string | null
          stripe_subscription_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          membership_type: 'monthly' | 'annual' | 'pay_as_you_go' | 'student' | 'senior' | 'family'
          status?: 'active' | 'inactive' | 'suspended' | 'cancelled' | 'expired'
          start_date: string
          end_date?: string | null
          price: number
          auto_renew?: boolean
          payment_method?: string | null
          stripe_subscription_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          membership_type?: 'monthly' | 'annual' | 'pay_as_you_go' | 'student' | 'senior' | 'family'
          status?: 'active' | 'inactive' | 'suspended' | 'cancelled' | 'expired'
          start_date?: string
          end_date?: string | null
          price?: number
          auto_renew?: boolean
          payment_method?: string | null
          stripe_subscription_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      class_types: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          duration_minutes: number
          max_capacity: number
          color: string
          icon: string | null
          difficulty_level: number
          calories_burn_estimate: number | null
          equipment_needed: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          duration_minutes?: number
          max_capacity?: number
          color?: string
          icon?: string | null
          difficulty_level?: number
          calories_burn_estimate?: number | null
          equipment_needed?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          duration_minutes?: number
          max_capacity?: number
          color?: string
          icon?: string | null
          difficulty_level?: number
          calories_burn_estimate?: number | null
          equipment_needed?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      instructors: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string | null
          phone: string | null
          bio: string | null
          avatar_url: string | null
          specializations: string[] | null
          certifications: string[] | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          specializations?: string[] | null
          certifications?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string | null
          phone?: string | null
          bio?: string | null
          avatar_url?: string | null
          specializations?: string[] | null
          certifications?: string[] | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      class_schedule: {
        Row: {
          id: string
          class_type_id: string
          instructor_id: string | null
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          start_time: string
          end_time: string
          location: string
          max_capacity: number | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_type_id: string
          instructor_id?: string | null
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          start_time: string
          end_time: string
          location?: string
          max_capacity?: number | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_type_id?: string
          instructor_id?: string | null
          day_of_week?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          start_time?: string
          end_time?: string
          location?: string
          max_capacity?: number | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      class_instances: {
        Row: {
          id: string
          schedule_id: string | null
          class_type_id: string
          instructor_id: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          max_capacity: number
          current_capacity: number
          status: 'scheduled' | 'cancelled' | 'completed'
          cancellation_reason: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          schedule_id?: string | null
          class_type_id: string
          instructor_id?: string | null
          date: string
          start_time: string
          end_time: string
          location?: string
          max_capacity: number
          current_capacity?: number
          status?: 'scheduled' | 'cancelled' | 'completed'
          cancellation_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          schedule_id?: string | null
          class_type_id?: string
          instructor_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          max_capacity?: number
          current_capacity?: number
          status?: 'scheduled' | 'cancelled' | 'completed'
          cancellation_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          class_instance_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          booked_at: string
          cancelled_at: string | null
          cancellation_reason: string | null
          attended: boolean | null
          check_in_time: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          class_instance_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          booked_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          attended?: boolean | null
          check_in_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          class_instance_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          booked_at?: string
          cancelled_at?: string | null
          cancellation_reason?: string | null
          attended?: boolean | null
          check_in_time?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      waitlist: {
        Row: {
          id: string
          user_id: string
          class_instance_id: string
          position: number
          added_at: string
          notified_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          class_instance_id: string
          position: number
          added_at?: string
          notified_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          class_instance_id?: string
          position?: number
          added_at?: string
          notified_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      gym_settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          type: string
          is_active: boolean
          start_date: string
          end_date: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          type?: string
          is_active?: boolean
          start_date?: string
          end_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          type?: string
          is_active?: boolean
          start_date?: string
          end_date?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          is_read: boolean
          responded_at: string | null
          responded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          is_read?: boolean
          responded_at?: string | null
          responded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          is_read?: boolean
          responded_at?: string | null
          responded_by?: string | null
          created_at?: string
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_data: Json | null
          new_data: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_active_membership: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_available_spots: {
        Args: { class_instance_uuid: string }
        Returns: number
      }
      generate_class_instances: {
        Args: { start_date: string; end_date: string }
        Returns: number
      }
    }
    Enums: {
      user_role: 'member' | 'staff' | 'admin' | 'super_admin'
      membership_status: 'active' | 'inactive' | 'suspended' | 'cancelled' | 'expired'
      membership_type: 'monthly' | 'annual' | 'pay_as_you_go' | 'student' | 'senior' | 'family'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      class_status: 'scheduled' | 'cancelled' | 'completed'
      day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Convenience types
export type Profile = Tables<'profiles'>
export type Membership = Tables<'memberships'>
export type ClassType = Tables<'class_types'>
export type Instructor = Tables<'instructors'>
export type ClassSchedule = Tables<'class_schedule'>
export type ClassInstance = Tables<'class_instances'>
export type Booking = Tables<'bookings'>
export type Waitlist = Tables<'waitlist'>
export type GymSetting = Tables<'gym_settings'>
export type Announcement = Tables<'announcements'>
export type ContactSubmission = Tables<'contact_submissions'>
export type AuditLog = Tables<'audit_log'>

export type UserRole = Enums<'user_role'>
export type MembershipStatus = Enums<'membership_status'>
export type MembershipType = Enums<'membership_type'>
export type BookingStatus = Enums<'booking_status'>
export type ClassStatus = Enums<'class_status'>
export type DayOfWeek = Enums<'day_of_week'>