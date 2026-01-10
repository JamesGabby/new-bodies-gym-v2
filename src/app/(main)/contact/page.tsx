// src/app/(main)/contact/page.tsx
import { Metadata } from 'next'
import { ContactForm } from './contact-form'
import { ContactInfo } from './contact-info'
import { OpeningHoursCard } from './opening-hours-card'
import { MapEmbed } from './map-embed'
import { Section, SectionHeader } from '@/components/shared/section'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with New Bodies Gym in Buxton. Find our address, phone number, email, and opening hours. We\'d love to hear from you!',
}

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-brand-charcoal-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="heading-1 text-white mb-4">Get in Touch</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Have a question or want to learn more about New Bodies Gym?
            We'd love to hear from you. Reach out using the form below or contact us directly.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <Section background="default" className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="heading-3 mb-6">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <ContactInfo />
            <OpeningHoursCard />
          </div>
        </div>
      </Section>

      {/* Map Section */}
      <Section background="muted" className="py-16 lg:py-24">
        <SectionHeader
          subtitle="Find Us"
          title="Visit New Bodies Gym"
          description="Located in Tongue Lane Industrial Estate, Buxton with free parking available."
        />
        <MapEmbed />
      </Section>
    </>
  )
}