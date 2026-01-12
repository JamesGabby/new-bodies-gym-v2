// src/lib/validations.ts
import { z } from 'zod'

// Auth validations
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters'),
    phone: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[\d\s\-+()]{10,}$/.test(val),
        'Please enter a valid phone number'
      ),
    dateOfBirth: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          const date = new Date(val)
          const today = new Date()
          const age = today.getFullYear() - date.getFullYear()
          return age >= 16 && age <= 100
        },
        'You must be at least 16 years old to join'
      ),
    termsAccepted: z
      .boolean()
      .refine((val) => val === true, 'You must accept the terms and conditions'),
    marketingConsent: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// Profile validations
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{10,}$/.test(val),
      'Please enter a valid phone number'
    ),
  dateOfBirth: z.string().optional(),
  emergencyContactName: z
    .string()
    .max(100, 'Emergency contact name must be less than 100 characters')
    .optional(),
  emergencyContactPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{10,}$/.test(val),
      'Please enter a valid phone number'
    ),
  healthConditions: z
    .string()
    .max(500, 'Health conditions must be less than 500 characters')
    .optional(),
})

// Contact form validation
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{10,}$/.test(val),
      'Please enter a valid phone number'
    ),
  subject: z
    .string()
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
})

// Booking validation
export const bookingSchema = z.object({
  classInstanceId: z.string().uuid('Invalid class ID'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
})

export const cancelBookingSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  reason: z
    .string()
    .max(500, 'Reason must be less than 500 characters')
    .optional(),
})

// Admin validations
export const classTypeSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  durationMinutes: z
    .number()
    .min(15, 'Duration must be at least 15 minutes')
    .max(180, 'Duration must be less than 180 minutes'),
  maxCapacity: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(100, 'Capacity must be less than 100'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Please enter a valid hex color'),
  difficultyLevel: z
    .number()
    .min(1, 'Difficulty must be between 1 and 5')
    .max(5, 'Difficulty must be between 1 and 5'),
  caloriesBurnEstimate: z
    .number()
    .min(0, 'Calories must be positive')
    .max(2000, 'Calories must be less than 2000')
    .optional(),
  equipmentNeeded: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
})

export const scheduleSchema = z
  .object({
    classTypeId: z.string().uuid('Please select a class type'),
    instructorId: z.string().uuid('Invalid instructor ID').optional(),
    dayOfWeek: z.enum([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please enter a valid time (HH:MM)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please enter a valid time (HH:MM)'),
    location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
    maxCapacity: z
      .number()
      .min(1, 'Capacity must be at least 1')
      .max(100, 'Capacity must be less than 100')
      .optional(),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      const start = data.startTime.split(':').map(Number)
      const end = data.endTime.split(':').map(Number)
      const startMinutes = start[0] * 60 + start[1]
      const endMinutes = end[0] * 60 + end[1]
      return endMinutes > startMinutes
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  )

export const instructorSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{10,}$/.test(val),
      'Please enter a valid phone number'
    ),
  bio: z
    .string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional(),
  specializations: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
})

export const announcementSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters')
    .max(2000, 'Content must be less than 2000 characters'),
  type: z.enum(['info', 'warning', 'success', 'error']).default('info'),
  isActive: z.boolean().default(true),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
})

export const membershipSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  membershipType: z.enum(['monthly', 'annual', 'pay_as_you_go', 'student', 'senior', 'family']),
  status: z.enum(['active', 'inactive', 'suspended', 'cancelled', 'expired']).default('active'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  autoRenew: z.boolean().default(true),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type BookingInput = z.infer<typeof bookingSchema>
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>
export type ClassTypeInput = z.infer<typeof classTypeSchema>
export type ScheduleInput = z.infer<typeof scheduleSchema>
export type InstructorInput = z.infer<typeof instructorSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
export type MembershipInput = z.infer<typeof membershipSchema>
export type SignUpInput = z.infer<typeof signUpSchema>      // Output type (for after validation)
export type SignUpFormInput = z.input<typeof signUpSchema>  // Input type (for form)