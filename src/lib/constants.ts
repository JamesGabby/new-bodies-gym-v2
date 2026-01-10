// src/lib/constants.ts
// Membership pricing
export const MEMBERSHIP_PRICES = {
  monthly: 29.99,
  annual: 299.99,
  pay_as_you_go: 8.00,
  student: 24.99,
  senior: 24.99,
  family: 49.99,
} as const

// Membership type labels
export const MEMBERSHIP_TYPE_LABELS: Record<string, string> = {
  monthly: 'Monthly',
  annual: 'Annual',
  pay_as_you_go: 'Pay As You Go',
  student: 'Student',
  senior: 'Senior',
  family: 'Family',
}

// Booking status labels and colors
export const BOOKING_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  completed: { label: 'Completed', color: 'blue' },
  no_show: { label: 'No Show', color: 'gray' },
}

// Class status labels and colors
export const CLASS_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  scheduled: { label: 'Scheduled', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  completed: { label: 'Completed', color: 'blue' },
}

// Membership status labels and colors
export const MEMBERSHIP_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'green' },
  inactive: { label: 'Inactive', color: 'gray' },
  suspended: { label: 'Suspended', color: 'yellow' },
  cancelled: { label: 'Cancelled', color: 'red' },
  expired: { label: 'Expired', color: 'red' },
}

// User role labels
export const USER_ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  staff: 'Staff',
  admin: 'Admin',
  super_admin: 'Super Admin',
}

// Days of week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export const DAYS_OF_WEEK_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  { value: 1, label: 'Beginner', color: 'green' },
  { value: 2, label: 'Easy', color: 'lime' },
  { value: 3, label: 'Moderate', color: 'yellow' },
  { value: 4, label: 'Challenging', color: 'orange' },
  { value: 5, label: 'Advanced', color: 'red' },
] as const

// Announcement types
export const ANNOUNCEMENT_TYPES = [
  { value: 'info', label: 'Information', color: 'blue' },
  { value: 'warning', label: 'Warning', color: 'yellow' },
  { value: 'success', label: 'Success', color: 'green' },
  { value: 'error', label: 'Error', color: 'red' },
] as const

// Time slots for scheduling (15-minute intervals)
export const TIME_SLOTS = Array.from({ length: 64 }, (_, i) => {
  const hour = Math.floor(i / 4) + 6 // Start at 6am
  const minute = (i % 4) * 15
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}).filter((time) => {
  const hour = parseInt(time.split(':')[0])
  return hour <= 22 // End at 10pm
})

// Locations
export const CLASS_LOCATIONS = [
  'Fitness Studio',
  'Virtual Spin Studio',
  'Boxing Studio',
  'Main Gym',
  'Power Zone',
  'Ladies Only Zone',
  'Outdoor Area',
] as const

// Booking settings
export const BOOKING_SETTINGS = {
  maxAdvanceDays: 14, // How far in advance can book
  minCancelHours: 2, // Minimum hours before class to cancel
  maxBookingsPerDay: 3, // Max classes per day
  waitlistEnabled: true,
  waitlistMaxSize: 10,
} as const

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
} as const

// Cache times (in seconds)
export const CACHE_TIMES = {
  classTypes: 3600, // 1 hour
  schedule: 1800, // 30 minutes
  openingHours: 86400, // 24 hours
  facilities: 86400, // 24 hours
} as const

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
} as const

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  search: 'ctrl+k',
  newBooking: 'ctrl+b',
  dashboard: 'ctrl+d',
  help: '?',
} as const

// File upload limits
export const FILE_UPLOAD = {
  maxSizeMB: 5,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocTypes: ['application/pdf'],
} as const

// Social links
export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/newbodiesgym',
  instagram: 'https://instagram.com/newbodiesgym',
  twitter: 'https://twitter.com/newbodiesgym',
} as const

// App store links
export const APP_STORE_LINKS = {
  apple: 'https://apps.apple.com/app/new-bodies-gym',
  android: 'https://play.google.com/store/apps/details?id=com.newbodiesgym',
} as const

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  bookingFull: 'Sorry, this class is fully booked.',
  bookingClosed: 'Booking for this class has closed.',
  alreadyBooked: 'You have already booked this class.',
  noMembership: 'An active membership is required to book classes.',
  cancelTooLate: 'It is too late to cancel this booking.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  bookingCreated: 'Your class has been booked successfully!',
  bookingCancelled: 'Your booking has been cancelled.',
  profileUpdated: 'Your profile has been updated.',
  passwordChanged: 'Your password has been changed.',
  messageSent: 'Your message has been sent. We will get back to you soon.',
  signedUp: 'Welcome to New Bodies Gym! Please check your email to verify your account.',
  loggedIn: 'Welcome back!',
  loggedOut: 'You have been logged out.',
} as const