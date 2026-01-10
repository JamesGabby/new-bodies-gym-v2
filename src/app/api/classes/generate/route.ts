// src/app/api/classes/generate/route.ts
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { format, addDays } from 'date-fns'

export async function POST(request: Request) {
  try {
    const { startDate, endDate, authorization } = await request.json()

    // Simple auth check (in production, use proper admin auth)
    if (authorization !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdminClient()

    // Use the database function to generate instances
    const { data, error } = await supabase.rpc('generate_class_instances', {
      start_date: startDate || format(new Date(), 'yyyy-MM-dd'),
      end_date: endDate || format(addDays(new Date(), 14), 'yyyy-MM-dd'),
    })

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Generated ${data} class instances`,
      count: data,
    })
  } catch (error: any) {
    console.error('Error generating class instances:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate class instances' },
      { status: 500 }
    )
  }
}