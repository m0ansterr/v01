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
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch episodes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ episodes })

  } catch (error) {
    console.error('Fetch episodes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const episodeId = searchParams.get('episode_id')

    if (!episodeId) {
      return NextResponse.json(
        { error: 'Episode ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('episodes')
      .delete()
      .eq('episode_id', episodeId)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete episode' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete episode error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}