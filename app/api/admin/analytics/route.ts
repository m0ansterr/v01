'use client'

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

    // Get total storybooks
    const { count: totalStorybooks } = await supabase
      .from('episodes')
      .select('*', { count: 'exact', head: true })

    // Get total reading progress entries (reads)
    const { count: totalReads } = await supabase
      .from('reading_progress')
      .select('*', { count: 'exact', head: true })

    // Mock data for now - you can implement these later
    const analytics = {
      totalStorybooks: totalStorybooks || 0,
      totalReads: totalReads || 0,
      totalLikes: 0, // Implement when you add likes table
      totalUsers: 0, // Implement when you add user tracking
      recentActivity: [] // Implement activity tracking
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}