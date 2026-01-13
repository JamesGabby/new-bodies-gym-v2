// src/components/home/announcement-banner-client.tsx
'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const iconMap = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
}

const colorMap = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
  success: 'bg-green-500/10 border-green-500/20 text-green-500',
  error: 'bg-red-500/10 border-red-500/20 text-red-500',
}

interface Announcement {
  id: string
  title: string
  content: string
  type: string | null  // Allow null
}

export function AnnouncementBannerClient() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    async function fetchAnnouncement() {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('announcements')
        .select('id, title, content, type')  // Select only needed fields
        .eq('is_active', true)
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setAnnouncement(data)
    }

    fetchAnnouncement()
  }, [])

  if (!announcement) return null

  const type = announcement.type ?? 'info'  // Default to 'info' if null
  const Icon = iconMap[type as keyof typeof iconMap] || Info
  const colors = colorMap[type as keyof typeof colorMap] || colorMap.info

  return (
    <div className={cn('border-b', colors)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-semibold">{announcement.title}:</span>{' '}
            {announcement.content}
          </p>
        </div>
      </div>
    </div>
  )
}