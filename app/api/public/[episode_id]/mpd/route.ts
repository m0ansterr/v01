import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { episode_id: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { episode_id } = params

    // Get episode from database
    const { data: episode, error } = await supabase
      .from('episodes')
      .select('mpd_url')
      .eq('episode_id', episode_id)
      .eq('published', true)
      .single()

    if (error || !episode) {
      return NextResponse.json(
        { error: 'Episode not found' },
        { status: 404 }
      )
    }

    // Fetch MPD from external storage
    const response = await fetch(episode.mpd_url)
    if (!response.ok) {
      return NextResponse.json(
        { error: 'MPD file not accessible' },
        { status: 404 }
      )
    }

    const mpd = await response.json()
    
    return NextResponse.json(mpd)

  } catch (error) {
    console.error('Fetch MPD error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}