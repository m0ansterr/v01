import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null

export type Episode = {
  id: string
  episode_id: string
  title: string
  description?: string
  category: string
  tags: string[]
  cover_image?: string
  pages: number
  mpd_url: string
  reading_time: number
  rating: number
  uploaded_at: string
  published: boolean
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  color: string
  created_at: string
}

export type User = {
  id: string
  email: string
  created_at: string
}

export type ReadingProgress = {
  id: string
  user_id: string
  episode_id: string
  current_page: number
  total_pages: number
  completed: boolean
  last_read_at: string
}