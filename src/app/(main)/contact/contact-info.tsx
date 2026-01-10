// src/app/(main)/contact/contact-info.tsx
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site'

export function ContactInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
            <Phone className="h-5 w-5 text-brand-lime-500" />
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="text-muted-foreground hover:text-brand-lime-500 transition-colors"
            >
              {siteConfig.contact.phone}
            </a>
            <p className="text-sm text-muted-foreground mt-1">
              Call us for class bookings or inquiries
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
            <Mail className="h-5 w-5 text-brand-lime-500" />
          </div>
          <div>
            <p className="font-medium">Email</p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-muted-foreground hover:text-brand-lime-500 transition-colors"
            >
              {siteConfig.contact.email}
            </a>
            <p className="text-sm text-muted-foreground mt-1">
              We'll respond within 24 hours
            </p>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-lime-500/10">
            <MapPin className="h-5 w-5 text-brand-lime-500" />
          </div>
          <div>
            <p className="font-medium">Address</p>
            <address className="text-muted-foreground not-italic">
              {siteConfig.contact.address.line1}
              <br />
              {siteConfig.contact.address.line2}
              <br />
              {siteConfig.contact.address.city}
              <br />
              {siteConfig.contact.address.postcode}
            </address>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address.full)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-lime-500 hover:underline mt-2 inline-block"
            >
              Get Directions →
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-border">
          <p className="font-medium mb-3">Follow Us</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
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
              className="rounded-full hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
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
              className="rounded-full hover:bg-brand-lime-500 hover:text-brand-charcoal-900 hover:border-brand-lime-500"
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
      </CardContent>
    </Card>
  )
}