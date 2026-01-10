// src/stores/booking-store.ts
import { create } from 'zustand'
import { ClassInstanceWithDetails } from '@/types'

interface BookingState {
  selectedClass: ClassInstanceWithDetails | null
  selectedDate: Date
  isBookingModalOpen: boolean
  
  // Actions
  setSelectedClass: (classInstance: ClassInstanceWithDetails | null) => void
  setSelectedDate: (date: Date) => void
  openBookingModal: (classInstance: ClassInstanceWithDetails) => void
  closeBookingModal: () => void
  reset: () => void
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedClass: null,
  selectedDate: new Date(),
  isBookingModalOpen: false,

  setSelectedClass: (classInstance) => set({ selectedClass: classInstance }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  openBookingModal: (classInstance) =>
    set({
      selectedClass: classInstance,
      isBookingModalOpen: true,
    }),
    
  closeBookingModal: () =>
    set({
      isBookingModalOpen: false,
      selectedClass: null,
    }),
    
  reset: () =>
    set({
      selectedClass: null,
      selectedDate: new Date(),
      isBookingModalOpen: false,
    }),
}))