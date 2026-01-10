// src/app/(main)/contact/map-embed.tsx
import { siteConfig } from '@/config/site'

export function MapEmbed() {
  const address = encodeURIComponent(siteConfig.contact.address.full)
  
  return (
    <div className="relative rounded-2xl overflow-hidden border border-border h-[400px] lg:h-[500px]">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${address}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="New Bodies Gym Location"
        className="grayscale hover:grayscale-0 transition-all duration-500"
      />
      
      {/* Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm">
        <div className="rounded-xl bg-card/95 backdrop-blur border border-border p-4 shadow-lg">
          <h3 className="font-semibold mb-1">{siteConfig.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">
            {siteConfig.contact.address.full}
          </p>
          <div className="flex gap-2">
            <a
              href={`https://maps.google.com/?q=${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand-lime-500 hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}