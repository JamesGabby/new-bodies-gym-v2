// src/components/layout/footer.tsx
'use client';

import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Apple,
  PlayCircle,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/config/site'
import { mainNavigation } from '@/config/navigation'

const footerLinks = {
  quickLinks: [
    { title: 'Home', href: '/' },
    { title: 'Timetable', href: '/timetable' },
    { title: 'Facilities', href: '/facilities' },
    { title: 'Book a Class', href: '/booking' },
    { title: 'Contact', href: '/contact' },
  ],
  legal: [
    { title: 'Terms & Conditions', href: '/terms' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Cookie Policy', href: '/cookies' },
    { title: 'Membership Terms', href: '/membership-terms' },
  ],
  membership: [
    { title: 'Join Now', href: '/signup' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'Student Discount', href: '/student' },
    { title: 'Corporate', href: '/corporate' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-brand-charcoal-900 border-t border-brand-charcoal-800">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Logo size="lg" className="mb-4" />
            <p className="text-brand-lime-500 font-medium mb-4">
              {siteConfig.motto}
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Your local gym in Buxton providing top-quality facilities and group
              fitness classes for all abilities. Join our community today!
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-brand-charcoal-700 hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
                asChild
              >
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-brand-charcoal-700 hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
                asChild
              >
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-brand-charcoal-700 hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
                asChild
              >
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Membership</h3>
            <ul className="space-y-3">
              {footerLinks.membership.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
                >
                  <Phone className="h-4 w-4 text-brand-lime-500" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-brand-lime-500 transition-colors"
                >
                  <Mail className="h-4 w-4 text-brand-lime-500" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-brand-lime-500 mt-0.5 shrink-0" />
                  <address className="not-italic">
                    {siteConfig.contact.address.line1}
                    <br />
                    {siteConfig.contact.address.line2}
                    <br />
                    {siteConfig.contact.address.city}
                    <br />
                    {siteConfig.contact.address.postcode}
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="mt-12 rounded-xl bg-brand-charcoal-800/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-brand-lime-500" />
            <h3 className="font-semibold text-foreground">Opening Hours</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {siteConfig.openingHours.map((hours) => (
              <div key={hours.day} className="text-sm">
                <span className="font-medium text-foreground">{hours.day}</span>
                <br />
                <span className="text-muted-foreground">
                  {hours.open} – {hours.close}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* App Download */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl bg-brand-lime-500/10 p-6">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Download the New Bodies Gym App
            </h3>
            <p className="text-sm text-muted-foreground">
              Book classes, track your progress, and more
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2 border-brand-charcoal-700 hover:bg-brand-charcoal-800"
              asChild
            >
              <a
                href={siteConfig.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Apple className="h-5 w-5" />
                App Store
              </a>
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-brand-charcoal-700 hover:bg-brand-charcoal-800"
              asChild
            >
              <a
                href={siteConfig.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayCircle className="h-5 w-5" />
                Google Play
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-charcoal-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {currentYear} {siteConfig.name}. All rights reserved.
            </p>
            <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-brand-lime-500 transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}