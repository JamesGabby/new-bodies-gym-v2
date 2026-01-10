// src/config/site.ts
export const siteConfig = {
  name: "New Bodies Gym",
  description: "Where everyone is welcome",
  motto: "Where everyone is welcome",
  url: "https://newbodiesgym.co.uk",
  ogImage: "https://newbodiesgym.co.uk/og.jpg",
  
  contact: {
    address: {
      line1: "Unit 6",
      line2: "Tongue Lane Ind. Estate",
      city: "Buxton",
      postcode: "SK17 7LF",
      full: "Unit 6, Tongue Lane Ind. Estate, Buxton, SK17 7LF",
    },
    phone: "01298 72006",
    email: "newbodiesgym@hotmail.co.uk",
  },

  openingHours: [
    { day: "Monday", open: "6:00am", close: "9:30pm" },
    { day: "Tuesday", open: "6:00am", close: "9:30pm" },
    { day: "Wednesday", open: "6:00am", close: "9:30pm" },
    { day: "Thursday", open: "6:00am", close: "9:30pm" },
    { day: "Friday", open: "6:00am", close: "8:00pm" },
    { day: "Saturday", open: "9:00am", close: "3:00pm" },
    { day: "Sunday", open: "9:00am", close: "3:00pm" },
    { day: "Bank Holidays", open: "9:00am", close: "3:00pm" },
  ],

  facilities: [
    { name: "Large Mixed Gyms", icon: "dumbbell", description: "Spacious gym floor with comprehensive equipment" },
    { name: "Ladies Only Zone", icon: "users", description: "Dedicated space for women to train comfortably" },
    { name: "Cardio Suites", icon: "heart-pulse", description: "Full range of cardio equipment" },
    { name: "Olympic Gym", icon: "trophy", description: "Fully equipped for Olympic lifting" },
    { name: "Power Zone", icon: "zap", description: "Heavy-duty equipment for serious lifters" },
    { name: "Resistance Machines", icon: "settings", description: "Full range of resistance machines" },
    { name: "Free Weights", icon: "dumbbell", description: "Comprehensive free weight selection" },
    { name: "Boxing Studio", icon: "swords", description: "Dedicated boxing and martial arts space" },
    { name: "Virtual Spin Studio", icon: "bike", description: "Immersive virtual cycling experience" },
    { name: "Fitness Studio", icon: "activity", description: "Multi-purpose group fitness space" },
    { name: "Personal Training", icon: "user-check", description: "One-on-one professional training" },
    { name: "Easyline Circuit", icon: "repeat", description: "Guided circuit training equipment" },
    { name: "Protein & Smoothie Bar", icon: "cup-soda", description: "Post-workout nutrition" },
    { name: "Sundome", icon: "sun", description: "Tanning facilities" },
    { name: "Changing & Showers", icon: "shower-head", description: "Modern changing facilities" },
    { name: "Free Parking", icon: "car", description: "Convenient parking on-site" },
    { name: "Coffee Machine", icon: "coffee", description: "Complimentary coffee" },
    { name: "Calisthenics Zone", icon: "move", description: "Bodyweight training area" },
  ],

  gymRules: [
    "PLEASE BOOK YOUR CLASS PLACE BY FOLLOWING THE BOOKING LINK OR VIA THE NEW BODIES APP, NON MEMBERS CALL 01298 72006 TO BOOK A CLASS.",
    "VALID LIVE MEMBERSHIP REQUIRED TO BOOK ANY CLASSES VIA THE LINK, NON MEMBERS WELCOME AND CAN BOOK A CLASS BY CALLING 01298 72006.",
    "YOU MUST TRAIN SAFELY AT ALL TIMES, PUT EQUIPMENT BACK AFTER USE AND RESPECT OTHERS TRAINING AROUND YOU.",
    "MOST OF ALL ENJOY YOUR TRAINING.",
  ],

  links: {
    booking: "/booking",
    appStore: "https://apps.apple.com/app/new-bodies-gym",
    playStore: "https://play.google.com/store/apps/details?id=com.newbodiesgym",
  },

  social: {
    facebook: "https://facebook.com/newbodiesgym",
    instagram: "https://instagram.com/newbodiesgym",
    twitter: "https://twitter.com/newbodiesgym",
  },
} as const;

export type SiteConfig = typeof siteConfig;