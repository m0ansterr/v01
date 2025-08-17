import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { data: episodes, error } = await supabase
      .from('episodes')
      .select('id, episode_id, title, description, category, tags, cover_image, pages, reading_time, rating, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch episodes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ episodes })

  } catch (error) {
    console.error('Fetch public episodes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}