// src/app/layout.tsx (final version)
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { CookieConsent } from '@/components/cookie-consent';
import { Analytics } from '@/components/analytics';
import { LocalBusinessSchema } from '@/components/structured-data';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://newbodiesgym.co.uk'),
  title: {
    default: 'New Bodies Gym | Where Everyone is Welcome | Buxton',
    template: '%s | New Bodies Gym',
  },
  description: 'New Bodies Gym in Buxton - where everyone is welcome. Full gym facilities, group classes, personal training, and more. Join today!',
  keywords: [
    'gym',
    'fitness',
    'Buxton',
    'gym near me',
    'fitness classes',
    'personal training',
    'weight training',
    'cardio',
    'spin classes',
    'yoga',
    'pilates',
    'boxing',
    'New Bodies Gym',
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
    url: 'https://newbodiesgym.co.uk',
    siteName: 'New Bodies Gym',
    title: 'New Bodies Gym | Where Everyone is Welcome',
    description: 'New Bodies Gym in Buxton - where everyone is welcome. Full gym facilities, group classes, personal training, and more.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'New Bodies Gym - Where Everyone is Welcome',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Bodies Gym | Where Everyone is Welcome',
    description: 'New Bodies Gym in Buxton - where everyone is welcome. Full gym facilities, group classes, and more.',
    images: ['/images/og-image.jpg'],
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
  alternates: {
    canonical: 'https://newbodiesgym.co.uk',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <LocalBusinessSchema />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
          <CookieConsent />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}