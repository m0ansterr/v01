import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Only run auth middleware if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })
    const { data: { session } } = await supabase.auth.getSession()

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // Redirect to admin if already logged in and trying to access login
    if (req.nextUrl.pathname === '/login' && session) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return res
  } catch (error) {
    // If there's an error with Supabase, just continue
    return res
  }
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}