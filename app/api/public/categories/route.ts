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

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      )
    }

    return NextResponse.json({ categories })

  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}