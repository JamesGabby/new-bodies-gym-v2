// src/types/index.ts (continued)
import { ClassType, ClassInstance, Instructor, Booking, Profile } from './database.types'

// Extended types with relations
export interface ClassInstanceWithDetails extends ClassInstance {
  class_type: ClassType
  instructor: Instructor | null
  bookings?: Booking[]
}

export interface BookingWithDetails extends Booking {
  class_instance: ClassInstanceWithDetails
  user: Profile
}

export interface ClassScheduleWithDetails {
  id: string
  day_of_week: string
  start_time: string
  end_time: string
  location: string
  class_type: ClassType
  instructor: Instructor | null
}

export interface TimetableDay {
  day: string
  classes: ClassScheduleWithDetails[]
}

export interface UserWithMembership extends Profile {
  membership: {
    id: string
    type: string
    status: string
    end_date: string | null
  } | null
}

// API Response types
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

// Form types
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

// Filter types
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

// Dashboard stats
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

// Admin types
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

// Notification types
export interface Notification {
  id: string
  type: 'booking_confirmed' | 'booking_cancelled' | 'class_cancelled' | 'waitlist_promoted' | 'reminder'
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: Record<string, unknown>
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  profile: Profile | null
  membership: {
    id: string
    type: string
    status: string
    endDate: string | null
  } | null
}

export interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  isStaff: boolean
}

// Calendar types
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

// Opening hours type
export interface OpeningHours {
  day: string
  open: string
  close: string
  isClosed?: boolean
}

// Facility type
export interface Facility {
  name: string
  icon: string
  description: string
  image?: string
}

// Toast/Alert types
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

// Table column definition for admin tables
export interface TableColumn<T> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

// Breadcrumb type
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

// Search result type
export interface SearchResult {
  type: 'class' | 'member' | 'booking'
  id: string
  title: string
  subtitle?: string
  href: string
}

// Export all database types
export * from './database.types'