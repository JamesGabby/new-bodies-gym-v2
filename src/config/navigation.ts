// src/config/navigation.ts
import {
  Home,
  Calendar,
  Dumbbell,
  Clock,
  Phone,
  User,
  Settings,
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
} from "lucide-react";

export const mainNavigation = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Timetable",
    href: "/timetable",
    icon: Calendar,
  },
  {
    title: "Facilities",
    href: "/facilities",
    icon: Dumbbell,
  },
  {
    title: "Book a Class",
    href: "/booking",
    icon: CalendarCheck,
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Phone,
  },
] as const;

export const userNavigation = [
  {
    title: "My Bookings",
    href: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export const adminNavigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    href: "/admin/members",
    icon: Users,
  },
  {
    title: "Classes",
    href: "/admin/classes",
    icon: Calendar,
  },
  {
    title: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;

export type MainNavItem = (typeof mainNavigation)[number];
export type UserNavItem = (typeof userNavigation)[number];
export type AdminNavItem = (typeof adminNavigation)[number];