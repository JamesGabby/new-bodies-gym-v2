// src/types/index.ts
import type { ReactNode } from 'react'

// ============================================
// Database Base Types (matching your schema)
// ============================================

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  date_of_birth: string | null
  avatar_url: string | null
  role: 'member' | 'staff' | 'admin'
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  health_conditions: string | null
  marketing_consent: boolean
  terms_accepted: boolean
  terms_accepted_at: string | null
  created_at: string
  updated_at: string
}

export interface ClassType {
  id: string
  name: string
  slug: string
  description: string | null
  duration_minutes: number
  max_capacity: number
  color: string | null
  icon: string | null
  difficulty_level: number | null  // integer 1-5 in database
  calories_burn_estimate: number | null
  equipment_needed: string[] | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Instructor {
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

export interface ClassSchedule {
  id: string
  class_type_id: string
  instructor_id: string | null
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string
  end_time: string
  location: string | null
  max_capacity: number | null
  is_active: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ClassInstance {
  id: string
  schedule_id: string | null
  class_type_id: string
  instructor_id: string | null
  date: string  // This is 'date' in the database, not 'class_date'
  start_time: string
  end_time: string
  location: string | null
  max_capacity: number
  current_capacity: number
  status: 'scheduled' | 'cancelled' | 'completed'
  cancellation_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  class_instance_id: string
  status: 'confirmed' | 'cancelled' | 'attended' | 'no_show'
  booked_at: string
  cancelled_at: string | null
  cancellation_reason: string | null
  attended: boolean | null
  check_in_time: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  user_id: string
  membership_type: 'monthly' | 'annual' | 'pay_as_you_go' | 'student' | 'senior'
  status: 'active' | 'cancelled' | 'expired' | 'suspended'
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

export interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  is_active: boolean
  start_date: string
  end_date: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Waitlist {
  id: string
  user_id: string
  class_instance_id: string
  position: number
  added_at: string
  notified_at: string | null
  expires_at: string | null
  created_at: string
}

export interface ContactSubmission {
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

export interface GymSetting {
  id: string
  key: string
  value: Record<string, unknown>
  description: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

// ============================================
// Extended Types with Relations
// ============================================

export interface ClassInstanceWithDetails extends ClassInstance {
  class_type: Pick<ClassType, 
    | 'id' 
    | 'name' 
    | 'description' 
    | 'color' 
    | 'duration_minutes' 
    | 'difficulty_level' 
    | 'calories_burn_estimate'
  > | null
  instructor: Pick<Instructor, 'id' | 'name'> | null
}

export interface BookingWithDetails extends Booking {
  class_instance: ClassInstanceWithDetails
  user: Profile
}

export interface ClassScheduleWithDetails extends ClassSchedule {
  class_type: ClassType
  instructor: Instructor | null
}

export interface TimetableDay {
  day: string
  classes: ClassScheduleWithDetails[]
}

export interface UserWithMembership extends Profile {
  membership: Pick<Membership, 'id' | 'membership_type' | 'status' | 'end_date'> | null
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// Form Types
// ============================================

export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  termsAccepted: boolean
  marketingConsent: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

export interface BookingFormData {
  classInstanceId: string
  notes?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export interface ProfileUpdateFormData {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  healthConditions?: string
}

// ============================================
// Filter Types
// ============================================

export interface ClassFilters {
  date?: string
  classTypeId?: string
  instructorId?: string
  dayOfWeek?: string
  location?: string
  hasAvailability?: boolean
}

export interface BookingFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  classTypeId?: string
  userId?: string
}

export interface MemberFilters {
  search?: string
  role?: string
  membershipStatus?: string
  membershipType?: string
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  totalMembers: number
  activeMembers: number
  todayBookings: number
  weeklyBookings: number
  popularClasses: {
    name: string
    bookings: number
  }[]
  recentBookings: BookingWithDetails[]
  upcomingClasses: ClassInstanceWithDetails[]
  membershipBreakdown: {
    type: string
    count: number
  }[]
}

// ============================================
// Admin Form Types
// ============================================

export interface AdminClassFormData {
  name: string
  slug: string
  description?: string
  durationMinutes: number
  maxCapacity: number
  color: string
  difficultyLevel: number
  caloriesBurnEstimate?: number
  equipmentNeeded?: string[]
  isActive: boolean
}

export interface AdminScheduleFormData {
  classTypeId: string
  instructorId?: string
  dayOfWeek: string
  startTime: string
  endTime: string
  location: string
  maxCapacity?: number
  isActive: boolean
}

export interface AdminInstructorFormData {
  name: string
  email?: string
  phone?: string
  bio?: string
  specializations?: string[]
  certifications?: string[]
  isActive: boolean
}

export interface AdminAnnouncementFormData {
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  isActive: boolean
  startDate: string
  endDate?: string
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  id: string
  type: 'booking_confirmed' | 'booking_cancelled' | 'class_cancelled' | 'waitlist_promoted' | 'reminder'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: Record<string, unknown>
}

// ============================================
// Auth Types
// ============================================

export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
  membership: Pick<Membership, 'id' | 'membership_type' | 'status' | 'end_date'> | null
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

// ============================================
// Calendar Types
// ============================================

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  color: string
  classType: ClassType
  instructor?: Instructor
  availableSpots: number
  isBooked: boolean
  location: string
}

// ============================================
// UI/Display Types
// ============================================

export interface OpeningHours {
  day: string
  open: string
  close: string
  isClosed?: boolean
}

export interface Facility {
  name: string
  icon: string
  description: string
  image?: string
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => ReactNode
  className?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface SearchResult {
  type: 'class' | 'member' | 'booking'
  id: string
  title: string
  subtitle?: string
  href: string
}

// ============================================
// Utility Types
// ============================================

// For Supabase query results that might return partial data
export type PartialClassInstance = Partial<ClassInstance> & { id: string }
export type PartialProfile = Partial<Profile> & { id: string }
export type PartialBooking = Partial<Booking> & { id: string }

// For creating new records (without id and timestamps)
export type CreateClassType = Omit<ClassType, 'id' | 'created_at' | 'updated_at'>
export type CreateInstructor = Omit<Instructor, 'id' | 'created_at' | 'updated_at'>
export type CreateClassSchedule = Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>
export type CreateBooking = Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booked_at'>

// For updating records (all fields optional except id)
export type UpdateProfile = Partial<Omit<Profile, 'id' | 'created_at'>> & { id: string }
export type UpdateClassType = Partial<Omit<ClassType, 'id' | 'created_at'>> & { id: string }