// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { Providers } from '@/components/providers'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - ${siteConfig.motto}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} in Buxton - ${siteConfig.motto}. State-of-the-art gym facilities, group fitness classes, personal training, and more. Join our welcoming community today!`,
  keywords: [
    'gym',
    'fitness',
    'Buxton',
    'New Bodies Gym',
    'personal training',
    'group classes',
    'spin',
    'pilates',
    'boxing',
    'weight training',
    'cardio',
  ],
  authors: [{ name: 'New Bodies Gym' }],
  creator: 'New Bodies Gym',
  publisher: 'New Bodies Gym',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: siteConfig.url,
    title: siteConfig.name,
    description: `${siteConfig.name} - ${siteConfig.motto}`,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: `${siteConfig.name} - ${siteConfig.motto}`,
    images: [siteConfig.ogImage],
    creator: '@newbodiesgym',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}